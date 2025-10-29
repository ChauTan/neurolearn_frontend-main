// app/(auth)/dashboard/create-quiz/_components/QuizBuilderHeader.tsx
'use client';
import React from 'react';

interface QuizBuilderHeaderProps {
  title?: string; // Sẽ là "Name Quiz" hoặc tên của quiz đang sửa
  onSaveQuiz: () => void; // Đổi tên từ onCreateQuiz cho rõ ràng hơn
  isEditing: boolean; // Để biết nút nên là "Create" hay "Update"
  onCreateWithAI?: () => void; // Tùy chọn
  // aiBusy?: boolean;
}

const QuizBuilderHeader: React.FC<QuizBuilderHeaderProps> = ({
  onSaveQuiz,
  isEditing,
  onCreateWithAI,
  // aiBusy,
}) => {
  return (
    <header className="p-3 sm:p-4 flex items-center justify-between flex-shrink-0 z-10">
      <h1 className=" text-lg sm:text-xl font-semibold text-gray-800 truncate"></h1>
      <div className="flex items-center space-x-3 sm:space-x-4">
        {onCreateWithAI && (
          <button
            onClick={onCreateWithAI}
          // disabled={!!aiBusy}
          // className={`bg-purple-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors ${aiBusy ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-700'}`}
          >
            {/* {aiBusy ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Create with AI aaaaaaaaaaaaa'
            )} */}
          </button>
        )}
        <button
          onClick={onSaveQuiz}
          className="bg-blue-500 text-white px-5 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          {isEditing ? 'Save Changes' : 'Create Quiz'}
        </button>
      </div>
    </header>
  );
};

export default QuizBuilderHeader;
