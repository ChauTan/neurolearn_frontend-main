import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Image from 'next/image';
import { X, Search, Users } from 'lucide-react';
import { getOrCreateChatRoom } from '@/lib/firestore/chat';
import { useDispatch } from 'react-redux';
import { setActiveChat } from '@/lib/redux/features/chat/chatSlice';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserInfo {
    _id: string;
    name: string;
    email: string;
    avatar?: { url?: string };
}

interface CreateChatModalProps {
    open: boolean;
    onClose: () => void;
    currentUserId: string;
    onChatCreated?: (chatRoomId: string) => void; // Callback to refresh chat list
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({
    open,
    onClose,
    currentUserId,
    onChatCreated,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    // Fetch users from backend
    useEffect(() => {
        if (!open || !currentUserId) return;
        setIsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/chats/users`)
            .then(res => res.json())
            .then(data => setUsers((data.users || []).filter((u: any) => u._id !== currentUserId)))
            .catch(() => setUsers([]))
            .finally(() => setIsLoading(false));
    }, [open, currentUserId]);

    // Filter out current user and apply search
    const filteredUsers = users.filter(
        (user) =>
            user._id !== currentUserId &&
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    // Group chat UI: Hiện input groupName nếu chọn nhiều hơn 1 user
    const showGroupNameInput = selectedUsers.length > 1;

    const { user } = useSelector((state: RootState) => state.auth);
    const currentUserObj = typeof user === 'string' ? (user ? JSON.parse(user) : undefined) : user;
    const currentUserName = currentUserObj?.name || '';

    const handleCreateChat = async () => {
        if (selectedUsers.length === 0) return;

        // Validate group name for group chats
        if (selectedUsers.length > 1 && (!groupName || groupName.trim() === '')) {
            alert('Please enter a group name');
            return;
        }

        try {
            let chatRoomId: string;
            if (selectedUsers.length === 1) {
                // 1-1 chat
                const otherUserId = selectedUsers[0];
                // Đảm bảo otherUserId có trong users
                const validUser = users.find(u => u._id === otherUserId);
                if (!validUser) return; // Không tạo chat nếu user không hợp lệ
                chatRoomId = await getOrCreateChatRoom(
                    currentUserId,
                    otherUserId,
                    currentUserName,
                    validUser.name,
                );
            } else {
                // Group chat
                const participants = [currentUserId, ...selectedUsers];
                // Ensure all participants are valid
                const allValid = participants.every(id => id === currentUserId || users.find(u => u._id === id));
                if (!allValid) return;

                // Debug: Log group creation details
                console.log('Creating group chat with:', {
                    participants,
                    groupName: groupName || 'New Group',
                    currentUserId,
                    selectedUsers
                });

                // Lấy thông tin user để lưu vào Firestore
                const participantUsers = participants.map(id => {
                    if (id === currentUserId) {
                        return {
                            _id: id,
                            name: currentUserName,
                            email: currentUserObj?.email || '',
                            avatar: currentUserObj?.avatar || null
                        };
                    } else {
                        const user = users.find(u => u._id === id);
                        return {
                            _id: id,
                            name: user?.name || 'Unknown User',
                            email: user?.email || '',
                            avatar: user?.avatar || null
                        };
                    }
                });

                // Tạo chat room mới với groupName và user info
                const chatRoomsRef = collection(db, 'chatRooms');
                const newChatRoom = {
                    participants,
                    participantUsers, // Lưu thông tin user trực tiếp
                    groupName: groupName.trim() || 'New Group',
                    createdAt: serverTimestamp(),
                    isGroup: true,
                    lastMessageTime: serverTimestamp()
                };

                console.log('New chat room data:', newChatRoom);

                const docRef = await addDoc(chatRoomsRef, newChatRoom);
                chatRoomId = docRef.id;

                console.log('Group chat created successfully with ID:', chatRoomId);
            }
            dispatch(setActiveChat(chatRoomId));
            setSelectedUsers([]);
            setGroupName('');
            setSearchQuery('');
            if (onChatCreated) {
                setTimeout(() => {
                    onChatCreated(chatRoomId);
                }, 100);
            }
            onClose();
        } catch (error) {
            console.error('Error creating chat:', error);
            // Hiển thị lỗi cho user
            alert('Failed to create chat. Please try again.');
        }
    };

    const handleClose = () => {
        setSelectedUsers([]);
        setGroupName('');
        setSearchQuery('');
        onClose();
    };

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!open) {
            setSelectedUsers([]);
            setGroupName('');
            setSearchQuery('');
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="bg-white rounded-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">New Conversation</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-6 border-b border-gray-200">
                    <div className="relative">
                        <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full text-black rounded-full bg-gray-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* Group Name Input */}
                {showGroupNameInput && (
                    <div className="p-6 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Enter group name..."
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full text-black rounded-lg bg-gray-100 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                )}

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Users size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">
                                {searchQuery ? 'No users found' : 'No users available'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${selectedUsers.includes(user._id) ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                                    onClick={() => handleUserToggle(user._id)}
                                >
                                    <Image
                                        src={user.avatar?.url || '/assets/images/avatar-default.png'}
                                        alt={user.name}
                                        width={32}
                                        height={32}
                                        className="rounded-full object-cover"
                                        unoptimized
                                    />
                                    <span className="flex-1 text-sm text-gray-900">{user.name}</span>
                                    {selectedUsers.includes(user._id) && <span className="text-xs text-blue-600">Selected</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateChat}
                        className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        disabled={selectedUsers.length === 0 || isLoading}
                    >
                        Create Chat
                </button>
            </div>
        </div>
    );
};

export default CreateChatModal; 