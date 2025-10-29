'use client';
import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setActiveChat } from '@/lib/redux/features/chat/chatSlice';
import { useFirestoreChat } from '@/hooks/useFirestoreChat';
import { ChatList, ChatRoom } from '@/components/chat';
import { backfillDisplayNames } from '@/lib/firestore/chat';
import Loading from '@/components/common/Loading';

// Check if Firebase is available
const isFirebaseAvailable = () => {
  return typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
};


const MessagePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Parse current user
  const currentUser = typeof user === 'string' ? JSON.parse(user || '{}') : user;
  const currentUserId = useMemo(() => {
    const id = currentUser?._id || currentUser?.id;
    return id;
  }, [currentUser]);

  // Firestore chat hook - only use if Firebase is available
  const firebaseAvailable = isFirebaseAvailable();
  const {
    chatRooms,
    joinChat,
    leaveChat,
    activeChatRoomId: activeChatRoomIdHook,
    setActiveChatRoomId,
    messages,
    sendMessage,
    loading,
    error,
    sendReaction,
    updateGroupName,
    addMembersToGroup,
    removeMemberFromGroup
  } = useFirestoreChat();

  // State loading cho box chat
  const [isChatLoading, setIsChatLoading] = useState(false);
  const prevChatRoomId = useRef<string | null>(null);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [retryCount, setRetryCount] = useState(0);



  // Fetch all users whenever chatRooms thay đổi (đảm bảo user mới được cập nhật)
  useEffect(() => {
    if (!currentUserId) return;
    setUsersLoading(true);
    const url = `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/related-users?userId=${currentUserId}`;
    fetch(url, {
      credentials: 'include', // Thêm credentials để đảm bảo cookies được gửi
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Related users data:', data);
        const users = data.users || [];
        setAllUsers(users);

        // Backfill displayNameFor for existing rooms
        if (users.length > 0 && currentUserId) {
          const userNames: Record<string, string> = {};
          users.forEach((user: any) => {
            userNames[user._id] = user.name;
          });

          backfillDisplayNames(currentUserId, userNames).catch(console.error);
        }
      })
      .catch(error => {
        console.error('Error fetching related users:', error);
        // Fallback: thử fetch tất cả users nếu related-users fail
        const fallbackUrl = `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/users`;
        return fetch(fallbackUrl, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(data => {
            console.log('Fallback users data:', data);
            setAllUsers(data.users || []);
          })
          .catch(fallbackError => {
            console.error('Fallback error:', fallbackError);
            setAllUsers([]);
            // Retry sau 3 giây nếu cả 2 API đều fail
            if (retryCount < 3) {
              setTimeout(() => {
                setRetryCount(prev => prev + 1);
              }, 3000);
            }
          });
      })
      .finally(() => setUsersLoading(false));
  }, [currentUserId, chatRooms.length, retryCount]);

  // Reset retry count khi users được load thành công
  useEffect(() => {
    if (allUsers.length > 0 && retryCount > 0) {
      setRetryCount(0);
    }
  }, [allUsers.length, retryCount]);

  // Helper function để lấy user info với fallback tốt hơn
  const getUserInfo = (userId: string) => {
    const user = allUsers.find(u => String(u._id) === String(userId));
    if (user) {
      return user;
    }

    // Nếu không tìm thấy trong allUsers, thử fetch từ API
    // Đây là fallback cho trường hợp user mới được thêm vào group
    return {
      _id: userId,
      name: `User ${userId.slice(-4)}`, // Fallback với 4 ký tự cuối của ID
      email: '',
      avatar: { url: '/assets/images/avatar-default.png' }
    };
  };

  // Helper: Map ChatRoom to Chat (for UI compatibility)
  const mapChatRoomToChat = function (room: any): any {
    if (room.isGroup) {
      // Sử dụng participantUsers từ Firestore nếu có, fallback về API nếu không có
      let members;
      if (room.participantUsers && room.participantUsers.length > 0) {
        // Sử dụng thông tin user từ Firestore
        members = room.participantUsers.map((user: any) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        }));
      } else {
        // Fallback: sử dụng API như cũ
        members = room.participants.map((id: string) => {
          const userRaw = getUserInfo(id);
          const preferredName = room.displayNameFor?.[id] || userRaw.name;
          return { ...userRaw, name: preferredName };
        });
      }

      return {
        _id: room.id,
        members,
        isGroup: true,
        groupName: room.groupName || 'Group',
        messages: [],
        lastMessage: room.lastMessage,
        unreadCount: 0,
        avatar: '/assets/images/avatar-default.png',
      };
    } else {
      // 1-1 chat: sử dụng participantUsers từ Firestore nếu có
      let otherUser;
      if (room.participantUsers && room.participantUsers.length > 0) {
        const otherId = room.participants.find((id: string) => String(id) !== String(currentUserId));
        const userFromFirestore = room.participantUsers.find((u: any) => String(u._id) === String(otherId));
        if (userFromFirestore) {
          otherUser = {
            _id: userFromFirestore._id,
            name: userFromFirestore.name,
            email: userFromFirestore.email,
            avatar: userFromFirestore.avatar
          };
        }
      }

      // Fallback về API nếu không có participantUsers
      if (!otherUser) {
        const otherId = room.participants.find((id: string) => String(id) !== String(currentUserId));
        const otherUserRaw = getUserInfo(otherId);
        const preferredName = room.displayNameFor?.[currentUserId] || otherUserRaw.name;
        otherUser = { ...otherUserRaw, name: preferredName };
      }

      return {
        _id: room.id,
        members: [otherUser],
        isGroup: false,
        groupName: undefined,
        messages: [],
        lastMessage: room.lastMessage,
        unreadCount: 0,
        avatar: otherUser?.avatar?.url || '/assets/images/avatar-default.png',
        displayName: otherUser.name
      };
    }
  };

  // Khi chọn chat mới, set loading và clear messages cũ
  const handleSelectChat = useCallback(async (chatRoomId: string) => {
    if (activeChatRoomIdHook && activeChatRoomIdHook !== chatRoomId) {
      leaveChat();
    }

    setIsChatLoading(true);
    setSelectedChatRoomId(chatRoomId);
    dispatch(setActiveChat(chatRoomId));
    setActiveChatRoomId(chatRoomId);

    await joinChat(chatRoomId);
    prevChatRoomId.current = chatRoomId;

    // Force refresh để đảm bảo messages được load lại
    setForceRefresh(prev => prev + 1);
  }, [activeChatRoomIdHook, dispatch, joinChat, leaveChat, setActiveChatRoomId]);

  // Khi messages thay đổi hoặc activeChatRoomId đổi, tắt loading
  useEffect(() => {
    if (isChatLoading && messages && messages.length >= 0) {
      setIsChatLoading(false);
    }
  }, [messages, activeChatRoomIdHook, isChatLoading]);

  // Auto-select first chat if none selected, hoặc chọn phòng chat mới nhất có lastMessage chưa đọc
  useEffect(() => {
    if (chatRooms.length > 0 && !hasAutoSelected) {
      const activeRoomStillExists = chatRooms.some(room => room.id === activeChatRoomIdHook);
      if (!activeChatRoomIdHook || !activeRoomStillExists) {
        const unreadRoom = chatRooms.find(room => {
          return room.lastMessage && room.lastMessage.receiverId === currentUserId && !room.lastMessage.read;
        });
        if (unreadRoom) {
          handleSelectChat(unreadRoom.id!);
          setHasAutoSelected(true);
        } else {
          const sortedRooms = [...chatRooms].sort((a, b) => {
            const aTime = a.lastMessageTime || a.createdAt;
            const bTime = b.lastMessageTime || b.createdAt;
            return bTime?.toMillis?.() - aTime?.toMillis?.();
          });
          if (sortedRooms.length > 0) {
            handleSelectChat(sortedRooms[0].id!);
            setHasAutoSelected(true);
          }
        }
      }
    }
    // Reset flag nếu chatRooms thay đổi hoàn toàn (ví dụ reload)
    if (chatRooms.length === 0 && hasAutoSelected) {
      setHasAutoSelected(false);
    }
  }, [chatRooms, activeChatRoomIdHook, handleSelectChat, currentUserId, hasAutoSelected]);

  if (!currentUserId) {
    return (
      <div className="h-[calc(100vh-var(--header-height,80px))] flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <p className="text-gray-500">Please log in to access messages</p>
        </div>
      </div>
    );
  }

  if (!firebaseAvailable) {
    return (
      <div className="h-[calc(100vh-var(--header-height,80px))] flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <p className="text-gray-500">Chat feature is not available</p>
        </div>
      </div>
    );
  }

  // Sử dụng selectedChatRoomId thay vì activeChatRoomIdHook để UI
  const currentActiveChatId = selectedChatRoomId || activeChatRoomIdHook;

  // Wrapper for sendMessage to support reply parameter
  const handleSendMessage = async (receiverId: string, content: string, type?: 'text' | 'image' | 'file', replyTo?: any) => {
    try {
      console.log('Sending message:', { receiverId, content, type, replyTo });
      await sendMessage(receiverId, content, type || 'text', replyTo);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle send reaction
  const handleSendReaction = async (messageId: string, emoji: string) => {
    try {
      console.log('Sending reaction:', { messageId, emoji });
      await sendReaction(messageId, emoji);
    } catch (error) {
      console.error('Failed to send reaction:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-var(--header-height,80px))] flex rounded-2xl overflow-hidden gap-5">
      {/* Chat List */}
      <ChatList
        chats={chatRooms.map(mapChatRoomToChat)}
        activeChatId={currentActiveChatId}
        onSelectChat={handleSelectChat}
        onCreateChat={() => { }}
      />

      {/* Chat Room */}
      {(!usersLoading && currentActiveChatId && !isChatLoading) ? (
        <ChatRoom
          key={`${currentActiveChatId}-${forceRefresh}`} // Force re-render khi chat thay đổi
          chat={chatRooms.find(room => room.id === currentActiveChatId) ? mapChatRoomToChat(chatRooms.find(room => room.id === currentActiveChatId)) : null}
          currentUserId={currentUserId}
          messages={messages}
          sendMessage={handleSendMessage}
          sendReaction={handleSendReaction}
          updateGroupName={updateGroupName}
          addMembersToGroup={addMembersToGroup}
          removeMemberFromGroup={removeMemberFromGroup}
          loading={loading}
          error={error}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white rounded-2xl">
            {usersLoading ? (
            <Loading
                message="Loading users..."
              size="sm"
              className="min-h-[200px]"
            />
            ) : chatRooms.length === 0 ? (
              <div className="text-center p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
                <p className="text-sm text-gray-500">Start a new chat to begin messaging</p>
              </div>
            ) : (
              <Loading
                message="Loading chat..."
                size="sm"
                className="min-h-[200px]"
              />
            )}
            {retryCount > 0 && usersLoading && (
              <p className="text-xs text-gray-300 mt-2">Retrying... ({retryCount}/3)</p>
            )}
        </div>
      )}
    </div>
  );
};

export default MessagePage;
