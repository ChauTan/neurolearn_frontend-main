// watch-course/[id]/quiz/results/IndividualQuestionResultDetails.tsx
import React, { useMemo } from 'react';
import { QuestionResultItemData } from '@/types/quiz';
import Image from 'next/image';

interface IndividualQuestionResultDetailsProps {
  result: QuestionResultItemData;
}

const toId = (obj: any, fallback: string) =>
  obj?.id ?? obj?._id ?? obj?.questionId ?? fallback;

const toSet = (val: any): Set<string> => {
  if (!val) return new Set<string>();
  if (val instanceof Set) return new Set(Array.from(val).map(String));
  if (Array.isArray(val)) return new Set(val.map(String));
  return new Set<string>();
};

export const IndividualQuestionResultDetails: React.FC<IndividualQuestionResultDetailsProps> = ({ result }) => {
  // Safe destructuring
  const questionData: any = result?.questionData ?? null;
  const status = result?.status ?? 'skipped';
  const pointsEarned = Number(result?.pointsEarned ?? 0);
  const maxPoints = Number(result?.maxPoints ?? 0);
  const rationale = (result as any)?.rationale;
  const userSelectedSet: Set<string> = useMemo(
    () => toSet(result?.userAnswer?.selectedOptionIds),
    [result?.userAnswer?.selectedOptionIds]
  );
  // Nếu không có dữ liệu câu hỏi thì hiển thị placeholder nhẹ
  if (!questionData) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-xl font-semibold text-[#3858F8]">Question</div>
        <div className="text-gray-500">No question data available.</div>
      </div>
    );
  }

  // Safe fields
  const isMultipleAnswer: boolean = !!questionData?.choicesConfig?.isMultipleAnswer;
  const questionNumber: number = Number(questionData?.questionNumber ?? result?.questionNumber ?? 0);
  const points: number | undefined = questionData?.points != null ? Number(questionData.points) : undefined;
  const title: string = questionData?.title ?? '';
  const questionImage: string | null =
    typeof questionData?.questionImage === 'string' ? questionData.questionImage : null;

  const options: any[] = Array.isArray(questionData?.options) ? questionData.options : [];
  const correctAnswerIds: string[] = Array.isArray(questionData?.correctAnswerIds)
    ? questionData.correctAnswerIds.map(String)
    : (questionData?.correctAnswer != null ? [String(questionData.correctAnswer)] : []);

  // Feedback UI
  let feedbackBgColor = '';
  let feedbackTextColor = '';
  let feedbackText = '';
  let feedbackSubtext = '';
  let feedbackIcon = null as React.ReactNode;

  if (status === 'correct') {
    feedbackBgColor = 'bg-[#D4F6EE]';
    feedbackTextColor = 'text-[#00CE9C]';
    feedbackText = 'All correct';
    feedbackSubtext = 'Receive full point';
    feedbackIcon = (
      <div className="relative w-10 h-10 rounded-full bg-[#00CE9C] flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  } else if (status === 'incorrect') {
    feedbackBgColor = 'bg-[#FFE7D7]';
    feedbackTextColor = 'text-[#FF7410]';
    feedbackText = 'Wrong answer';
    feedbackSubtext = 'Receive 0% point';
    feedbackIcon = (
      <div className="relative w-10 h-10 rounded-full bg-[#FF7410] flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  } else {
    feedbackBgColor = 'bg-[#F7F8FA]';
    feedbackTextColor = 'text-[#6B6B6B]';
    feedbackText = 'Skipped';
    feedbackSubtext = 'No point received';
    feedbackIcon = (
      <div className="relative w-10 h-10 rounded-full bg-[#D9D9D9] flex items-center justify-center">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Title + Points */}
      <div className="flex items-baseline gap-2 question-title-clip">
        <div className="text-2xl font-semibold text-[#3858F8] leading-7">
          Question {questionNumber}
        </div>
        {points != null && (
          <div className="text-base font-normal text-[#6B6B6B] leading-5">
            ({points} points)
          </div>
        )}
      </div>

      {/* Question text + image */}
      <div className="flex flex-col gap-8">
        {title && <div className="text-xl font-medium text-[#0D0D0D] leading-6">{title}</div>}
        {questionImage && (
          <Image
            src={questionImage}
            alt="Question"
            width={800}
            height={450}
            className="max-w-full h-auto rounded-lg"
          />
        )}

        {/* Options */}
        <div className="flex flex-col gap-4">
          {options.map((option: any, idx: number) => {
            const optionId = String(toId(option, String(idx)));
            const isUserSelected = userSelectedSet.has(optionId);
            const isCorrectAnswer = correctAnswerIds.includes(optionId);

            const optionBgColor = 'bg-white';
            let optionTextColor = 'text-[#6B6B6B]';
            let leftBarColor = '';
            let radioColor = 'border-[#D9D9D9]';
            let radioDotColor = '';

            if (isCorrectAnswer) {
              leftBarColor = 'bg-[#00CE9C]';
              optionTextColor = 'text-[#00CE9C]';
              radioColor = 'border-[#00CE9C]';
              radioDotColor = 'bg-[#00CE9C]';
            }

            if (isUserSelected && !isCorrectAnswer) {
              leftBarColor = 'bg-[#FF7410]';
              optionTextColor = 'text-[#FF7410]';
              radioColor = 'border-[#FF7410]';
              radioDotColor = 'bg-[#FF7410]';
            }

            return (
              <div
                key={optionId}
                className={`relative w-full py-1 pl-4 pr-6 rounded-xl cursor-pointer ${optionBgColor} shadow-sm transition-colors duration-200`}
              >
                {leftBarColor && (
                  <div className={`absolute left-2 top-1/2 -translate-y-1/2 h-[calc(100%-8px)] w-3 rounded-xl ${leftBarColor}`} />
                )}
                <div className="flex items-center justify-between py-1 px-4">
                  <div className={`flex-grow flex items-center h-12 text-base font-medium leading-5 ${optionTextColor}`}>
                    {option?.text ?? ''}
                  </div>

                  {isMultipleAnswer ? (
                    <div className={`w-6 h-6 rounded border-[1.5px] flex-shrink-0 flex items-center justify-center ${radioColor}`}>
                      {(isCorrectAnswer || isUserSelected) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ) : (
                      <div className={`w-6 h-6 rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center ${radioColor}`}>
                      {(isCorrectAnswer || isUserSelected) && (
                          <div className={`w-4 h-4 rounded-full ${radioDotColor}`} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback */}
        <div className={`self-stretch h-20 px-12 py-5 ${feedbackBgColor} rounded-xl flex flex-col justify-center items-start gap-2`}>
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-3">
              {feedbackIcon}
              <div className="flex flex-col">
                <div className={`font-semibold text-base leading-5 ${feedbackTextColor}`}>{feedbackText}</div>
                <div className={`font-normal text-sm leading-4 ${feedbackTextColor}`}>{feedbackSubtext}</div>
              </div>
            </div>
            <div className={`font-semibold text-base leading-5 ${feedbackTextColor}`}>
              ({pointsEarned}/{maxPoints} Point)
            </div>
          </div>
        </div>

        {/* Rationale */}
        {rationale && (
          <div className="self-stretch bg-[#F7F8FA] rounded-xl p-6 text-[#0D0D0D] text-base">
            <h3 className="font-semibold text-lg mb-2">Explanation:</h3>
            <p>{rationale}</p>
          </div>
        )}
      </div>
    </div>
  );
};
