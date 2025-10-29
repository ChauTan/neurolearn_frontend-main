// src/app/(auth)/dashboard/message/_components/MessageArea.tsx
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from './types';

interface MessageAreaProps {
  messages: Message[];
  currentUserId: string;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, currentUserId }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Tự động cuộn xuống cuối khi có tin nhắn mới
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
      {/* TODO: Thêm logic để nhóm tin nhắn theo ngày */}
      <div className="text-center text-xs text-gray-400">3d ago</div>
      {messages.map(message => (
        <ChatMessage key={message.id} message={message} isMe={message.senderId === currentUserId} />
      ))}
      <div ref={endOfMessagesRef} /> {/* Element trống để cuộn đến */}
    </div>
  );
};

export default MessageArea;
