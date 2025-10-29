import React, { useState } from 'react';
import { Chat } from '@/types/chat';
import { Plus, Search } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

interface BusinessChatListProps {
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    currentUserId: string;
}

const BusinessChatList: React.FC<BusinessChatListProps> = ({
    chats,
    activeChatId,
    onSelectChat,
    currentUserId,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'group' | 'individual'>('all');
    const { showModal } = useModal();

    // Filter chats based on search and type
    const filteredChats = chats.filter(chat => {
        const matchesSearch = chat.isGroup 
            ? (chat.groupName || `Group (${chat.members.length} members)`).toLowerCase().includes(searchQuery.toLowerCase())
            : chat.members[0]?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = filterType === 'all' 
            ? true 
            : filterType === 'group' 
                ? chat.isGroup 
                : !chat.isGroup;
        
        return matchesSearch && matchesType;
    });

    const handleCreateChat = () => {
        showModal('createChat', {
            currentUserId,
            onChatCreated: () => {
        // Refresh chat list or handle new chat
                // Force parent component to refresh
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        });
    };

    return (
        <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Business Chats</h2>
                    <button
                        onClick={handleCreateChat}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Create new chat"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            filterType === 'all'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterType('group')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            filterType === 'group'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Groups
                    </button>
                    <button
                        onClick={() => setFilterType('individual')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            filterType === 'individual'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Individual
                    </button>
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <p className="text-sm">
                            {searchQuery || filterType !== 'all' 
                                ? 'No chats found' 
                                : 'No chats yet'
                            }
                        </p>
                        {!searchQuery && filterType === 'all' && (
                            <button
                                onClick={handleCreateChat}
                                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                            >
                                Create your first chat
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-1 p-2">
                        {filteredChats.map((chat) => {
                            const isActive = chat._id === activeChatId;
                            const displayName = chat.isGroup 
                                ? chat.groupName || `Group (${chat.members.length} members)`
                                : chat.members[0]?.name || 'Unknown User';

                            // Debug: Log chat data for groups
                            if (chat.isGroup) {
                                console.log('Group chat data:', {
                                    id: chat._id,
                                    groupName: chat.groupName,
                                    displayName,
                                    members: chat.members.length
                                });
                            }

                            const avatar = chat.isGroup 
                                ? '/assets/images/avatar-default.png'
                                : chat.members[0]?.avatar?.url || '/assets/images/avatar-default.png';
                            const lastMessage = chat.lastMessage?.content || 'No messages yet';
                            const memberCount = chat.isGroup ? chat.members.length : undefined;

                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => onSelectChat(chat._id)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 border border-blue-200'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img
                                                src={avatar}
                                                alt={displayName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            {chat.isGroup && (
                                                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {memberCount}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className={`font-medium text-sm truncate ${
                                                    isActive ? 'text-blue-900' : 'text-gray-900'
                                                }`}>
                                                    {displayName}
                                                </h3>
                                                {chat.isGroup && (
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                        Group
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 truncate mt-1">
                                                {lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>


        </div>
    );
};

export default BusinessChatList; 