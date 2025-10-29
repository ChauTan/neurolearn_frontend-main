// src/app/(auth)/dashboard/message/_components/ChatWindow.tsx
import React from 'react';
import { Conversation, Message } from './types';
import ChatHeader from './ChatHeader';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  conversation?: Conversation; // Có thể undefined nếu chưa có conversation nào được chọn
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
}) => {
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full rounded-2xl">
      <ChatHeader participant={conversation.participant} />
      <MessageArea messages={messages} currentUserId={currentUserId} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
