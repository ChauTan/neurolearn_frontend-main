import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { Chat } from '@/types/chat';
import { getChatDisplayName } from '@/utils/chatUtils';
import { useModal } from '@/context/ModalContext';
import ChatListItem from './ChatListItem';

interface ChatListProps {
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onCreateChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
    chats,
    activeChatId,
    onSelectChat,
    onCreateChat,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useSelector((state: RootState) => state.auth);
    const { unreadCounts, onlineUsers } = useSelector((state: RootState) => state.chat);
    const { showModal } = useModal();

    // Parse current user
    const currentUser = typeof user === 'string' ? JSON.parse(user || '{}') : user;
    const currentUserId = currentUser?._id || currentUser?.id;

    // Filter chats based on search query
    const filteredChats = chats.filter(chat => {
        const displayName = getChatDisplayName(chat, currentUserId);
        return displayName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleCreateChat = () => {
        showModal('createChat', {
            currentUserId,
            onChatCreated: onCreateChat
        });
    };

    const handleSelectChat = (chatId: string) => {
        onSelectChat(chatId);
        // Scroll to top of chat list (nếu cần)
        const chatListDiv = document.querySelector('.flex-1.overflow-y-auto');
        if (chatListDiv) chatListDiv.scrollTop = 0;
    };

    return (
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 bg-white rounded-2xl flex flex-col h-full border-r border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleCreateChat}
                        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        title="Create new chat"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200">
                <div className="relative">
                    <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-black rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="text-center p-6">
                            {searchQuery ? (
                                <>
                                    <p className="text-sm">No conversations found</p>
                                    <p className="text-xs mt-1">Try adjusting your search</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm">No conversations yet</p>
                                    <p className="text-xs mt-1">Start a new chat to begin messaging</p>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1 p-2">
                        {filteredChats.map(chat => (
                            <ChatListItem
                                key={chat._id}
                                chat={chat}
                                currentUserId={currentUserId}
                                active={activeChatId === chat._id}
                                onSelect={handleSelectChat}
                                unreadCount={unreadCounts[chat._id] || 0}
                                onlineUsers={onlineUsers}
                            />
                        ))}
                    </div>
                )}
            </div>


        </div>
    );
};

export default ChatList; 