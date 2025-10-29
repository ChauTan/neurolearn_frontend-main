import React from 'react';
import { ChatMember } from '@/types/chat';

interface TypingIndicatorProps {
    typingUsers: string[];
    chatMembers: ChatMember[];
    currentUserId: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
    typingUsers,
    chatMembers,
    currentUserId,
}) => {
    // Filter out current user and get typing user names
    const typingUserNames = typingUsers
        .filter(userId => userId !== currentUserId)
        .map(userId => {
            const member = chatMembers.find(m => m._id === userId);
            return member?.name || 'Someone';
        });

    if (typingUserNames.length === 0) return null;

    const getTypingText = () => {
        if (typingUserNames.length === 1) {
            return `${typingUserNames[0]} is typing...`;
        } else if (typingUserNames.length === 2) {
            return `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`;
        } else {
            return `${typingUserNames[0]} and ${typingUserNames.length - 1} others are typing...`;
        }
    };

    return (
        <div className="px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>{getTypingText()}</span>
            </div>
        </div>
    );
};

export default TypingIndicator; 