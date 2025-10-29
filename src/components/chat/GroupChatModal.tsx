import React, { useState, useEffect } from 'react';
import { ChatMember, UserInfo } from '@/types/chat';
import { X, Users, Edit3, Search } from 'lucide-react';

interface GroupChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    chatName: string;
    currentMembers: ChatMember[];
    onUpdateGroupName: (newName: string) => Promise<void>;
    onAddMembers: (memberIds: string[]) => Promise<void>;
    onRemoveMember: (memberId: string) => Promise<void>;
    currentUserId: string;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
    isOpen,
    onClose,
    chatName,
    currentMembers,
    onUpdateGroupName,
    onAddMembers,
    onRemoveMember,
    currentUserId,
}) => {
    const [activeTab, setActiveTab] = useState<'info' | 'members'>('info');
    const [newGroupName, setNewGroupName] = useState(chatName);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    // Fetch users from backend API
    useEffect(() => {
        if (!isOpen || !currentUserId) return;
        setIsLoadingUsers(true);
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/chats/users`)
            .then(res => res.json())
            .then(data => setUsers((data.users || []).filter((u: any) => u._id !== currentUserId)))
            .catch(() => setUsers([]))
            .finally(() => setIsLoadingUsers(false));
    }, [isOpen, currentUserId]);

    // Function để lấy user info với fallback
    const getUserDisplayInfo = (userId: string) => {
        // Tìm trong current members trước
        const currentMember = currentMembers.find(m => m._id === userId);
        if (currentMember) {
            return currentMember;
        }
        
        // Tìm trong available users
        const availableUser = users.find(u => u._id === userId);
        if (availableUser) {
            return availableUser;
        }
        
        // Fallback
        return {
            _id: userId,
            name: `User ${userId.slice(-4)}`,
            email: '',
            avatar: { url: '/assets/images/avatar-default.png' }
        };
    };

    useEffect(() => {
        if (isOpen) {
            setNewGroupName(chatName);
            setSearchQuery('');
            setSelectedUsers([]);
        }
    }, [isOpen, chatName]);

    // Lọc users có thể thêm (không phải thành viên hiện tại)
    const availableUsers = users.filter(user => 
        !currentMembers.find(member => member._id === user._id) &&
        user._id !== currentUserId
    );

    // Lọc users theo search query
    const filteredUsers = availableUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUpdateGroupName = async () => {
        if (!newGroupName.trim() || newGroupName === chatName) return;
        
        setIsUpdating(true);
        try {
            await onUpdateGroupName(newGroupName.trim());
            onClose();
        } catch (error) {
            console.error('Failed to update group name:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddMembers = async () => {
        if (selectedUsers.length === 0) return;
        
        setIsUpdating(true);
        try {
            await onAddMembers(selectedUsers);
            setSelectedUsers([]);
            onClose();
        } catch (error) {
            console.error('Failed to add members:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (memberId === currentUserId) return; // Không thể remove chính mình
        
        try {
            await onRemoveMember(memberId);
        } catch (error) {
            console.error('Failed to remove member:', error);
        }
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    if (!isOpen) return null;

    return (
        <div className="bg-white rounded-lg w-full max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Group Settings</h2>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                    <X size={20} className="text-gray-500" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'info'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Edit3 size={16} className="inline mr-2" />
                    Group Info
                </button>
                <button
                    onClick={() => setActiveTab('members')}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'members'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Users size={16} className="inline mr-2" />
                    Members ({currentMembers.length})
                </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
                {activeTab === 'info' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Group Name
                            </label>
                            <input
                                type="text"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter group name"
                            />
                        </div>

                        <button
                            onClick={handleUpdateGroupName}
                            disabled={isUpdating || !newGroupName.trim() || newGroupName === chatName}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            {isUpdating ? 'Updating...' : 'Update Group Name'}
                        </button>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="space-y-4">
                        {/* Current Members */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Current Members</h3>
                            <div className="space-y-2">
                                {currentMembers.map((member) => {
                                    const userInfo = getUserDisplayInfo(member._id);
                                    return (
                                        <div key={member._id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={userInfo.avatar?.url || '/assets/images/avatar-default.png'}
                                                    alt={userInfo.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                                                    <p className="text-xs text-gray-500">{member.role || 'Member'}</p>
                                                </div>
                                            </div>
                                            {member._id !== currentUserId && (
                                                <button
                                                    onClick={() => handleRemoveMember(member._id)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Add New Members */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Members</h3>

                            {/* Search */}
                            <div className="relative mb-3">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Search users..."
                                />
                            </div>

                            {/* Available Users */}
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                                {isLoadingUsers ? (
                                    <div className="flex items-center justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-2">
                                        {searchQuery ? 'No users found' : 'No users available'}
                                    </p>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <div key={user._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user._id)}
                                                onChange={() => toggleUserSelection(user._id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <img
                                                src={user.avatar?.url || '/assets/images/avatar-default.png'}
                                                alt={user.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {selectedUsers.length > 0 && (
                                <button
                                    onClick={handleAddMembers}
                                    disabled={isUpdating}
                                    className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isUpdating ? 'Adding...' : `Add ${selectedUsers.length} member(s)`}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupChatModal; 