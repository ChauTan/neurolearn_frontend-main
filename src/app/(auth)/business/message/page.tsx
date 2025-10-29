'use client';
import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { setActiveChat } from '@/lib/redux/features/chat/chatSlice';
import { useFirestoreChat } from '@/hooks/useFirestoreChat';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { ChatRoom } from '@/components/chat';
import BusinessChatList from '@/components/chat/BusinessChatList';
import { backfillDisplayNames } from '@/lib/firestore/chat';

// Check if Firebase is available
const isFirebaseAvailable = () => {
  return typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
};

const BusinessMessagePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const { user: firebaseUser, signInAnonymouslyIfNeeded } = useFirebaseAuth();

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
  const [retryCount, setRetryCount] = useState(0);

  // Define callbacks before any early returns to satisfy Hooks rules
  const handleSendMessage = useCallback(async (receiverId: string, content: string, type?: 'text' | 'image' | 'file', replyTo?: any) => {
    try {
      if (!firebaseUser) await signInAnonymouslyIfNeeded();
      await sendMessage(receiverId, content, type || 'text', replyTo);
    } catch (e) { /* ignore */ }
  }, [firebaseUser, signInAnonymouslyIfNeeded, sendMessage]);

  const handleSendReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      if (!firebaseUser) await signInAnonymouslyIfNeeded();
      await sendReaction(messageId, emoji);
    } catch (e) { /* ignore */ }
  }, [firebaseUser, signInAnonymouslyIfNeeded, sendReaction]);

  // Đảm bảo mock user được tạo khi component mount
  useEffect(() => {
    if (firebaseAvailable && !firebaseUser) {
      signInAnonymouslyIfNeeded().catch(() => { });
    }
  }, [firebaseAvailable, firebaseUser]);

  // Fetch all users whenever chatRooms thay đổi (đảm bảo user mới được cập nhật)
  useEffect(() => {
    if (!currentUserId) return;
    setUsersLoading(true);
    const url = `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/related-users?userId=${currentUserId}`;
    fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const users = data.users || [];
        setAllUsers(users);
        if (users.length > 0 && currentUserId) {
          const userNames: Record<string, string> = {};
          users.forEach((user: any) => { userNames[user._id] = user.name; });
          backfillDisplayNames(currentUserId, userNames).catch(() => { });
        }
      })
      .catch(() => {
        const fallbackUrl = `${process.env.NEXT_PUBLIC_SERVER_URI}/chats/users`;
        return fetch(fallbackUrl, { credentials: 'include', headers: { 'Content-Type': 'application/json' } })
          .then(res => res.json())
          .then(data => setAllUsers(data.users || []))
          .catch(() => {
            setAllUsers([]);
            if (retryCount < 3) setTimeout(() => setRetryCount(prev => prev + 1), 3000);
          });
      })
      .finally(() => setUsersLoading(false));
  }, [currentUserId, chatRooms.length, retryCount]);

  // Reset retry count khi users được load thành công
  useEffect(() => {
    if (allUsers.length > 0 && retryCount > 0) setRetryCount(0);
  }, [allUsers.length, retryCount]);

  // Map ChatRoom -> Chat (UI)
  const mapChatRoomToChat = useCallback((room: any): any => {
    if (!room) return null;
    if (room.isGroup) {
      const members = (room.participants || []).map((participantId: string) => {
        const userFromAPI = allUsers.find(u => String(u._id) === String(participantId));
        if (userFromAPI) {
          return {
            _id: userFromAPI._id,
            name: userFromAPI.name,
            email: userFromAPI.email,
            avatar: userFromAPI.avatar || { url: '/assets/images/avatar-default.png' }
          };
        }
        return { _id: participantId, name: `User ${participantId.slice(-4)}`, email: '', avatar: { url: '/assets/images/avatar-default.png' } };
      });
      return { _id: room.id, members, isGroup: true, groupName: room.groupName || 'Business Group', messages: [], lastMessage: room.lastMessage, unreadCount: 0, avatar: '/assets/images/avatar-default.png' };
    }
    const otherId = (room.participants || []).find((id: string) => String(id) !== String(currentUserId));
    if (!otherId) return null;
    const otherUserFromAPI = allUsers.find(u => String(u._id) === String(otherId));
    const otherUser = otherUserFromAPI ? {
      _id: otherUserFromAPI._id,
      name: otherUserFromAPI.name,
      email: otherUserFromAPI.email,
      avatar: otherUserFromAPI.avatar || { url: '/assets/images/avatar-default.png' }
    } : { _id: otherId, name: `User ${otherId.slice(-4)}`, email: '', avatar: { url: '/assets/images/avatar-default.png' } };
    return { _id: room.id, members: [otherUser], isGroup: false, groupName: undefined, messages: [], lastMessage: room.lastMessage, unreadCount: 0, avatar: otherUser?.avatar?.url || '/assets/images/avatar-default.png', displayName: otherUser.name };
  }, [currentUserId, allUsers]);

  // Chọn chat
  const handleSelectChat = useCallback(async (chatRoomId: string) => {
    if (activeChatRoomIdHook && activeChatRoomIdHook !== chatRoomId) leaveChat();
    setIsChatLoading(true);
    setSelectedChatRoomId(chatRoomId);
    dispatch(setActiveChat(chatRoomId));
    setActiveChatRoomId(chatRoomId);
    await joinChat(chatRoomId);
    prevChatRoomId.current = chatRoomId;
    setIsChatLoading(false);
  }, [activeChatRoomIdHook, dispatch, joinChat, leaveChat, setActiveChatRoomId]);

  // Auto-select
  useEffect(() => {
    if (chatRooms.length > 0 && !hasAutoSelected) {
      const activeRoomStillExists = chatRooms.some(room => room.id === activeChatRoomIdHook);
      if (!activeChatRoomIdHook || !activeRoomStillExists) {
        const unreadRoom = chatRooms.find(room => room.lastMessage && room.lastMessage.receiverId === currentUserId && !room.lastMessage.read);
        if (unreadRoom) { handleSelectChat(unreadRoom.id!); setHasAutoSelected(true); }
        else {
          const sortedRooms = [...chatRooms].sort((a, b) => {
            const aTime = a.lastMessageTime || a.createdAt; const bTime = b.lastMessageTime || b.createdAt;
            return bTime?.toMillis?.() - aTime?.toMillis?.();
          });
          if (sortedRooms.length > 0) { handleSelectChat(sortedRooms[0].id!); setHasAutoSelected(true); }
        }
      }
    }
    if (chatRooms.length === 0 && hasAutoSelected) setHasAutoSelected(false);
  }, [chatRooms, activeChatRoomIdHook, handleSelectChat, currentUserId, hasAutoSelected]);

  if (!currentUserId) {
    return (
      <div className="h-[calc(100vh-var(--header-height,80px))] flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center"><p className="text-gray-500">Please log in to access business messages</p></div>
      </div>
    );
  }

  if (!firebaseAvailable) {
    return (
      <div className="h-[calc(100vh-var(--header-height,80px))] flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center"><p className="text-gray-500">Chat feature is not available</p></div>
      </div>
    );
  }

  const currentActiveChatId = selectedChatRoomId || activeChatRoomIdHook;

  return (
    <div className="h-[calc(100vh-var(--header-height,80px))] flex flex-col rounded-2xl overflow-hidden bg-[#F7F8FA]">
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Business Messages</h1>
        <p className="text-gray-600">Manage communications with your team and customers</p>
      </div>

      <div className="flex-1 flex gap-5 py-5">
        <BusinessChatList
          chats={chatRooms.map(mapChatRoomToChat)}
          activeChatId={currentActiveChatId}
          onSelectChat={handleSelectChat}
          currentUserId={currentUserId}
        />

        {(!usersLoading && currentActiveChatId && !isChatLoading) ? (
          <ChatRoom
            key={currentActiveChatId}
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
                <div className="text-center">
                  <span className="text-gray-400">Loading users...</span>
                  {retryCount > 0 && (<p className="text-xs text-gray-300 mt-2">Retrying... ({retryCount}/3)</p>)}
                </div>
              ) : chatRooms.length === 0 ? (
                <div className="text-center p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
                  <p className="text-sm text-gray-500">Create your first chat to start messaging</p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-gray-400">Loading chat...</span>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessMessagePage;