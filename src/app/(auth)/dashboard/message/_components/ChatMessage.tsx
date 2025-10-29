// src/app/(auth)/dashboard/message/_components/ChatMessage.tsx
import React from 'react';
import { Message } from './types';

interface ChatMessageProps {
  message: Message;
  isMe: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMe }) => {
  return (
    <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[70%] rounded-2xl px-4 py-2.5
          ${
            isMe
              ? 'bg-blue-500 text-white rounded-br-lg'
              : 'bg-gray-100 text-gray-800 rounded-bl-lg'
          }
        `}
      >
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
