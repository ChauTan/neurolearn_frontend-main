// src/app/(auth)/dashboard/message/_components/ChatHeader.tsx
import React from 'react';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { User } from './types';

interface ChatHeaderProps {
  participant: User;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ participant }) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Image
          src={participant.avatarUrl || '/assets/images/avatar.png'}
          alt={participant.name}
          width={50}
          height={50}
          className="rounded-full ml-3"
        />
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">{participant.name}</h3>
          <p className="text-xs text-gray-500">{participant.role || 'Active now'}</p>
        </div>
      </div>
      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
        <MoreHorizontal size={20} />
        {/* TODO: Tích hợp Dropdown Menu cho Report, Help */}
      </button>
    </div>
  );
};

export default ChatHeader;
