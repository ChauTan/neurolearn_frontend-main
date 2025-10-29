import React from 'react';

interface LessonItemProps {
    lesson: {
        id: string;
        type: 'video' | 'document' | 'quiz';
        title: string;
        thumbnail?: string;
    };
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson }) => {
    console.log("lesson", lesson);
    return (
        <div className="flex items-start rounded-md border border-gray-200 bg-background p-4 shadow-sm">
            <div className="mr-4 flex-shrink-0 text-gray-500">
                {/* You can use an icon library like react-icons here */}
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
                        d="M14.752 11.125l-3.375 2.25a1.125 1.125 0 01-1.373-.321l-2.25-3.375a1.125 1.125 0 01.321-1.373l3.375-2.25a1.125 1.125 0 011.373.321l2.25 3.375a1.125 1.125 0 01-.321 1.373z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <div className="flex-grow">
                <h4 className="font-medium text-gray-900">{lesson.title}</h4> {/* Changed here */}
                <p className="text-sm text-gray-500">Lecture - Video File</p>
            </div>
        </div>
    );
};

export default LessonItem;