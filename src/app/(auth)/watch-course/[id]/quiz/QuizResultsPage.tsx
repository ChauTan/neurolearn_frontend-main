// watch-course/[id]/quiz/QuizResultsPage.tsx
import React, { useMemo, useState } from 'react';
import { QuizResultsSummary } from '@/types/quiz';
import { ResultsOverviewHeader } from './results/ResultsOverviewHeader';
import { QuestionResultsList } from './results/QuestionResultsList';
import { IndividualQuestionResultDetails } from './results/IndividualQuestionResultDetails';
import { Card } from './ui/Card';
import { Button } from '@/components/common/ui/Button2';

const getResultId = (item: QuizResultsSummary['resultsBreakdown'][number], idx: number) => {
  const q = item.questionData as any;
  return (
    q?.id ?? q?._id ?? q?.questionId ?? `${item.questionNumber}-${item.status}-${idx}`
  ).toString();
};



export const QuizResultsPage: React.FC<{
  resultsSummary: QuizResultsSummary;
  onRetakeQuiz?: () => void;
  onBackToCourses?: () => void;
}> = ({ resultsSummary, onRetakeQuiz, onBackToCourses }) => {

  const normalized = useMemo(() => {
    const list = resultsSummary.resultsBreakdown ?? [];
    return list.map((it, idx) => ({ ...it, __resultId: getResultId(it, idx) }));
  }, [resultsSummary.resultsBreakdown]);

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    normalized.length ? normalized[0].__resultId : null
  );

  const handleBackToCourses = () => {
    onBackToCourses?.();
  };

  return (
    <div className="relative min-h-screen bg-[#F7F8FA] overflow-hidden">
      <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[1172px] h-[467px] rounded-full bg-[radial-gradient(ellipse_105.86%_58.94%_at_50%_-5.86%,#5B78FF_0%,#F7F8FA_100%)]"></div>

      <ResultsOverviewHeader resultsSummary={resultsSummary} onBackToCourses={handleBackToCourses} />

      <div className="relative z-10 mx-auto w-full mt-10 flex flex-col md:flex-row gap-10 items-stretch">
        <div className="w-2/5 flex flex-col gap-5 flex-grow">
          <QuestionResultsList
            results={normalized}
            onQuestionSelect={setSelectedQuestionId}
            selectedQuestionId={selectedQuestionId}
          />
          <div className="flex flex-col gap-4 mt-auto">
            {onRetakeQuiz && (
              <Button
                variant="default"
                size="lg"
                className="w-full flex items-center justify-center bg-[#3858F8] hover:bg-[#3858F8]/90"
                onClick={onRetakeQuiz}
              >
                Retake Quiz
              </Button>
            )}
            {onBackToCourses && (
              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center border-[#3858F8] text-[#3858F8] hover:bg-[#3858F8]/10"
                onClick={handleBackToCourses}
              >
                Back to Courses
              </Button>
            )}
          </div>
        </div>

        <Card className="flex-grow w-3/5 md:w-[983px] pt-4 pb-9 px-6 md:px-12">
          {/* Hiển thị tất cả câu */}
          <div className="flex flex-col gap-8">
            {normalized.map((r) => (
              <IndividualQuestionResultDetails key={r.__resultId} result={r} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
