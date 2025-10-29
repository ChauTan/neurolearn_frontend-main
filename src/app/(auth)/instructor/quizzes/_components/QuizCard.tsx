// app/(auth)/dashboard/create-quiz/_components/QuizCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { Quiz } from './types';
import { useToast } from '@/hooks/use-toast';
import { useDeleteQuizMutation } from '@/lib/redux/features/quiz/quizApi';
import QuizOptions from './QuizOptions';
import defaultCover from '@/public/assets/create-quiz/thumbnail.png';
import { useModal } from '@/context/ModalContext';

interface QuizCardProps {
  quiz: Quiz;
  disableLink?: boolean;
  hideOptions?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  liftOnHover?: boolean;
}


const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  disableLink = false,
  hideOptions = false,
  isSelected = false,
  onClick,
  className = '',
  liftOnHover = true,
}) => {
  const [deleteQuiz] = useDeleteQuizMutation();
  const { toast } = useToast();

  const { showModal } = useModal(); // ⬅️ lấy showModal

  const handleDeleteQuiz = async (id: string) => {
    showModal('actionConfirm', {
      title: 'Delete quiz?',
      description: `This will permanently remove "${quiz?.name || 'this quiz'}". This action cannot be undone.`,
      confirmText: 'Delete',
      confirmTextLoading: 'Deleting...',
      cancelText: 'Cancel',
      variant: 'danger', // hoặc 'destructive' theo style bạn đặt
      onConfirm: async () => {
        try {
          await deleteQuiz(id).unwrap();
          toast({ title: 'Success', description: 'Quiz deleted successfully', variant: 'success' });
        } catch (err: any) {
          toast({
            title: 'Error',
            description: err?.data?.message || 'Quiz delete failed',
            variant: 'destructive',
          });
          throw err; // để modal (nếu có) biết là action fail, không auto close
        }
      },
    });
  };
  const FALLBACK_IMG: StaticImageData = defaultCover;
  const coverSrc: string | StaticImageData =
    typeof quiz?.imageUrl === 'string' && quiz.imageUrl.trim()
      ? (quiz.imageUrl as string)
      : FALLBACK_IMG;


  const numberOfQuestions = quiz.totalQuestions ?? quiz.questions?.length ?? 0;

  const CardInner = (
    <div
      className={[
        'bg-white rounded-3xl border border-slate-200',
        'shadow-sm hover:shadow-md transition-all duration-300',
        liftOnHover ? 'motion-safe:hover:-translate-y-[2px]' : '',
        'overflow-hidden group',
        isSelected ? 'border-neutral-800' : '',
        className,
      ].join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="p-3 grid grid-cols-3 gap-x-3 gap-y-1 min-h-[160px]">
        {/* 1. Thumbnail */}
        <div className="relative w-full h-full row-span-2 bg-slate-100 rounded-xl overflow-hidden self-start">
          <Image
            src={coverSrc}
            alt="Quiz cover"
            fill
            className="object-cover rounded-lg"
            unoptimized
          />
        </div>

        {/* 2. Category */}
        {quiz.category && (
          <div className="col-start-2 row-start-1 flex items-center">
            <span
              className={[
                'inline-block px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap',
                quiz.category === 'Grapic Design'
                  ? 'bg-blue-100 text-blue-700'
                  : quiz.category === 'Web Development'
                    ? 'bg-emerald-100 text-emerald-700'
                    : quiz.category === 'Data Science'
                      ? 'bg-amber-100 text-amber-700'
                      : quiz.category === 'UX Design'
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-indigo-100 text-indigo-700',
              ].join(' ')}
            >
              {quiz.category}
            </span>
          </div>
        )}

        {/* 3. Options (ẩn trong modal) */}
        {!hideOptions && (
          <div className="col-start-3 row-start-1 flex justify-end items-center">
            <QuizOptions quizId={quiz._id} onDelete={handleDeleteQuiz as any} />
          </div>
        )}

        {/* 4. Title */}
        <h3 className="col-span-2 col-start-2 pr-4 row-start-2 text-sm sm:text-[15px] font-semibold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {quiz.name}
        </h3>

        {/* 5. Info row */}
        <div className="col-span-3 flex flex-wrap gap-x-6 gap-y-1 row-start-3 text-xs text-slate-500 mt-1">
          <div className="flex items-center gap-1.5">
            <Image src="/assets/create-quiz/sort.svg" alt="" width={11} height={11} />
            <p className="truncate">
              Exam Title:{' '}
              <span className="font-medium text-blue-600">{quiz.examTitle || quiz.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Image src="/assets/create-quiz/element-equal.svg" alt="" width={11} height={11} />
            <p>
              Questions:{' '}
              <span className="font-medium text-blue-600">{numberOfQuestions} Sentences</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Image src="/assets/create-quiz/timer.svg" alt="" width={11} height={11} />
            <p>
              Duration:{' '}
              <span className="font-medium text-blue-600">{quiz.duration || 'N/A'}</span>
            </p>
          </div>
        </div>

        {/* 6-7. Progress */}
        {typeof quiz.progress === 'number' && (
          <>
            <div className="col-span-2 row-start-4 flex items-center mt-1">
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-2.5 bg-blue-500" style={{ width: `${quiz.progress}%` }} />
              </div>
            </div>
            <div className="col-start-3 row-start-4 flex justify-end items-center mt-1">
              <p className="text-md font-bold pr-2 text-blue-500">{quiz.progress}%</p>
            </div>
          </>
        )}

        {/* 8. Created at */}
        <div className="col-span-3 sm:col-span-2 row-start-5 mt-1">
          <p className="text-[11px] font-semibold sm:text-[11px] text-slate-400 flex gap-1">
            Creation Date: <span className="text-blue-600">{quiz.createdAt || 'N/A'}</span>
          </p>
        </div>
      </div>
    </div>
  );

  if (disableLink) return CardInner;

  return (
    <Link
      href={`/instructor/quizzes/builder/${quiz._id}`}
      className="block focus:outline-none focus-visible:outline-none"
    >
      {CardInner}
    </Link>
  );
};

export default QuizCard;
