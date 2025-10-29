// src/app/(auth)/dashboard/message/_components/ConversationListItem.tsx
import React from 'react';
import Image from 'next/image';
import { Conversation } from './types';
import { cn } from '@/lib/utils'; // Giả sử bạn có hàm cn

interface ConversationListItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  isActive,
  onSelect,
}) => {
  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-gray-100 transition-colors',
        isActive && 'bg-blue-100/60'
      )}
    >
      <div className="relative flex-shrink-0">
        <Image
          src={conversation.participant.avatarUrl}
          alt={conversation.participant.name}
          width={48}
          height={48}
          className="rounded-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-sm text-gray-800 truncate">
            {conversation.participant.name}
          </h4>
          <p className="text-xs text-gray-400 flex-shrink-0 ml-2">
            {conversation.lastMessage.timestamp}
          </p>
        </div>
        <div className="flex justify-between items-start mt-0.5">
          <p className="text-xs text-gray-500 truncate pr-2">{conversation.lastMessage.text}</p>
          {conversation.unreadCount > 0 && (
            <span className="w-4 h-4 bg-blue-500 text-white text-[10px] flex items-center justify-center rounded-full flex-shrink-0">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationListItem;
