import React from 'react';
import Image from 'next/image';
import { Settings } from 'lucide-react';

interface ChatHeaderProps {
    name: string;
    avatar: string;
    isGroup?: boolean;
    memberCount?: number;
    role?: string;
    onGroupSettingsClick?: () => void; // Callback để mở group settings
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    name,
    avatar,
    isGroup = false,
    memberCount,
    role,
    onGroupSettingsClick,
}) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
                <Image
                    src={avatar}
                    alt={name}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
                    {isGroup && memberCount && (
                        <p className="text-xs text-gray-500">{memberCount} members</p>
                    )}
                    {!isGroup && (
                        <p className="text-xs text-gray-500">{role || ''}</p>
                    )}
                </div>
            </div>

            {/* Group Settings Button */}
            {isGroup && onGroupSettingsClick && (
                <button
                    onClick={onGroupSettingsClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Group Settings"
                >
                    <Settings size={18} className="text-gray-600" />
                </button>
            )}
        </div>
    );
};

export default ChatHeader; 