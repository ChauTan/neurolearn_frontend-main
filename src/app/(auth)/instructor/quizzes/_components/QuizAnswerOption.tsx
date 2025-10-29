// QuizAnswerOption.tsx
import React from 'react';

interface QuizAnswerOptionProps {
  id: string;
  text: string;
  isCorrectAnswer: boolean; // True nếu lựa chọn này được đánh dấu là đúng
  uniqueQuestionId: string; // ID duy nhất cho câu hỏi (để gom radio buttons)
  onSelect: (id: string) => void;
  onTextChange: (id: string, newText: string) => void;
  onDelete: (id: string) => void;
  inputType: 'radio' | 'checkbox'; // Prop mới để xác định loại input
}

const QuizAnswerOption: React.FC<QuizAnswerOptionProps> = ({
  id,
  text,
  isCorrectAnswer,
  uniqueQuestionId,
  onSelect,
  onTextChange,
  onDelete,
  inputType,
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTextChange(id, e.target.value);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(id);
  };

  const handleSelectionChange = () => {
    onSelect(id);
  };

  const containerBaseClass = 'flex items-center justify-between p-3 my-2';
  const containerBgClass = 'bg-white'; // Nền trắng cho container chính

  let selectionVisualOuterClass = `w-5 h-5 flex items-center justify-center mr-3 transition-all duration-150 ease-in-out cursor-pointer`;
  let selectionVisualInnerPart; // Phần tử bên trong (chấm tròn hoặc dấu tick)

  if (inputType === 'checkbox') {
    selectionVisualOuterClass += ' rounded border-2'; // Hình vuông cho checkbox
    if (isCorrectAnswer) {
      selectionVisualOuterClass += ' bg-blue-600 border-blue-600'; // Nền xanh khi chọn
      selectionVisualInnerPart = (
        <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else {
      selectionVisualOuterClass += ' bg-white border-gray-400'; // Viền xám khi chưa chọn
    }
  } else {
    // radio
    selectionVisualOuterClass += ' rounded-full border-2'; // Hình tròn cho radio
    if (isCorrectAnswer) {
      selectionVisualOuterClass += ' border-blue-600';
      selectionVisualInnerPart = <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>;
    } else {
      selectionVisualOuterClass += ' border-blue-500'; // Viền xanh dương mặc định
    }
  }

  const textInputWrapperClasses =
    'bg-[#f1efef] flex flex-grow gap-2 justify-between items-center rounded-md';
  const textInputElementClasses =
    'flex-grow text-gray-800 px-3 py-1.5 placeholder-gray-400 bg-transparent focus:outline-none'; // bg-transparent để ăn theo nền cha
  const deleteButtonContainerClasses =
    'w-[48px] h-[48px] bg-[#f1efef] rounded-md justify-center items-center flex';
  const deleteButtonClasses =
    'text-orange-500 hover:text-orange-700 transition-colors duration-150 ease-in-out cursor-pointer flex justify-center items-center w-full h-full';

  return (
    <label
      htmlFor={`option-${id}-${uniqueQuestionId}`}
      className={`${containerBaseClass} ${containerBgClass} cursor-pointer`}
    >
      <div className="flex items-center flex-grow">
        <input
          type={inputType}
          id={`option-${id}-${uniqueQuestionId}`}
          name={
            inputType === 'radio'
              ? `question-group-${uniqueQuestionId}`
              : `option-checkbox-${id}-${uniqueQuestionId}`
          } // Radio cần name chung, checkbox có thể có name riêng
          checked={isCorrectAnswer}
          onChange={handleSelectionChange}
          className="opacity-0 w-0 h-0 absolute"
        />
        <span aria-hidden="true" className={selectionVisualOuterClass}>
          {selectionVisualInnerPart}
        </span>

        <div className="flex-grow flex gap-3.5">
          <div className={textInputWrapperClasses}>
            <div className="w-2 h-8 sm:h-10 bg-[#b8b2b2] rounded-xl ml-1 my-1"></div>{' '}
            {/* Thu nhỏ thanh dọc một chút */}
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              onClick={e => e.stopPropagation()}
              className={textInputElementClasses}
                              placeholder="Enter answer content"
            />
          </div>
          <div className={deleteButtonContainerClasses}>
            <button
              type="button"
              onClick={handleDeleteClick}
              className={deleteButtonClasses}
              aria-label="Xóa lựa chọn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-5 w-5">
                <path
                  fill="currentColor"
                  d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </label>
  );
};

export default QuizAnswerOption;
