import React, { useMemo } from 'react';
import { OptionItem } from './OptionItem';
import Image from 'next/image';

type QuestionDisplayProps = {
  question: any;
  selectedAnswers: Set<string>;
  onSelectAnswer: (optionId: string, isMultipleAnswer: boolean) => void;
};

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswers,
  onSelectAnswer,
}) => {
  // ✅ Cờ multiple an toàn
  const isMultipleAnswer = useMemo(
    () =>
      Boolean(
        question?.choicesConfig?.isMultipleAnswer ||
        question?.questionType === 'multiple-choice' ||
        question?.type === 'multiple' ||
        question?.isMultipleAnswer
      ),
    [question]
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-semibold text-[#3858F8] leading-7">
          Question {question?.questionNumber}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="text-xl font-medium text-[#0D0D0D] leading-6 whitespace-normal break-words hyphens-auto">
          {question?.title ?? ''}
        </div>

        {question?.questionImage && typeof question.questionImage === 'string' && (
          <Image
            src={question.questionImage}
            alt="Question"
            className="max-w-full h-auto rounded-lg"
            width={1200}
            height={800}
          />
        )}

        <div className="flex flex-col gap-4">
          {Array.isArray(question?.options) &&
            question.options.map((option: any, idx: number) => {
              // 🔑 Chuẩn hoá ID — khớp với Set<string> ở parent
              const optId = String(
                option?.id ?? option?._id ?? option?.optionId ?? option?.value ?? idx
              );
              const isSelected = selectedAnswers.has(optId);

              return (
                <OptionItem
                  key={optId}
                  option={option}
                  isSelected={isSelected}
                  isMultipleAnswer={isMultipleAnswer} // dùng cho UI (checkbox/radio)
                  onSelect={(normalizedId) =>
                    onSelectAnswer(normalizedId, isMultipleAnswer) // parent vẫn tự tính, nhưng truyền cho đúng chữ ký
                  }
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
