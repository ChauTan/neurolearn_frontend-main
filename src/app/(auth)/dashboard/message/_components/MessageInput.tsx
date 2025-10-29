// src/app/(auth)/dashboard/message/_components/MessageInput.tsx
import React, { useState } from 'react';
import { SendHorizonal } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Write your message"
          className="w-full text-black rounded-full bg-gray-100 py-3 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="absolute top-1/2 right-2 -translate-y-1/2 p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Send message"
        >
          <SendHorizonal size={18} className="-rotate-45" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
