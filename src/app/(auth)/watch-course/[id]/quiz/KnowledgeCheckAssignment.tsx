// ✅ KnowledgeCheckAssignment.tsx — fixed width container + wrap long question text
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Card } from './ui/Card';
import { AssignmentHeader } from './header/AssignmentHeader';
import { TimerDisplay } from './header/TimerDisplay';
import { QuestionList } from './question/QuestionList';
import { QuestionDisplay } from './question/QuestionDisplay';
import { QuestionNavigation } from './question/QuestionNavigation';
import { QuizResultsPage } from './QuizResultsPage';
import { QuestionResultItemData, QuizResultsSummary, UserAnswer } from '@/types/quiz';
import { useGetQuizByIdQuery, useSubmitQuizMutation } from '@/lib/redux/features/quiz/quizApi';

const TOTAL_TIME_MINUTES = 30;

// 🔒 Container width cố định toàn trang (giống “desktop content width”)
const PAGE_CONTAINER = 'mx-auto w-full max-w-[1319px] px-4 md:px-6';
// 🔒 Panel trái cố định, không co theo nội dung
const SIDE_PANEL_WIDTH = 'shrink-0 w-full sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[400px]';

const KnowledgeCheckAssignment = () => {
  const { quizId } = useParams();
  const { id } = useParams();
  const router = useRouter();
  const { data } = useGetQuizByIdQuery(quizId as string);
  const [submitQuiz, { isLoading: isSubmitting, error: submitError }] = useSubmitQuizMutation();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, Set<string>>>(new Map());
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_TIME_MINUTES * 60);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResultsSummary | null>(null);

  const questions = useMemo(() => data?.quiz?.questions || [], [data?.quiz?.questions]);
  const currentQuestion = questions[currentQuestionIndex];
  const progress = Math.min(100, Math.round((answers.size / questions.length) * 100));

  // ✅ Chuẩn hóa lấy id câu hỏi
  const getQId = useCallback((q: any, idx: number) => {
    return String(q?.id ?? q?._id ?? q?.questionId ?? idx);
  }, []);

  const calculateQuizResults = useCallback((isTimeOut: boolean = false): QuizResultsSummary => {
    let correctQuestionsCount = 0;
    let incorrectQuestionsCount = 0;
    let skippedQuestionsCount = 0;
    let totalScore = 0;
    let maxPossibleScore = 0;
    let attemptedQuestions = 0;

    const resultsBreakdown: QuestionResultItemData[] = questions.map((question: any, index: number) => {
      const userAnswer: UserAnswer = {
        questionId: getQId(question, index),
        selectedOptionIds: answers.get(index) || new Set<string>(),
      };

      const maxPointsForQuestion = parseInt(question.points || '0', 10);
      maxPossibleScore += maxPointsForQuestion;

      let status: 'correct' | 'incorrect' | 'skipped' = 'skipped';
      let pointsEarned = 0;

      if ((userAnswer.selectedOptionIds as Set<string>).size === 0) {
        skippedQuestionsCount++;
      } else {
        attemptedQuestions++;
        const userSelectedSorted = Array.from(userAnswer.selectedOptionIds as Set<string>).sort();
        const correctAnswersSorted = (Array.isArray(question.correctAnswerIds) ? question.correctAnswerIds : [])
          .map(String)
          .sort();
        const isCorrect =
          userSelectedSorted.length === correctAnswersSorted.length &&
          userSelectedSorted.every((val, idx2) => val === correctAnswersSorted[idx2]);

        if (isCorrect) {
          correctQuestionsCount++;
          status = 'correct';
          pointsEarned = maxPointsForQuestion;
        } else {
          incorrectQuestionsCount++;
          status = 'incorrect';
        }
        totalScore += pointsEarned;
      }

      return {
        questionNumber: question.questionNumber ?? index + 1,
        status,
        questionData: question,
        userAnswer,
        pointsEarned,
        maxPoints: maxPointsForQuestion,
      };
    });

    return {
      totalQuestions: questions.length,
      attemptedQuestions,
      correctQuestions: correctQuestionsCount,
      incorrectQuestions: incorrectQuestionsCount,
      skippedQuestions: skippedQuestionsCount,
      totalScore,
      maxPossibleScore,
      overallStatus: isTimeOut ? 'time-out' : 'completed',
      resultsBreakdown,
    };
  }, [answers, questions, getQId]);

  const mapServerToUi = useCallback((serverRaw: any): QuizResultsSummary | null => {
    const server = serverRaw?.data ?? serverRaw;
    if (!server) return null;

    const byNumber = new Map<string, any>((questions || []).map((q: any) => [String(q?.questionNumber), q]));
    const byIndex = new Map<number, any>((questions || []).map((q: any, idx: number) => [idx, q]));

    const toSet = (x: any) => new Set((Array.isArray(x) ? x : []).map((v) => String(v)));

    const normalizeSelected = (raw: any, q: any): Set<string> => {
      const arr = Array.isArray(raw) ? raw : [];
      if (!q?.options) return toSet(arr);
      const looksLikeIndex = arr.every((v) => typeof v === 'number' || /^\d+$/.test(String(v)));
      if (looksLikeIndex) {
        const ids = arr
          .map((i) => Number(i))
          .map((i) => q.options?.[i])
          .map((opt) => String(opt?.id ?? opt?._id ?? opt?.optionId ?? ''))
          .filter(Boolean);
        return new Set(ids);
      }
      return toSet(arr);
    };

    const calcStatus = (selected: Set<string>, q: any) => {
      const correct: string[] = Array.isArray(q?.correctAnswerIds)
        ? q.correctAnswerIds.map(String)
        : q?.correctAnswer != null
          ? [String(q.correctAnswer)]
          : [];
      if (selected.size === 0) return 'skipped' as const;
      const sel = [...selected].sort();
      const cor = [...correct].sort();
      const ok = sel.length === cor.length && sel.every((v, i) => v === cor[i]);
      return ok ? ('correct' as const) : ('incorrect' as const);
    };

    const breakdown = (server.breakdown || []).map((b: any, idx: number) => {
      const qNumKey = String(b.questionNumber ?? '');
      const q = (qNumKey && byNumber.get(qNumKey)) ?? byIndex.get(idx) ?? null;

      const selected = normalizeSelected(b.userSelectedOptionIds, q);
      const status = b.status ?? (q ? calcStatus(selected, q) : 'skipped');

      return {
        questionNumber: Number(b.questionNumber ?? q?.questionNumber ?? idx + 1),
        status,
        questionData: q,
        userAnswer: {
          questionId: String(b.questionId ?? (q && getQId(q, idx)) ?? ''),
          selectedOptionIds: selected,
        },
        pointsEarned: Number(b.pointsEarned ?? 0),
        maxPoints: Number(b.maxPoints ?? q?.points ?? 0),
      };
    });

    return {
      totalQuestions: server.totalQuestions ?? questions.length,
      attemptedQuestions:
        server.attemptedQuestions ??
        breakdown.filter((b: QuestionResultItemData) => (b.userAnswer.selectedOptionIds as Set<string>).size > 0).length,
      correctQuestions:
        server.correctQuestions ?? breakdown.filter((b: QuestionResultItemData) => b.status === 'correct').length,
      incorrectQuestions:
        server.incorrectQuestions ?? breakdown.filter((b: QuestionResultItemData) => b.status === 'incorrect').length,
      skippedQuestions:
        server.skippedQuestions ?? breakdown.filter((b: QuestionResultItemData) => b.status === 'skipped').length,
      totalScore:
        server.totalScore ??
        server.score ??
        breakdown.reduce((s: number, b: QuestionResultItemData) => s + (b.pointsEarned || 0), 0),
      maxPossibleScore:
        server.maxPossibleScore ?? breakdown.reduce((s: number, b: QuestionResultItemData) => s + (b.maxPoints || 0), 0),
      overallStatus: server.overallStatus ?? 'completed',
      resultsBreakdown: breakdown,
    };
  }, [questions, getQId]);

  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const doSubmitToServer = useCallback(async (isTimeOut: boolean) => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const payloadAnswers = questions.map((q: any, index: number) => ({
        questionId: getQId(q, index),
        selectedOptionIds: Array.from(answers.get(index) || []),
      }));
      const timeTakenSeconds = TOTAL_TIME_MINUTES * 60 - secondsLeft;

      const res = await submitQuiz({
        id: quizId as string,
        payload: { answers: payloadAnswers, timeTakenSeconds, meta: { isTimeOut } },
      }).unwrap();

      const uiResult = mapServerToUi(res?.data) ?? calculateQuizResults(isTimeOut);
      setQuizResults(uiResult);
    } catch (err: any) {
      const status = err?.status;
      const msg = err?.data?.message || err?.error || String(err);
      console.error('[submit:fail]', { status, msg, raw: err });
      setQuizResults(calculateQuizResults(isTimeOut));
    } finally {
      setQuizSubmitted(true);
    }
  }, [answers, calculateQuizResults, mapServerToUi, questions, quizId, secondsLeft, submitQuiz, getQId]);

  const handleSubmit = useCallback((isTimeOut: boolean = false) => {
    if (quizSubmitted || isSubmitting) return;
    void doSubmitToServer(isTimeOut);
  }, [doSubmitToServer, quizSubmitted, isSubmitting]);

  // ⏱️ Timer
  useEffect(() => {
    if (quizSubmitted || isSubmitting) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (!quizSubmitted && !isSubmitting) handleSubmit(true);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [quizSubmitted, isSubmitting, handleSubmit]);

  useEffect(() => {
    if (submitError) console.error('[submit:error state]', submitError);
  }, [submitError]);

  useEffect(() => {
    if (quizSubmitted) console.log('[result] quizResults', quizResults);
  }, [quizSubmitted, quizResults]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} Min`;
  };

  const handleSelectAnswer = useCallback(
    (optionId: string,) => {
      setAnswers((prev) => {
        const newAnswers = new Map(prev);

        // 👉 Ground truth: đọc trực tiếp từ câu hỏi hiện tại
        const q = questions[currentQuestionIndex];
        const isMultiple =
          !!(
            q?.choicesConfig?.isMultipleAnswer ||      // <-- sửa đúng: choicesConfig (không có số 2)
            q?.questionType === 'multiple-choice'
          );

        // Clone để tránh mutate in-place
        const prevSet = newAnswers.get(currentQuestionIndex) ?? new Set<string>();
        const nextSet = new Set<string>(prevSet);

        if (isMultiple) {
          // Toggle
          if (nextSet.has(optionId)) nextSet.delete(optionId);
          else nextSet.add(optionId);
        } else {
          // Single
          nextSet.clear();
          nextSet.add(optionId);
        }

        newAnswers.set(currentQuestionIndex, nextSet);
        return newAnswers;
      });
    },
    [currentQuestionIndex, questions]
  );


  const handleNext = () => setCurrentQuestionIndex(i => Math.min(i + 1, questions.length - 1));
  const handlePrevious = () => setCurrentQuestionIndex(i => Math.max(i - 1, 0));
  const handleQuestionSelect = (index: number) => setCurrentQuestionIndex(index);

  const completedQuestions = new Set<number>(
    Array.from(answers.entries()).filter(([, selected]) => selected.size > 0).map(([index]) => index)
  );

  const handleGoBack = () => router.push(`/watch-course/${id}`);
  const handleRetakeQuiz = () => {
    setQuizSubmitted(false);
    setQuizResults(null);
    setAnswers(new Map());
    setCurrentQuestionIndex(0);
    setSecondsLeft(TOTAL_TIME_MINUTES * 60);
  };

  if (quizSubmitted) {
    const safeResults = quizResults ?? calculateQuizResults(secondsLeft === 0);
    return (
      <QuizResultsPage
        resultsSummary={safeResults}
        onRetakeQuiz={handleRetakeQuiz}
        onBackToCourses={handleGoBack}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#F7F8FA] overflow-hidden">
      {/* Nền gradient (không ảnh hưởng width) */}
      <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[1172px] h-[467px] rounded-full bg-[radial-gradient(ellipse_105.86%_58.94%_at_50%_-5.86%,#5B78FF_0%,#F7F8FA_100%)]"></div>

      {/* Header: KHÓA width bằng PAGE_CONTAINER */}
      <Card className={`relative z-10 ${PAGE_CONTAINER} py-6 flex items-center justify-between`}>
        <AssignmentHeader progress={progress} onBackClick={handleGoBack} />
        <TimerDisplay timeLeft={formatTime(secondsLeft)} />
      </Card>

      {/* Main: KHÓA width + ép wrap text, không cho giãn ngang */}
      <div className={`relative z-10 ${PAGE_CONTAINER} mt-10 flex flex-col md:flex-row gap-8 xl:gap-10 items-stretch`}>
        {/* Panel trái cố định */}
        <div className={`flex flex-col gap-5 ${SIDE_PANEL_WIDTH}`}>
          <Card className="p-6 h-full">
            <QuestionList
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={handleQuestionSelect}
              completedQuestions={completedQuestions}
            />
          </Card>

          <QuestionNavigation
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={() => handleSubmit(false)}
            canGoPrevious={currentQuestionIndex > 0}
            canGoNext={currentQuestionIndex < questions.length - 1}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Panel phải: chiếm phần còn lại, cho phép xuống dòng */}
        <Card className="flex-1 min-w-0 w-full pt-4 pb-9 px-6 md:px-12 overflow-hidden">
          {/* ⬇️ Wrapper ép text xuống dòng & tự ngắt từ nếu quá dài */}
          <div className="min-w-0 whitespace-normal break-words hyphens-auto">
            {currentQuestion && (
              <QuestionDisplay
                key={`${getQId(currentQuestion, currentQuestionIndex)}-${currentQuestionIndex}`}
                question={currentQuestion}
                selectedAnswers={answers.get(currentQuestionIndex) || new Set()}
                onSelectAnswer={handleSelectAnswer}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeCheckAssignment;
