// src/app/(auth)/dashboard/message/_components/ConversationList.tsx
import React from 'react';
import { Search, Plus } from 'lucide-react';
import ConversationListItem from './ConversationListItem';
import { Conversation } from './types';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateGroup: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateGroup,
}) => {
  return (
    <aside className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-white rounded-2xl  flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search"
            className="w-full text-black rounded-full bg-gray-200 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        </div>
        <button
          className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          onClick={onCreateGroup}
          title="Tạo group chat"
        >
          <Plus size={20} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map(conv => (
          <ConversationListItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === activeConversationId}
            onSelect={onSelectConversation}
          />
        ))}
      </nav>
    </aside>
  );
};

export default ConversationList;
