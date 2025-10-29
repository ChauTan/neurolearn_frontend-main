'use client';

import { useMemo, useState, useCallback } from 'react';
import { ChevronDown, Lock, CheckCircle2, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';

type MixedItem =
  | { kind: 'lesson'; _id: string; order?: number; title: string; payload: any }
  | { kind: 'quiz'; _id: string; order?: number; name: string; title?: string; payload: any };

type CourseContentProps = Readonly<{
  courseId: string;
  sections: {
    _id: string;
    title: string;
    lessons: {
      _id: string;
      title: string;
      videoLength?: number;
      isFree?: boolean;
      order?: number;
      videoUrl?: { url: string };
      isCompleted?: boolean;
    }[];
    quizzes?: {
      _id: string;
      name: string;
      examTitle?: string;
      duration: string;
      difficulty: 'easy' | 'medium' | 'hard';
      totalQuestions: number;
      order?: number;
      // BE có thể merge thêm: isCompleted, isPassed, lastScore, attempts...
    }[];
    /** Nếu BE trả sẵn mảng items (lesson + quiz đã trộn), dùng luôn */
    items?: MixedItem[];
  }[];
  onLessonClick: (url: string, lessonId: string) => void;
  progress?: { totalLessons: number; totalCompleted: number; progressPercentage: number };
  /** bài đang xem để highlight nhẹ */
  currentLessonId?: string;
}>;

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, when: 'beforeChildren' } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 30, mass: 0.6 } }
};

