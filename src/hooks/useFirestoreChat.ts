import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import {
  getOrCreateChatRoom,
  sendMessage,
  subscribeToMessages,
  subscribeToChatRooms,
  markMessageAsRead,
  deleteMessage,
  addReaction,
  removeReaction,
  updateGroupName,
  addMembersToGroup,
  removeMemberFromGroup,
  ChatMessage,
  ChatRoom,
} from '@/lib/firestore/chat';
import { useFirebaseAuth } from './useFirebaseAuth';

export const useFirestoreChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);
  const [unsubscribeChatRooms, setUnsubscribeChatRooms] = useState<(() => void) | null>(null);
  
  // Thêm ref để track current active chat room
  const currentActiveChatRef = useRef<string | null>(null);
  const messagesSubscriptionRef = useRef<(() => void) | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const { user: firebaseUser, signInAnonymouslyIfNeeded } = useFirebaseAuth();

  // Helper để lấy userId an toàn
  const getUserId = () => {
    if (!user) return undefined;
    if (typeof user === 'string') {
      try {
        const parsed = JSON.parse(user);
        return parsed._id;
      } catch {
        return undefined;
      }
    }
    return user._id;
  };

  // Helper để lấy thông tin user hiện tại
  const getCurrentUserInfo = () => {
    if (!user) return null;
    if (typeof user === 'string') {
      try {
        const parsed = JSON.parse(user);
        return {
          name: parsed.name || 'Unknown User',
          email: parsed.email || '',
          avatar: parsed.avatar || null
        };
      } catch {
        return null;
      }
    }
    return {
      name: user.name || 'Unknown User',
      email: user.email || '',
      avatar: user.avatar || null
    };
  };

  // Subscribe to chat rooms
  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const setupChatRoomsSubscription = async () => {
      try {
        // Đảm bảo có mock user cho Firestore
        if (!firebaseUser) {
          await signInAnonymouslyIfNeeded();
        }

        const unsubscribe = subscribeToChatRooms(userId, rooms => {
          console.log('Chat rooms updated:', rooms.length, 'rooms');
          setChatRooms(rooms);
        });

        setUnsubscribeChatRooms(() => unsubscribe);

        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up chat rooms subscription:', error);
      }
    };

    setupChatRoomsSubscription();
  }, [user, firebaseUser]); // Removed signInAnonymouslyIfNeeded from dependencies

  // Subscribe to messages when active chat room changes
  useEffect(() => {
    if (!activeChatRoomId) {
      setMessages([]);
      currentActiveChatRef.current = null;
      return;
    }

    const setupMessagesSubscription = async () => {
      try {
        // Đảm bảo có mock user cho Firestore
        if (!firebaseUser) {
          await signInAnonymouslyIfNeeded();
        }

        // Cleanup previous subscription
        if (messagesSubscriptionRef.current) {
          messagesSubscriptionRef.current();
          messagesSubscriptionRef.current = null;
        }

        // Set current active chat
        currentActiveChatRef.current = activeChatRoomId;

        const unsubscribe = subscribeToMessages(activeChatRoomId, (newMessages) => {
          // Chỉ update messages nếu vẫn đang ở cùng chat room
          if (currentActiveChatRef.current === activeChatRoomId) {
            console.log('Messages updated for chat room:', activeChatRoomId, 'count:', newMessages.length);
            setMessages(newMessages);
          }
        });

        messagesSubscriptionRef.current = unsubscribe;

        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
      } catch (error) {
        console.error('Error setting up messages subscription:', error);
      }
    };

    setupMessagesSubscription();
  }, [activeChatRoomId, firebaseUser]); // Removed signInAnonymouslyIfNeeded from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (messagesSubscriptionRef.current) messagesSubscriptionRef.current();
      if (unsubscribeChatRooms) unsubscribeChatRooms();
    };
  }, [unsubscribeChatRooms]);

  const sendMessageHandler = useCallback(
    async (
      receiverId: string, 
      content: string, 
      type: 'text' | 'image' | 'file' = 'text',
      replyTo?: {
        messageId: string;
        content: string;
        senderId: string;
      }
    ) => {
      const userId = getUserId();
      if (!userId) {
        setError('User not authenticated');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Đảm bảo có mock user cho Firestore
        if (!firebaseUser) {
          await signInAnonymouslyIfNeeded();
        }

        // Lấy thông tin user hiện tại
        const senderInfo = getCurrentUserInfo();
        if (!senderInfo) {
          setError('User information not available');
          return;
        }

        // Nếu có activeChatRoomId, sử dụng nó (cho group chat)
        if (activeChatRoomId) {
          // Send message trực tiếp vào chat room hiện tại
          await sendMessage(activeChatRoomId, userId, receiverId, content, type, replyTo, senderInfo);
        } else {
          // Get or create chat room (cho 1-1 chat)
          const chatRoomId = await getOrCreateChatRoom(userId, receiverId);
          await sendMessage(chatRoomId, userId, receiverId, content, type, replyTo, senderInfo);
          
          // Set active chat room if not already set
          setActiveChatRoomId(chatRoomId);
        }
      } catch (err) {
        console.error('Error sending message:', err);
        setError(err instanceof Error ? err.message : 'Failed to send message');
      } finally {
        setLoading(false);
      }
    },
    [user, activeChatRoomId, firebaseUser] // Removed getUserId and signInAnonymouslyIfNeeded
  );

  const sendReactionHandler = useCallback(
    async (messageId: string, emoji: string) => {
      const userId = getUserId();
      if (!userId || !activeChatRoomId) {
        setError('User not authenticated or no active chat');
        return;
      }

      try {
        setError(null);
        
        // Đảm bảo có mock user cho Firestore
        if (!firebaseUser) {
          await signInAnonymouslyIfNeeded();
        }
        
        await addReaction(activeChatRoomId, messageId, userId, emoji);
      } catch (err) {
        console.error('Error adding reaction:', err);
        setError(err instanceof Error ? err.message : 'Failed to add reaction');
      }
    },
    [user, activeChatRoomId, firebaseUser] // Removed getUserId and signInAnonymouslyIfNeeded
  );

  const removeReactionHandler = useCallback(
    async (messageId: string, emoji: string) => {
      const userId = getUserId();
      if (!userId || !activeChatRoomId) {
        setError('User not authenticated or no active chat');
        return;
      }

      try {
        setError(null);
        
        // Đảm bảo có mock user cho Firestore
        if (!firebaseUser) {
          await signInAnonymouslyIfNeeded();
        }
        
        await removeReaction(activeChatRoomId, messageId, userId, emoji);
      } catch (err) {
        console.error('Error removing reaction:', err);
        setError(err instanceof Error ? err.message : 'Failed to remove reaction');
      }
    },
    [user, activeChatRoomId, firebaseUser] // Removed getUserId and signInAnonymouslyIfNeeded
  );

  const joinChat = useCallback(async (chatRoomId: string) => {
    setActiveChatRoomId(chatRoomId);
  }, []);

  const leaveChat = useCallback(() => {
    setActiveChatRoomId(null);
    setMessages([]);
  }, []);

  const setActiveChatRoomIdHandler = useCallback((chatRoomId: string | null) => {
    setActiveChatRoomId(chatRoomId);
  }, []);

  const markAsRead = useCallback(
    async (messageId: string) => {
      if (!activeChatRoomId) return;

      try {
        // Đảm bảo có mock user cho Firestore
        if (!firebaseUser) {
          await signInAnonymouslyIfNeeded();
        }
        
        await markMessageAsRead(activeChatRoomId, messageId);
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    },
    [activeChatRoomId, firebaseUser] // Removed signInAnonymouslyIfNeeded
  );

  const deleteMessageHandler = useCallback(
    async (messageId: string) => {
      if (!activeChatRoomId) return;

      try {
        // Đảm bảo có mock user cho Firestore
        if (!firebaseUser) {
          await signInAnonymouslyIfNeeded();
        }
        
        await deleteMessage(activeChatRoomId, messageId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete message');
      }
    },
    [activeChatRoomId, firebaseUser] // Removed signInAnonymouslyIfNeeded
  );

  // Group management functions
  const updateGroupNameHandler = useCallback(
    async (newName: string) => {
      if (!activeChatRoomId) {
        setError('No active chat room');
        return;
      }

      try {
        setError(null);
        
        // Đảm bảo có mock user cho Firestore
        if (!firebaseUser) {
          await signInAnonymouslyIfNeeded();
        }
        
        await updateGroupName(activeChatRoomId, newName);
      } catch (err) {
        console.error('Error updating group name:', err);
        setError(err instanceof Error ? err.message : 'Failed to update group name');
        throw err;
      }
    },
    [activeChatRoomId, firebaseUser] // Removed signInAnonymouslyIfNeeded
  );

  const addMembersToGroupHandler = useCallback(
    async (memberIds: string[]) => {
      if (!activeChatRoomId) {
        setError('No active chat room');
        return;
      }

      try {
        setError(null);
        
        // Đảm bảo có mock user cho Firestore
        if (!firebaseUser) {
          await signInAnonymouslyIfNeeded();
        }
        // Chuẩn bị thông tin tên/email để lưu sang participantUsers trong Firestore
        const memberInfos = memberIds.map(id => {
          const info = getCurrentUserInfo();
          if (getUserId() === id && info) {
            return { _id: id, name: info.name, email: info.email } as any;
          }
          return { _id: id } as any;
        });

        await addMembersToGroup(activeChatRoomId, memberIds as any, memberInfos as any);
      } catch (err) {
        console.error('Error adding members to group:', err);
        setError(err instanceof Error ? err.message : 'Failed to add members to group');
        throw err;
      }
    },
    [activeChatRoomId, firebaseUser] // Removed signInAnonymouslyIfNeeded
  );

  const removeMemberFromGroupHandler = useCallback(
    async (memberId: string) => {
      if (!activeChatRoomId) {
        setError('No active chat room');
        return;
      }

      try {
        setError(null);
        
        // Đảm bảo có mock user cho Firestore
        if (!firebaseUser) {
          await signInAnonymouslyIfNeeded();
        }
        
        await removeMemberFromGroup(activeChatRoomId, memberId);
      } catch (err) {
        console.error('Error removing member from group:', err);
        setError(err instanceof Error ? err.message : 'Failed to remove member from group');
        throw err;
      }
    },
    [activeChatRoomId, firebaseUser] // Removed signInAnonymouslyIfNeeded
  );

  return {
    messages,
    chatRooms,
    loading,
    error,
    activeChatRoomId,
    sendMessage: sendMessageHandler,
    sendReaction: sendReactionHandler,
    removeReaction: removeReactionHandler,
    joinChat,
    leaveChat,
    markAsRead,
    deleteMessage: deleteMessageHandler,
    setActiveChatRoomId: setActiveChatRoomIdHandler,
    updateGroupName: updateGroupNameHandler,
    addMembersToGroup: addMembersToGroupHandler,
    removeMemberFromGroup: removeMemberFromGroupHandler,
  };
};
