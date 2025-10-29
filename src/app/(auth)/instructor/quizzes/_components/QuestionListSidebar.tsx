// QuestionListSidebar.tsx
import React from 'react';
import { QuestionSummary } from '../../../../../types/quiz'; // Đảm bảo đường dẫn đúng

interface QuestionListSidebarProps {
  questions: QuestionSummary[];
  selectedQuestionId: string | null;
  activeQuestionNumber?: number;
  onSelectQuestion: (id: string) => void;
  onAddQuestion: () => void;
}

const QuestionListSidebar: React.FC<QuestionListSidebarProps> = ({
  questions,
  selectedQuestionId,
  activeQuestionNumber,
  onSelectQuestion,
  onAddQuestion,
}) => {
  const headerText = activeQuestionNumber
    ? `Question (${activeQuestionNumber})`
    : `Questions (${questions.length})`;

  return (
    <aside className="w-72 bg-white flex flex-col flex-shrink-0 rounded-2xl mx-auto">
      <div className="p-4 flex items-center justify-between ">
        <h2 className="text-lg font-semibold text-gray-800">{headerText}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddQuestion}
            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
            title="Add new question"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
      <nav className="flex-grow p-2 space-y-1">
        {questions.map(q => (
          <div key={q.id} className="group relative">
            <button
              onClick={() => onSelectQuestion(q.id)}
              className={`w-full flex items-start p-3 rounded-lg text-left transition-colors duration-150
                ${selectedQuestionId === q.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50 text-gray-700'
                }`}
            >
              <span
                className={`mr-2.5 pt-0.5 text-xs font-semibold ${selectedQuestionId === q.id ? 'text-blue-600' : 'text-gray-400'}`}
              >
                {q.number}.
              </span>
              <div className="flex-grow min-w-0">
                <p
                  className={`text-sm font-medium truncate ${selectedQuestionId === q.id ? 'text-blue-700' : 'text-gray-800'}`}
                >
                  {q.textPreview}
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  {q.typeIcon && <span className="mr-1.5 flex-shrink-0">{q.typeIcon}</span>}
                  <span className="capitalize truncate">{q.type.replace('-', ' ')}</span>
                </div>
              </div>
              <button
                className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                title="More options"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </button>
          </div>
        ))}
        {questions.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4">
            No questions yet. Click &quot;+&quot; to add.
          </p>
        )}
      </nav>
    </aside>
  );
};

export default QuestionListSidebar;
