import React, { useState } from 'react';
import { User } from './types';

interface GroupChatModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (groupName: string, memberIds: string[]) => void;
    users: User[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ open, onClose, onCreate, users }) => {
    const [groupName, setGroupName] = useState('');
    const [selected, setSelected] = useState<string[]>([]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-lg font-bold mb-4">Tạo group chat</h2>
                <input
                    className="w-full border p-2 mb-3 rounded"
                    placeholder="Tên group"
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                />
                <div className="mb-3">
                    <div className="font-semibold mb-1">Chọn thành viên:</div>
                    <div className="max-h-32 overflow-y-auto">
                        {users.map(u => (
                            <label key={u.id} className="flex items-center mb-1">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(u.id)}
                                    onChange={e => {
                                        if (e.target.checked) setSelected(prev => [...prev, u.id]);
                                        else setSelected(prev => prev.filter(id => id !== u.id));
                                    }}
                                />
                                <span className="ml-2">{u.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>Hủy</button>
                    <button
                        className="px-3 py-1 rounded bg-blue-500 text-white"
                        onClick={() => {
                            onCreate(groupName, selected);
                            setGroupName('');
                            setSelected([]);
                        }}
                        disabled={!groupName || selected.length === 0}
                    >
                        Tạo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupChatModal; 