import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, ChatMember } from '@/types/chat';
import MessageItem from './MessageItem';

interface MessageListProps {
    messages: ChatMessage[];
    currentUserId: string;
    chatMembers: ChatMember[];
    onReply?: (message: ChatMessage) => void;
    onReaction?: (messageId: string, emoji: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
    messages,
    currentUserId,
    chatMembers,
    onReply,
    onReaction,
}) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

    useEffect(() => {
        // Auto scroll to bottom when new messages arrive
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    }, [messages]);

    const handleMessageHover = (messageId: string) => {
        setHoveredMessageId(messageId);
    };

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-500">Start a conversation by sending a message</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-full" style={{ minHeight: 0 }}>
            {messages.map((message) => {
                const sender = chatMembers.find(member => member._id === message.sender);
                const isMe = message.sender === currentUserId;

                return (
                    <MessageItem
                        key={message._id}
                        message={message}
                        sender={sender}
                        isMe={isMe}
                        showAvatar={!isMe}
                        onReply={onReply}
                        onReaction={onReaction}
                        onHover={handleMessageHover}
                        isHovered={hoveredMessageId === message._id}
                    />
                );
            })}
            <div ref={endOfMessagesRef} />
        </div>
    );
};

export default MessageList; 