const buildDisplayItems = (section: CourseContentProps['sections'][number]): MixedItem[] => {
  // Nếu có items thì sử dụng luôn
  if (Array.isArray(section.items) && section.items.length) {
    return [...section.items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) as MixedItem[];
  }
  // Nếu không có items thì tạo từ lessons và quizzes
  const lessonItems: MixedItem[] = (section.lessons || []).map(l => ({
    kind: 'lesson',
    _id: l._id,
    order: typeof l.order === 'number' ? l.order : 0,
    title: l.title,
    payload: l,
  }));

  const quizItems: MixedItem[] = (section.quizzes || []).map(q => ({
    kind: 'quiz',
    _id: q._id,
    order: typeof q.order === 'number' ? q.order : 0,
    name: q.name,
    title: q.name,
    payload: q,
  }));

  return [...lessonItems, ...quizItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export default function CourseContent({
  courseId,
  sections,
  onLessonClick,
  progress,
  currentLessonId,
}: CourseContentProps) {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const router = useRouter();

  const toggleSection = (id: string) => {
    setOpenSections(prev => (prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]));
  };

  // --- helpers ---
  const isItemCompleted = (it: MixedItem) =>
    it.kind === 'lesson'
      ? !!it.payload?.isCompleted
      : !!it.payload?.isCompleted || !!it.payload?.isPassed || false;

  const previousSectionsCompleted = useCallback((sectionIndex: number) => {
    if (!sections) return false;
    if (sectionIndex === 0) return true;
    for (let i = 0; i < sectionIndex; i++) {
      const items = buildDisplayItems(sections[i]);
      if (!items.every(isItemCompleted)) return false;
    }
    return true;
  }, [sections]);

  const canAccessLessonMixed = useCallback((sectionIndex: number, lessonId: string) => {
    if (!previousSectionsCompleted(sectionIndex)) return false;
    const items = buildDisplayItems(sections[sectionIndex]);
    const idx = items.findIndex(it => it.kind === 'lesson' && it._id === lessonId);
    if (idx === -1) return false;
    if (idx === 0) return true; // first item of section
    return items.slice(0, idx).every(isItemCompleted);
  }, [sections, previousSectionsCompleted]);

  const canAccessQuiz = useCallback((sectionIndex: number, quizItem: MixedItem, displayItems: MixedItem[]) => {
    if (!previousSectionsCompleted(sectionIndex)) return false;
    const qIdx = displayItems.findIndex(it => it.kind === 'quiz' && it._id === quizItem._id);
    if (qIdx === -1) return false;
    return displayItems.slice(0, qIdx).every(isItemCompleted);
  }, [previousSectionsCompleted]);

  const nextUp = useMemo(() => {
    if (!sections?.length) return null;
    for (let s = 0; s < sections.length; s++) {
      if (!previousSectionsCompleted(s)) break;
      const section = sections[s];
      const displayItems = buildDisplayItems(section);
      for (let i = 0; i < displayItems.length; i++) {
        const it = displayItems[i];
        if (it.kind === 'lesson') {
          const l = it.payload as (typeof section.lessons)[number];
          if (!l.isCompleted && canAccessLessonMixed(s, l._id)) {
            return { sIndex: s, kind: 'lesson' as const, id: l._id };
          }
        } else {
          const unlockedQuiz = canAccessQuiz(s, it, displayItems);
          const qCompleted = isItemCompleted(it);
          if (!qCompleted && unlockedQuiz) {
            return { sIndex: s, kind: 'quiz' as const, id: it._id };
          }
        }
      }
    }
    return null;
  }, [sections, previousSectionsCompleted, canAccessLessonMixed, canAccessQuiz]);

  return (
    <div className="max-w-full mx-auto text-black">
      {/* Overall progress */}
      {progress && (
        <div className="mb-3 rounded-xl border border-gray-200 bg-[#ECECEC] p-2">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-extralight antialiased italic">Your progress</span>
            <span className="text-xs text-gray-700">
              {progress.totalCompleted}/{progress.totalLessons} ({progress.progressPercentage}%)
            </span>
          </div>
          <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
            <motion.div
              className="h-1 bg-green-500 rounded"
              initial={{ width: 0 }}
              animate={{ width: `${progress.progressPercentage}%` }}
              transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            />
          </div>
        </div>
      )}

      {sections?.map((section, sIdx) => {
        const isOpen = openSections.includes(section._id);
        const sectionDoneCount = section.lessons?.filter(l => l.isCompleted).length ?? 0;
        const sectionTotal = section.lessons?.length ?? 0;
        const sectionPct = sectionTotal ? Math.round((sectionDoneCount / sectionTotal) * 100) : 0;
        const displayItems = buildDisplayItems(section);

        return (
          <motion.div
            key={section._id}
            layout
            className="rounded-xl bg-[#F9F9F9] w-full mb-2 overflow-hidden shadow-sm border border-gray-100"
          >
            {/* Section header */}
            <motion.button
              layout
              onClick={() => toggleSection(section._id)}
              className="flex justify-between items-center w-full px-4 py-3 text-left"
              whileTap={{ scale: 0.995 }}
              whileHover={{ backgroundColor: '#e4e4e7' }}
              transition={{ duration: 0.12 }}
            >
              <div className="flex-1 min-w-0">
                <span
                  className="block text-lg font-semibold leading-snug line-clamp-2"
                  title={section.title}
                >
                  {section.title}
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1 flex-1 max-w-[120px] bg-gray-200 rounded overflow-hidden">
                    <motion.div
                      className="h-1 bg-green-500 rounded"
                      initial={false}
                      animate={{ width: `${sectionPct}%` }}
                      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-600 whitespace-nowrap">
                    {sectionDoneCount}/{sectionTotal}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center gap-3 ml-4">
                {sectionPct === 100 ? (
                  <div className="flex items-center gap-1 text-green-600 text-xs whitespace-nowrap">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-amber-600 text-xs whitespace-nowrap">
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">In progress</span>
                  </div>
                )}
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              </div>
            </motion.button>

            {/* Collapse body */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { height: 'auto', opacity: 1 },
                    collapsed: { height: 0, opacity: 0 }
                  }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="text-sm overflow-hidden"
                >
                  <motion.div variants={listVariants} initial="hidden" animate="show" className="py-1">
                    {displayItems.map((it) => {
                      // LESSON ITEM
                      if (it.kind === 'lesson') {
                        const l = it.payload as (typeof section.lessons)[number];
                        const unlocked = canAccessLessonMixed(sIdx, l._id);
                        const isNextUp = nextUp && nextUp.kind === 'lesson' && nextUp.id === l._id;
                        const isActive = currentLessonId === l._id;

                        return (
                          <motion.div
                            key={`lesson-${l._id}`}
                            variants={itemVariants}
                            role="button"
                            tabIndex={0}
                            aria-current={isActive ? 'true' : undefined}
                            onClick={() => {
                              if (unlocked && l.videoUrl?.url) onLessonClick(l.videoUrl.url, l._id);
                            }}
                            onKeyDown={(e) => {
                              if ((e.key === 'Enter' || e.key === ' ') && unlocked && l.videoUrl?.url) {
                                onLessonClick(l.videoUrl.url, l._id);
                              }
                            }}
                            className={[
                              'group grid grid-cols-[auto,1fr,auto] items-center gap-3 px-4 py-2 rounded-md mx-1 transition-colors',
                              unlocked ? 'cursor-pointer hover:bg-gray-100' : 'opacity-60 cursor-not-allowed bg-gray-50',
                              isActive ? 'bg-blue-50 ring-1 ring-blue-200' : '',
                            ].join(' ')}
                            title={
                              unlocked
                                ? undefined
                                : sIdx > 0
                                  ? 'Complete all previous sections to unlock this lesson'
                                  : 'Complete previous lesson to unlock this one'
                            }
                            whileTap={unlocked ? { scale: 0.995 } : undefined}
                            animate={
                              isNextUp
                                ? { scale: [1, 1.01, 1], boxShadow: ['none', '0 0 0 3px rgba(34,197,94,0.12)', 'none'] }
                                : {}
                            }
                            transition={isNextUp ? { duration: 1.2, repeat: Infinity } : undefined}
                          >
                            {/* LEFT: icon + title */}
                            <div className="flex items-center gap-2 min-h-[40px]">
                              {l.isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : unlocked ? (
                                <Play className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}

                              <div className="flex items-center gap-2">
                                <span className={`text-base leading-tight ${isActive ? 'text-blue-700' : 'text-[#3A3C45]'}`}>
                                  {typeof it.order === 'number' ? `${it.order}. ` : ''}
                                  {l.title}
                                </span>
                              </div>
                            </div>

                            {/* RIGHT: fixed-width status column */}
                            <div className="flex justify-end">
                              {l.isCompleted ? (
                                <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-[10px]">
                                  Completed
                                </span>
                              ) : unlocked ? (
                                isNextUp ? (
                                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                                    Next up
                                    </span>
                                  ) : (
                                    <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-[10px]">
                                      In progress
                                    </span>
                                  )
                                ) : (
                                  <span className="text-gray-600 bg-gray-200/70 px-2 py-0.5 rounded-full text-[10px]">
                                  Locked
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      }

                      // QUIZ ITEM
                      const q = it.payload as NonNullable<CourseContentProps['sections'][number]['quizzes']>[number];
                      const displayItemsInSection = displayItems;
                      const unlockedQuiz = canAccessQuiz(sIdx, it, displayItemsInSection);
                      const isNextUpQuiz = nextUp && nextUp.kind === 'quiz' && nextUp.id === q._id;

                      // từ BE
                      const qCompleted = !!(q as any).isCompleted || !!(q as any).isPassed;
                      const isPassed = !!(q as any).isPassed;
                      const hasAttempts = !!(q as any).attempts || !!(q as any).isCompleted || !!(q as any).lastScore;
                      const lastScore = (q as any).lastScore ?? null;

                      const quizClickable = unlockedQuiz || qCompleted;

                      return (
                        <motion.div
                          key={`quiz-${q._id}`}
                          variants={itemVariants}
                          role="button"
                          tabIndex={0}
                          className={[
                            'group grid grid-cols-[1fr,7.5rem] items-center gap-3 px-4 py-2 rounded-md mx-1 transition-colors',
                            quizClickable ? 'cursor-pointer hover:bg-gray-100' : 'opacity-60 cursor-not-allowed bg-gray-50',
                          ].join(' ')}
                          onClick={() => {
                            if (quizClickable) router.push(`/watch-course/${courseId}/quiz/${q._id}`);
                          }}
                          onKeyDown={(e) => {
                            if (quizClickable && (e.key === 'Enter' || e.key === ' ')) {
                              router.push(`/watch-course/${courseId}/quiz/${q._id}`);
                            }
                          }}
                          title={
                            quizClickable
                              ? undefined
                              : sIdx > 0
                                ? 'Complete all previous sections and lessons to unlock this quiz'
                                : 'Complete previous lessons to unlock this quiz'
                          }
                          whileTap={quizClickable ? { scale: 0.995 } : undefined}
                          animate={
                            isNextUpQuiz
                              ? { scale: [1, 1.01, 1], boxShadow: ['none', '0 0 0 3px rgba(34,197,94,0.12)', 'none'] }
                              : {}
                          }
                          transition={isNextUpQuiz ? { duration: 1.2, repeat: Infinity } : undefined}
                        >
                          {/* LEFT: title + meta */}
                          <div className="flex flex-col min-h-[40px] justify-center">
                            <span className="text-[#3A3C45] text-base font-medium leading-tight whitespace-normal break-words">
                              {typeof it.order === 'number' ? `${it.order}. ` : ''}Quiz: {q.name}
                            </span>
                            <span className="text-xs text-gray-500 whitespace-normal break-words">
                              {q.difficulty} | {q.totalQuestions} questions
                              {hasAttempts && lastScore != null && <> | Last score: {lastScore}</>}
                            </span>
                          </div>

                          {/* RIGHT: fixed-width status column */}
                          <div className="flex justify-end">
                            {qCompleted ? (
                              isPassed ? (
                                <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full text-[10px]">Passed</span>
                              ) : (
                                <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-[10px]">Failed</span>
                              )
                            ) : (
                              !unlockedQuiz && (
                                <span className="text-gray-600 bg-gray-200/70 px-2 py-0.5 rounded-full text-[10px]">Locked</span>
                              )
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
