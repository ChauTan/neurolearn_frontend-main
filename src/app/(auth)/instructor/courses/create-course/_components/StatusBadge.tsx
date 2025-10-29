import React from 'react';

interface StatusBadgeProps {
    status?: string;
    variant?: 'published' | 'draft' | 'pending';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    variant = 'published',
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'published':
                return 'bg-blue-600 text-white';
            case 'draft':
                return 'bg-gray-500 text-white';
            case 'pending':
                return 'bg-yellow-500 text-white';
            default:
                return 'bg-blue-600 text-white';
        }
    };

    return (
        <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-gray-500">Status</span>
            <span
                className={`px-3 py-1 text-sm text-white rounded-full ${getVariantClasses()}`}
            >
                {status}
            </span>
        </div>
    );
};
