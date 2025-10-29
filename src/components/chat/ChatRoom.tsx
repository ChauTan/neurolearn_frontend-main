import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { Chat } from '@/types/chat';
import { getChatDisplayName, getChatAvatar } from '@/utils/chatUtils';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
// Group settings modal is now handled via global ModalContainer

interface ChatRoomProps {
    chat: Chat | null;
    currentUserId: string;
    messages: any[];
    sendMessage: (receiverId: string, content: string, type?: 'text' | 'image' | 'file', replyTo?: any) => Promise<void>;
    sendReaction: (messageId: string, emoji: string) => Promise<void>;
    updateGroupName?: (newName: string) => Promise<void>;
    addMembersToGroup?: (memberIds: string[]) => Promise<void>;
    removeMemberFromGroup?: (memberId: string) => Promise<void>;
    loading: boolean;
    error: string | null;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
    chat,
    currentUserId,
    messages,
    sendMessage,
    sendReaction,
    updateGroupName,
    addMembersToGroup,
    removeMemberFromGroup,
    loading,
    error,
}) => {
    const [replyTo, setReplyTo] = useState<any>(null);
    const { showModal } = useModal();

    // Lấy messages trực tiếp từ props
    const mappedMessages = messages.map((msg: any) => ({
        _id: msg.id || '',
        sender: msg.senderId,
        content: msg.content,
        timestamp: msg.timestamp?.toDate ? msg.timestamp.toDate().toISOString() : '',
        replyTo: msg.replyTo,
        reactions: msg.reactions || [],
    }));

    // Dùng trực tiếp chat.members
    const members = chat ? chat.members : [];

    // Lấy user còn lại (không phải mình) nếu là chat cá nhân
    const otherMember = !chat?.isGroup
        ? members.find((m: import('@/types/chat').ChatMember) => m._id !== currentUserId)
        : undefined;
    const role = !chat?.isGroup && otherMember ? otherMember.role : undefined;

    const handleSendMessage = async (content: string) => {
        if (!chat || !content.trim()) {
            return;
        }

        try {
            if (chat.isGroup) {
                // Group chat: gửi tin nhắn cho tất cả thành viên (receiverId có thể là bất kỳ member nào)
                const firstMember = members.find((m: import('@/types/chat').ChatMember) => m._id !== currentUserId);
                if (firstMember) {
                    await sendMessage(firstMember._id, content.trim(), 'text', replyTo);
                }
            } else {
                // 1-1 chat: gửi tin nhắn cho user còn lại
                const otherMember = members.find((m: import('@/types/chat').ChatMember) => m._id !== currentUserId);
                if (otherMember) {
                    await sendMessage(otherMember._id, content.trim(), 'text', replyTo);
                }
            }
            setReplyTo(null); // Clear reply after sending
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleReply = (message: any) => {
        setReplyTo({
            messageId: message._id,
            content: message.content,
            senderId: message.sender,
        });
    };

    const handleReaction = async (messageId: string, emoji: string) => {
        try {
            await sendReaction(messageId, emoji);
        } catch (error) {
            console.error('Failed to send reaction:', error);
        }
    };

    const handleCancelReply = () => {
        setReplyTo(null);
    };

    const handleGroupSettingsClick = () => {
        if (!chat) return;
        showModal('groupSettings', {
            chatName: getChatDisplayName(chat, currentUserId),
            currentMembers: members,
            onUpdateGroupName: handleUpdateGroupName,
            onAddMembers: handleAddMembers,
            onRemoveMember: handleRemoveMember,
            currentUserId,
        });
    };

    const handleUpdateGroupName = async (newName: string) => {
        if (updateGroupName) {
            await updateGroupName(newName);
        }
    };

    const handleAddMembers = async (memberIds: string[]) => {
        if (addMembersToGroup) {
            await addMembersToGroup(memberIds);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (removeMemberFromGroup) {
            await removeMemberFromGroup(memberId);
        }
    };

    if (!chat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat</h3>
                    <p className="text-gray-500">Choose a conversation to start messaging</p>
                </div>
            </div>
        );
    }

    const displayName = getChatDisplayName(chat, currentUserId);
    const avatar = getChatAvatar(chat, currentUserId);

    return (
        <div className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden">
            {/* Header */}
            <ChatHeader
                name={displayName}
                avatar={avatar}
                isGroup={chat.isGroup}
                memberCount={chat.isGroup ? members.length : undefined}
                role={role}
                onGroupSettingsClick={chat.isGroup ? handleGroupSettingsClick : undefined}
            />

            {/* Messages */}
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                <MessageList
                    messages={mappedMessages}
                    currentUserId={currentUserId}
                    chatMembers={members}
                    onReply={handleReply}
                    onReaction={handleReaction}
                />
            </div>

            {/* Input - Fixed positioning */}
            <div className="flex-shrink-0">
                <MessageInput
                    onSendMessage={handleSendMessage}
                    replyTo={replyTo}
                    onCancelReply={handleCancelReply}
                    disabled={loading}
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-50 border-t border-red-200">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Group chat settings are handled via global ModalContainer */}
        </div>
    );
};

export default ChatRoom;
