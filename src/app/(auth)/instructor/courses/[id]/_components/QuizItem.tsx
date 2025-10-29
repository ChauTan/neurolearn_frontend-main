import React from 'react';

interface QuizItemProps {
    lesson: {
        id: string;
        type: 'video' | 'document' | 'quiz';
        title: string;
    };
}

const QuizItem: React.FC<QuizItemProps> = ({ lesson }) => {
    return (
        <div className="flex items-start rounded-md border border-gray-200 bg-background p-4 shadow-sm">
            <div className="mr-4 flex-shrink-0 text-gray-500">
                {/* Quiz Icon */}
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                </svg>
            </div>
            <div className="flex-grow">
                <h4 className="font-medium text-gray-900">{lesson.title}</h4> {/* Changed here */}
                <p className="text-sm text-gray-500">Quiz</p>
            </div>
        </div>
    );
};

export default QuizItem;