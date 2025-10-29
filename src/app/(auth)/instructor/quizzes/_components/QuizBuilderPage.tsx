'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import QuestionListSidebar from './QuestionListSidebar';
import InstructorQuestionEditor from './InstructorQuestionEditor';
import QuizBuilderHeader from './QuizBuilderHeader';
import { QuestionData, QuestionSummary } from './types';
import {
  useGetQuizByIdQuery,
  useUpdateQuizMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from '@/lib/redux/features/quiz/quizApi';
import CreateWithAIModal, { AIQuestionType } from './CreateWithAIModal';
import axios from 'axios';

function getIconForQuestionType(type: QuestionData['questionType']): React.ReactNode {
  if (type === 'multiple-choice' || type === 'single-choice') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return null;
}

interface QuizBuilderPageProps {
  params?: { quizId?: string };
}

const MAX_IMAGE_MB = 5;
const MIN_W = 600;
const MIN_H = 338; // ~16:9

const QuizBuilderPage: React.FC<QuizBuilderPageProps> = ({ params }) => {
  const router = useRouter();
  const pathParams = useParams();
  const { toast } = useToast();
  const [updateQuiz] = useUpdateQuizMutation();
  const [addQuestion] = useAddQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const quizIdToLoad =
    params?.quizId || (typeof pathParams?.quizId === 'string' ? pathParams.quizId : undefined);

  // ====== STATE ======
  const [quizName, setQuizName] = useState<string>('');
  const [quizDuration, setQuizDuration] = useState<string>('30');
  const [quizCategory, setQuizCategory] = useState<string>('');
  const [passingScore, setPassingScore] = useState<number>(70);

  const [questionsList, setQuestionsList] = useState<QuestionData[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentQuizIdInternal, setCurrentQuizIdInternal] = useState<string | null>(null);
  const [currentQuizCreatedAt, setCurrentQuizCreatedAt] = useState<string | undefined>(undefined);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [, setAiBusy] = useState(false);

  // === COVER IMAGE UPLOAD STATE ===
  const [coverUrl, setCoverUrl] = useState<string>('');    // url hiện có (từ server)
  const [imageFile, setImageFile] = useState<File | null>(null); // file mới
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // preview của file mới
  const [removeCover, setRemoveCover] = useState<boolean>(false); // đánh dấu xóa ảnh
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const {
    data: fetchedQuiz,
    isLoading,
    isError,
  } = useGetQuizByIdQuery(quizIdToLoad as string, {
    skip: !quizIdToLoad,
  });

  const defaultFirstQuestion = useCallback((): QuestionData => {
    const newId = `q_${Date.now()}_init`;
    return {
      id: newId,
      questionNumber: 1,
      title: 'New Question 1',
      questionType: 'single-choice',
      questionImage: null,
      choicesConfig: { isMultipleAnswer: false, isAnswerWithImageEnabled: false },
      options: [
        { id: `nqo_${Date.now()}_1`, text: 'Option A' },
        { id: `nqo_${Date.now()}_2`, text: 'Option B' },
      ],
      correctAnswerIds: [],
      points: '01',
      isRequired: true,
    };
  }, []);

  // ====== LOAD DATA ======
  useEffect(() => {
    if (fetchedQuiz && fetchedQuiz.quiz) {
      const serverQuiz = fetchedQuiz.quiz;

      setQuizName(serverQuiz.name || '');
      setQuizDuration(String(serverQuiz.duration ?? '30'));
      setQuizCategory(serverQuiz.category ?? '');
      setPassingScore(Number(serverQuiz.passingScore ?? 70));

      setCoverUrl(serverQuiz.imageUrl || ''); // <-- cover
      setPreviewUrl(null);
      setImageFile(null);
      setRemoveCover(false);

      const transformedQuestions: QuestionData[] = (serverQuiz.questions || []).map((q, index) => ({
        id: `q_${index + 1}`,
        questionNumber: q.questionNumber ?? index + 1,
        title: q.title,
        questionType: q.questionType,
        questionImage: q.questionImage || null,
        choicesConfig: q.choicesConfig || {
          isMultipleAnswer: false,
          isAnswerWithImageEnabled: false,
        },
        options: q.options || [],
        correctAnswerIds: q.correctAnswerIds || [],
        points: q.points || '01',
        isRequired: q.isRequired ?? true,
      }));

      if (transformedQuestions.length > 0) {
        setQuestionsList(transformedQuestions);
        setSelectedQuestionId(transformedQuestions[0]?.id || null);
      } else {
        const defaultQuestion = defaultFirstQuestion();
        setQuestionsList([defaultQuestion]);
        setSelectedQuestionId(defaultQuestion.id);

        if (serverQuiz._id) {
          addQuestion({
            id: serverQuiz._id,
            question: defaultQuestion,
          })
            .unwrap()
            .catch(err => {
              console.error('❌ Failed to save default question:', err);
            });
        }
      }

      setCurrentQuizIdInternal(serverQuiz._id ?? null);
      setCurrentQuizCreatedAt(serverQuiz.createdAt || undefined);
      setHasInitialized(true);
    } else if (isError) {
      toast({
        title: 'Error',
        description: 'Quiz not found. Redirecting...',
        variant: 'destructive',
      });
      router.push('/instructor/quizzes');
    }
  }, [fetchedQuiz, isError, defaultFirstQuestion, addQuestion, toast, router]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);

  // ====== IMAGE VALIDATION ======
  const validateImage = useCallback(async (file: File): Promise<{ ok: true } | { ok: false; message: string }> => {
    const mimeOk = file.type.startsWith('image/');
    if (!mimeOk) return { ok: false, message: 'Only image files are allowed (JPEG, PNG, WEBP, ...).' };

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_IMAGE_MB) return { ok: false, message: `Maximum size is ${MAX_IMAGE_MB}MB.` };

    const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.width, h: img.height });
      img.onerror = () => reject(new Error('load image error'));
      img.src = URL.createObjectURL(file);
    }).catch(() => null as any);

    if (!dims) return { ok: false, message: 'Unable to read image dimensions.' };
    if (dims.w < MIN_W || dims.h < MIN_H) {
      return { ok: false, message: `Image is too small. Minimum ${MIN_W}×${MIN_H}px (approx 16:9).` };
    }

    return { ok: true };
  }, []);


  const onPickImage = useCallback(
    async (file?: File | null) => {
      if (!file) return;
      const valid = await validateImage(file);
      if (!valid.ok) {
        toast({ title: 'Invalid image', description: valid.message, variant: 'destructive' });
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveCover(false);
    },
    [validateImage, toast]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onPickImage(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    onPickImage(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleRemoveCover = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (coverUrl) setRemoveCover(true); // đánh dấu xóa trên server
  };

  // ====== ADD QUESTION ======
  const handleAddQuestion = useCallback(async () => {
    const newQuestionNumber =
      questionsList.length > 0 ? Math.max(...questionsList.map(q => q.questionNumber)) + 1 : 1;

    const timestamp = Date.now();
    const localId = `q_${timestamp}_${newQuestionNumber}`;

    const newQuestion: QuestionData = {
      id: localId,
      questionNumber: newQuestionNumber,
      title: `New Question ${newQuestionNumber}`,
      questionType: 'single-choice',
      questionImage: null,
      choicesConfig: {
        isMultipleAnswer: false,
        isAnswerWithImageEnabled: false,
      },
      options: [
        { id: `opt_${timestamp}_1`, text: 'Option A' },
        { id: `opt_${timestamp}_2`, text: 'Option B' },
      ],
      correctAnswerIds: [],
      points: '01',
      isRequired: true,
    };

    if (currentQuizIdInternal) {
      try {
        const res = await addQuestion({
          id: currentQuizIdInternal,
          question: newQuestion,
        }).unwrap();

        if (res?.question) {
          const merged = { ...res.question, id: localId };
          setQuestionsList(prev => [...prev, merged]);
          setSelectedQuestionId(localId);
        } else {
          setQuestionsList(prev => [...prev, newQuestion]);
          setSelectedQuestionId(localId);
        }
      } catch (err) {
        console.error('Failed to add question:', err);
        toast({ title: 'Error', description: 'Failed to add question', variant: 'destructive' });
      }
    } else {
      setQuestionsList(prev => [...prev, newQuestion]);
      setSelectedQuestionId(localId);
    }

    if (!isSidebarOpen && typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, [currentQuizIdInternal, isSidebarOpen, questionsList, addQuestion, toast]);

  // ====== ADD FROM AI (with modal inputs) ======
  const handleGenerateFromAI = useCallback(
    async (details: {
      examTitle: string;
      difficultyLevel: 'Easy' | 'Medium' | 'Hard';
      topic: string;
      documentFile?: File | null;
      totalCount: number;
      questionType: AIQuestionType;
    }) => {
      try {
        if (!currentQuizIdInternal) {
          toast({ title: 'No quiz', description: 'Please create or open a quiz first.', variant: 'destructive' });
          return;
        }
        setAiBusy(true);

        const fd = new FormData();
        fd.append('mode', 'quiz');
        fd.append('difficultyLevel', details.difficultyLevel);
        const exTitle = details.examTitle || quizName || '';
        const theTopic = details.topic || quizCategory || '';
        if (exTitle) fd.append('examTitle', exTitle);
        if (theTopic) fd.append('topic', theTopic);
        if (details.documentFile) fd.append('file', details.documentFile);
        fd.append('questionConfigs', JSON.stringify([{ type: details.questionType, count: details.totalCount }]));

        const resp = await fetch('/api/ai/summarize', { method: 'POST', body: fd });
        if (!resp.ok) {
          const msg = await resp.text();
          throw new Error(msg || 'AI request failed');
        }
        const data = await resp.json();
        const aiQuestions: any[] = Array.isArray(data?.questions) ? data.questions : [];
        if (aiQuestions.length === 0) {
          toast({ title: 'AI', description: 'No questions returned from AI.', variant: 'destructive' });
          return;
        }

        const startNumber = questionsList.length > 0
          ? Math.max(...questionsList.map(q => q.questionNumber)) + 1
          : 1;

        for (let i = 0; i < aiQuestions.length; i++) {
          const q = aiQuestions[i];
          const number = startNumber + i;
          const localId = `q_${Date.now()}_${number}`;

          const normalized: QuestionData = {
            id: localId,
            questionNumber: number,
            title: String(q.title || `Question ${number}`),
            questionType: (details.questionType as any) || q.questionType || 'multiple-choice',
            questionImage: null,
            choicesConfig: {
              isMultipleAnswer: ((details.questionType as any) || q.questionType) === 'multiple-choice',
              isAnswerWithImageEnabled: false,
            },
            options: Array.isArray(q.options)
              ? q.options.map((o: any, idx: number) => ({ id: String(o?.id ?? o?._id ?? idx + 1), text: String(o?.text ?? '') }))
              : [],
            correctAnswerIds: Array.isArray(q.correctAnswerIds) ? q.correctAnswerIds.map(String) : [],
            points: String(q.points ?? '01'),
            isRequired: true,
          };

          try {
            const res = await addQuestion({ id: currentQuizIdInternal, question: normalized }).unwrap();
            const merged = (res?.question ? { ...res.question, id: localId } : normalized) as QuestionData;
            setQuestionsList(prev => [...prev, merged]);
            setSelectedQuestionId(localId);
          } catch (e) {
            console.error('Add AI question failed', e);
          }
        }

        if (!isSidebarOpen && typeof window !== 'undefined' && window.innerWidth >= 1024) {
          setIsSidebarOpen(true);
        }

        toast({ title: 'AI', description: 'Added AI-generated questions.', variant: 'success' });
      } catch (e: any) {
        toast({ title: 'AI Error', description: e?.message || 'Failed to add from AI', variant: 'destructive' });
      } finally {
        setAiBusy(false);
        setAiModalOpen(false);
      }
    }, [addQuestion, currentQuizIdInternal, isSidebarOpen, questionsList, quizCategory, quizName, toast]
  );
  // ====== UPDATE QUESTION ======
  const handleQuestionDataUpdateFromEditor = useCallback(
    async (updatedData: QuestionData) => {
      setQuestionsList(prev => prev.map(q => (q.id === updatedData.id ? updatedData : q)));

      if (!hasInitialized || !updatedData.questionNumber) return;

      if (currentQuizIdInternal && updatedData.questionNumber) {
        try {
          await updateQuestion({
            id: currentQuizIdInternal,
            questionNumber: updatedData.questionNumber,
            question: updatedData,
          }).unwrap();
        } catch (err) {
          console.error('Failed to update question:', err);
          toast({ title: 'Error', description: 'Failed to update question', variant: 'destructive' });
        }
      }
    },
    [currentQuizIdInternal, hasInitialized, updateQuestion, toast]
  );

  // ====== DELETE QUESTION ======
  const handleDeleteQuestion = async (questionId: string) => {
    if (!currentQuizIdInternal || !questionId) return;
    const targetQuestion = questionsList.find(q => q.id === questionId);
    if (!targetQuestion) return;

    try {
      const res = await deleteQuestion({ id: currentQuizIdInternal, questionNumber: targetQuestion.questionNumber }).unwrap();

      if (res.success) {
        const remaining = questionsList.filter(q => q.id !== questionId);
        setQuestionsList(remaining);
        setSelectedQuestionId(remaining.length > 0 ? remaining[0].id : null);

        await updateQuiz({
          id: currentQuizIdInternal,
          quiz: {
            name: quizName.trim(),
            questions: remaining,
            duration: String(quizDuration),
            category: quizCategory.trim() || undefined,
            passingScore: Number(passingScore),
          },
        }).unwrap();

        toast({ title: 'Question deleted', description: 'The question was removed and saved successfully.', variant: 'success' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err?.data?.message || 'Could not delete question.', variant: 'destructive' });
    }
  };

  // ====== SAVE QUIZ ======
  const handleSaveQuiz = async () => {
    // base validations
    if (!quizName.trim()) {
      toast({ title: 'Validation Error', description: 'Quiz name cannot be empty.', variant: 'destructive' });
      return;
    }
    if (questionsList.length === 0) {
      toast({ title: 'Validation Error', description: 'Please add at least one question.', variant: 'destructive' });
      return;
    }
    if (!Number.isFinite(Number(quizDuration)) || Number(quizDuration) <= 0) {
      toast({ title: 'Validation Error', description: 'Duration must be a positive number.', variant: 'destructive' });
      return;
    }
    if (!Number.isFinite(Number(passingScore)) || Number(passingScore) < 0 || Number(passingScore) > 100) {
      toast({ title: 'Validation Error', description: 'Passing score must be between 0 and 100.', variant: 'destructive' });
      return;
    }

    try {
      // Nếu có ảnh mới hoặc yêu cầu xóa -> dùng multipart để đồng bộ mọi field + ảnh
      if ((imageFile || removeCover) && currentQuizIdInternal) {
        setIsUploadingImage(true);
        const form = new FormData();
        form.append('name', quizName.trim());
        form.append('duration', String(quizDuration));
        form.append('passingScore', String(Number(passingScore)));
        if (quizCategory.trim()) form.append('category', quizCategory.trim());
        form.append('questions', JSON.stringify(questionsList)); // giữ đồng bộ server
        if (removeCover) form.append('removeImage', 'true');
        if (imageFile) form.append('image', imageFile);

        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/quizzes/${currentQuizIdInternal}`,
          form,
          { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
        );

        const newUrl = res?.data?.quiz?.imageUrl || '';
        setCoverUrl(newUrl);
        setPreviewUrl(null);
        setImageFile(null);
        setRemoveCover(false);
        setIsUploadingImage(false);

        toast({ title: 'Success!', description: `Quiz "${quizName}" updated successfully.`, variant: 'success' });
        router.push('/instructor/quizzes');
        return;
      }

      // Không động vào ảnh -> dùng mutation cũ (JSON)
      await updateQuiz({
        id: currentQuizIdInternal!,
        quiz: {
          name: quizName.trim(),
          questions: questionsList,
          duration: String(quizDuration),
          passingScore: Number(passingScore),
          category: quizCategory.trim() || undefined,
        },
      }).unwrap();

      toast({ title: 'Success!', description: `Quiz "${quizName}" updated successfully.`, variant: 'success' });
      router.push('/instructor/quizzes');
    } catch (error: any) {
      setIsUploadingImage(false);
      toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to update quiz.', variant: 'destructive' });
    }
  };

  // ====== MEMO ======
  const questionSummaries: QuestionSummary[] = useMemo(
    () =>
      questionsList.map(q => ({
        id: q.id,
        number: q.questionNumber,
        textPreview: q.title.substring(0, 40) + (q.title.length > 40 ? '...' : ''),
        type: q.questionType,
        typeIcon: getIconForQuestionType(q.questionType),
      })),
    [questionsList]
  );

  const activeQuestionData = useMemo(
    () => questionsList.find(q => q.id === selectedQuestionId),
    [questionsList, selectedQuestionId]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-blue-500 rounded-full mb-4"></div>
          <p className="text-lg text-gray-600">Loading quiz data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col rounded-xl">
      <QuizBuilderHeader title={quizName} onSaveQuiz={handleSaveQuiz} isEditing={!!currentQuizIdInternal}
      // onCreateWithAI={() => setAiModalOpen(true)
      />

      {/* Quiz Settings Section */}
      <div className="p-6 space-y-6 max-w-screen w-full">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* === COVER IMAGE (tham khảo UI upload thumbnail của Course) === */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Cover</label>

              {/* Dropzone */}
              <div
                onDragOver={onDragOver}
                onDrop={onDrop}
                className="relative group rounded-lg border border-dashed border-gray-300 hover:border-blue-400 transition-colors bg-gray-50"
              >
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : coverUrl ? (
                    <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16l5-5 4 4 5-6 4 5" />
                      </svg>
                      <p className="text-sm">Drag & drop an image here</p>
                      <p className="text-xs text-gray-400">or click to select</p>
                    </div>
                  )}
                </div>

                {/* Overlay actions */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/30 flex items-center justify-center gap-3">
                  <label htmlFor="coverInput" className="px-3 py-2 bg-white text-gray-700 rounded-md text-sm cursor-pointer shadow-sm hover:bg-gray-100">
                    Choose image
                  </label>
                  {(previewUrl || coverUrl) && (
                    <button
                      type="button"
                      onClick={handleRemoveCover}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-md text-sm shadow-sm hover:bg-red-100"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  id="coverInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onInputChange}
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                PNG/JPG/WebP, ≤ {MAX_IMAGE_MB}MB, minimum {MIN_W}×{MIN_H}px (16:9 recommended) for best results.
              </p>
              {isUploadingImage && (
                <p className="mt-1 text-xs text-blue-600">Uploading image…</p>
              )}
            </div>

            {/* === BASIC FIELDS === */}
            <div className="md:col-span-3 space-y-4">
              <div>
                <label htmlFor="quizNameInput" className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Name
                </label>
                <input
                  type="text"
                  id="quizNameInput"
                  value={quizName}
                  onChange={e => setQuizName(e.target.value)}
                  placeholder="Enter quiz name"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Duration */}
                <div>
                  <label htmlFor="quizDuration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="quizDuration"
                      value={Number.isNaN(Number(quizDuration)) ? '' : quizDuration}
                      onChange={e => setQuizDuration(e.target.value)}
                      min={1}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <div className="absolute right-3 top-3 text-gray-400">min</div>
                  </div>
                </div>

                {/* Passing Score */}
                <div>
                  <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="passingScore"
                      value={Number.isFinite(passingScore) ? passingScore : 0}
                      onChange={e => setPassingScore(e.currentTarget.valueAsNumber || 0)}
                      min={0}
                      max={100}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <div className="absolute right-3 top-3 text-gray-400">point</div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="quizCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    id="quizCategory"
                    value={quizCategory}
                    onChange={e => setQuizCategory(e.target.value)}
                    placeholder="e.g. JavaScript, React, SQL…"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentQuizCreatedAt && (
          <div className="mt-2 text-xs text-gray-500">
            Created at: {new Date(currentQuizCreatedAt).toLocaleString()}
          </div>
        )}
      </div>

      {/* Questions Section */}
      <div className="flex flex-grow pt-4 px-6 gap-6">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="lg:hidden fixed top-32 left-4 z-40 p-2 bg-white rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <QuestionListSidebar
          questions={questionSummaries}
          selectedQuestionId={selectedQuestionId}
          activeQuestionNumber={activeQuestionData?.questionNumber}
          onSelectQuestion={setSelectedQuestionId}
          onAddQuestion={handleAddQuestion}
        />

        <main className="flex-grow overflow-y-auto transition-all duration-300 ease-in-out bg-white rounded-xl shadow-sm">
          <div className="h-full p-6">
            {activeQuestionData ? (
              <InstructorQuestionEditor
                key={selectedQuestionId || 'editor'}
                questionToLoad={activeQuestionData}
                onQuestionDataChange={handleQuestionDataUpdateFromEditor}
                onDeleteQuestion={handleDeleteQuestion}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-250px)] text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-500 mb-1">
                  {questionsList && questionsList.length > 0 ? 'Select a question to edit' : 'No questions yet'}
                </h3>
                <p className="text-sm text-gray-400">
                  {questionsList && questionsList.length > 0
                    ? 'Or click the "+" button to add a new one'
                    : 'Click the "+" button to add your first question'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
      {aiModalOpen && (
        <CreateWithAIModal
          open={aiModalOpen}
          onClose={() => setAiModalOpen(false)}
          onConfirm={handleGenerateFromAI}
        // isBusy={aiBusy}
        />
      )}
    </div>
  );
};

export default QuizBuilderPage;