import React from 'react';

interface DocumentItemProps {
  lesson: {
    id: string;
    type: 'video' | 'document' | 'quiz';
    title: string;
  };
}

const DocumentItem: React.FC<DocumentItemProps> = ({ lesson }) => {
  return (
    <div className="flex items-start rounded-md border border-gray-200 bg-background p-4 shadow-sm">
      <div className="mr-4 flex-shrink-0 text-gray-500">
        {/* Document Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-gray-900">{lesson.title}</h4> {/* Changed here */}
        <p className="text-sm text-gray-500">Document</p>
      </div>
    </div>
  );
};

export default DocumentItem;