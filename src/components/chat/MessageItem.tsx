import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChatMessage, ChatMember } from '@/types/chat';
import { formatMessageTime } from '@/utils/chatUtils';
import { MoreHorizontal, Smile, Reply } from 'lucide-react';

interface MessageItemProps {
    message: ChatMessage;
    sender?: ChatMember;
    isMe: boolean;
    showAvatar: boolean;
    onReply?: (message: ChatMessage) => void;
    onReaction?: (messageId: string, emoji: string) => void;
    onHover?: (messageId: string) => void; // Callback để thông báo hover
    isHovered?: boolean; // Prop để biết tin nhắn này có đang được hover không
}

const MessageItem: React.FC<MessageItemProps> = ({
    message,
    sender,
    isMe,
    showAvatar,
    onReply,
    onReaction,
    onHover,
    isHovered = false,
}) => {
    const [showReactions, setShowReactions] = useState(false);
    const reactionRef = useRef<HTMLDivElement>(null);

    const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

    // Click outside để đóng reactions
    useEffect(() => {
        const handleClickOutsideReactions = (event: MouseEvent) => {
            if (reactionRef.current && !reactionRef.current.contains(event.target as Node)) {
                setShowReactions(false);
            }
        };

        if (showReactions) {
            document.addEventListener('mousedown', handleClickOutsideReactions);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideReactions);
        };
    }, [showReactions]);

    const handleReaction = (emoji: string) => {
        onReaction?.(message._id, emoji);
        // Không đóng popup reactions ngay, để user có thể thêm nhiều reactions
    };

    const handleReply = () => {
        onReply?.(message);
    };

    const toggleReactions = () => {
        setShowReactions(!showReactions);
    };

    const handleMouseEnter = () => {
        onHover?.(message._id);
    };

    return (
        <div
            className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} group relative`}
            onMouseEnter={handleMouseEnter}
        >
            {/* Avatar for other users */}
            {showAvatar && sender && (
                <Image
                    src={sender.avatar?.url || '/assets/images/avatar-default.png'}
                    alt={sender.name}
                    width={32}
                    height={32}
                    className="rounded-full flex-shrink-0"
                />
            )}

            {/* Message bubble */}
            <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'} relative`}>
                {/* Reply preview */}
                {message.replyTo && (
                    <div className={`mb-2 p-2 bg-gray-50 rounded-lg border-l-4 ${isMe ? 'border-blue-500' : 'border-gray-300'}`}>
                        <div className="text-xs text-gray-500 mb-1">
                            {message.replyTo.sender === message.sender ? 'You' : sender?.name || 'User'} replied to a message
                        </div>
                        <div className="text-sm text-gray-700 truncate">
                            {message.replyTo.content}
                        </div>
                    </div>
                )}

                <div
                    className={`
                        rounded-2xl px-4 py-2.5 relative
                        ${isMe
                            ? 'bg-blue-500 text-white rounded-br-lg'
                            : 'bg-gray-100 text-gray-800 rounded-bl-lg'
                        }
                        hover:shadow-md transition-shadow duration-200
                    `}
                >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {message.reactions.map((reaction, index) => (
                                <span
                                    key={`${reaction.userId}-${index}`}
                                    className="text-xs bg-white bg-opacity-20 px-1.5 py-0.5 rounded-full"
                                >
                                    {reaction.emoji}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className={`text-xs text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    {formatMessageTime(message.timestamp)}
                </div>

                {/* Action buttons - Hiện khi hover */}
                {isHovered && (
                    <div className={`absolute top-1/2 -translate-y-1/2 ${isMe ? '-left-16' : '-right-16'} flex items-center gap-1 bg-white rounded-lg shadow-lg border p-1 z-10`}>
                        <button
                            onClick={handleReply}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="Reply"
                        >
                            <Reply size={14} className="text-gray-600" />
                        </button>
                        <button
                            onClick={toggleReactions}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="React"
                        >
                            <Smile size={14} className="text-gray-600" />
                        </button>
                        <button
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="More"
                        >
                            <MoreHorizontal size={14} className="text-gray-600" />
                        </button>
                    </div>
                )}

                {/* Reaction picker - Đặt ở vị trí đè lên thanh chat */}
                {showReactions && (
                    <div
                        ref={reactionRef}
                        className={`absolute bottom-0 ${isMe ? 'right-0' : 'left-0'} mb-12 bg-white rounded-lg shadow-lg border p-2 flex gap-1 z-20`}
                    >
                        {commonReactions.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => handleReaction(emoji)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors text-lg"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Spacer for alignment */}
            {!isMe && !showAvatar && <div className="w-8 flex-shrink-0" />}
        </div>
    );
};

export default MessageItem; 