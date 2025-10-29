import React from 'react';
import { getChatDisplayName, getChatAvatar, truncateText, formatChatTime } from '@/utils/chatUtils';
import { Chat } from '@/types/chat';
import Image from 'next/image';

interface ChatListItemProps {
    chat: Chat;
    currentUserId: string;
    active: boolean;
    onSelect: (chatId: string) => void;
    unreadCount: number;
    onlineUsers: Record<string, boolean>;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, currentUserId, active, onSelect, unreadCount, onlineUsers }) => {
    const members = chat.members;
    const displayName = getChatDisplayName(chat, currentUserId);
    const avatar = getChatAvatar(chat, currentUserId);
    const lastMessage = chat.lastMessage;
    const otherMember = members.find((member) => member._id !== currentUserId);
    const isOnline = otherMember ? onlineUsers[otherMember._id] : false;

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
    };

    return (
        <div
            onClick={() => onSelect(chat._id)}
            className={
                `flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ` +
                (active ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50')
            }
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <Image src={avatar} alt={displayName} width={48} height={48} className="rounded-full" />
                {!chat.isGroup && isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
            </div>
            {/* Chat Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{displayName}</h3>
                    {lastMessage && (
                        <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatChatTime(lastMessage.timestamp)}
                        </span>
                    )}
                </div>
                {lastMessage && (
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                            {truncateText(lastMessage.content, 30)}
                        </p>
                        {unreadCount > 0 && (
                            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </div>
                )}
            </div>
            {/* More Options */}
            <button
                onClick={handleButtonClick}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
                ...
            </button>
        </div>
    );
};

export default ChatListItem; 