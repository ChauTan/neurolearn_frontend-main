// watch-course/[id]/quiz/question/QuestionNavigation.tsx
import React from 'react';
import { Button } from '@/components/common/ui/Button2';

interface QuestionNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isSubmitting?: boolean; // NEW
}

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  canGoPrevious,
  canGoNext,
  isSubmitting = false, // NEW
}) => {
  const disableAll = isSubmitting;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between gap-5">
        <Button
          variant="ghost"
          size="default"
          className="w-1/2 flex items-center justify-center"
          onClick={onPrevious}
          disabled={disableAll || !canGoPrevious} // NEW
        >
          <svg className="w-5 h-5 text-[#3858F8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Previous
        </Button>

        <Button
          variant="ghost"
          size="default"
          className="w-1/2 flex items-center justify-center"
          onClick={onNext}
          disabled={disableAll || !canGoNext} // NEW
        >
          Next
          <svg className="w-5 h-5 text-[#3858F8] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </Button>
      </div>

      <Button
        variant="default"
        size="lg"
        className="w-full flex items-center justify-center"
        onClick={onSubmit}
        disabled={disableAll} // NEW
      >
        <svg className="w-6 h-6 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        {isSubmitting ? 'Submitting...' : 'Submit'} {/* NEW */}
      </Button>
    </div>
  );
};
