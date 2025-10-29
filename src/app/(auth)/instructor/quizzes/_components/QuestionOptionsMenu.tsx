import React from 'react';

interface Props {
    onDuplicate: () => void;
    onDelete: () => void;
}

const QuestionOptionsMenu: React.FC<Props> = ({ onDuplicate, onDelete }) => {
    return (
        <div className="absolute right-2 top-8 z-50 w-36 bg-white rounded-lg shadow-lg text-sm">
            <button
                onClick={onDuplicate}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8M8 8h8" />
                </svg>
                Duplicate
            </button>
            <button
                onClick={onDelete}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-100 text-red-600"
            >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" />
                </svg>
                Delete
            </button>
        </div>
    );
};

export default QuestionOptionsMenu;
