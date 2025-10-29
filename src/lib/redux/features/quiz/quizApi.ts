// redux/api/quizApi.ts
import { QuestionData, Quiz } from '@/app/(auth)/instructor/quizzes/_components/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  quiz?: T;
  data?: T;
  quizzes?: T;
  question?: QuestionData;
  questions?: QuestionData[];
  score?: number;
  isPassed?: boolean;
  name?: string;
  id?: string;
}

export type SubmitQuizPayload = {
  answers: { questionId: string; selectedOptionIds: string[] }[];
  timeTakenSeconds?: number;
  meta?: Record<string, unknown>;
};

export type SubmitQuizResult = {
  totalQuestions: number;
  attemptedQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
  skippedQuestions: number;
  totalScore: number;
  maxPossibleScore: number;
  overallStatus: 'completed' | 'time-out';
  // tuỳ BE có hay không:
  isPassed?: boolean;
  score?: number;
  breakdown?: Array<{
    questionNumber: number;
    questionId: string;
    status: 'correct' | 'incorrect' | 'skipped';
    pointsEarned: number;
    maxPoints: number;
    userSelectedOptionIds: string[];
    correctAnswerIds: string[];
  }>;
};

interface RootState {
  auth?: {
    token?: string;
  };
}

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URI}/quizzes`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Quiz'],
  endpoints: builder => ({
    getAllQuizzes: builder.query<ApiResponse<Quiz[]>, { courseId?: string; difficulty?: string }>({
      query: params => ({
        url: '',
        method: 'GET',
        params,
      }),
      providesTags: ['Quiz'],
    }),
    getQuizById: builder.query<ApiResponse<Quiz>, string>({
      query: id => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Quiz', id }],
    }),
    createQuiz: builder.mutation<ApiResponse<Quiz>, Partial<Quiz>>({
      query: quiz => ({
        url: '/',
        method: 'POST',
        body: quiz,
      }),
      invalidatesTags: ['Quiz'],
    }),
    updateQuiz: builder.mutation<ApiResponse<Quiz>, { id: string; quiz: Partial<Quiz> }>({
      query: ({ id, quiz }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: quiz,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Quiz', id }],
      async onQueryStarted({ id, quiz }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.quiz) {
            dispatch(
              quizApi.util.updateQueryData('getAllQuizzes', {}, draft => {
                const index = draft.quizzes?.findIndex(q => q._id === id);
                if (index !== undefined && index >= 0 && draft.quizzes) {
                  draft.quizzes[index] = {
                    ...draft.quizzes[index],
                    ...quiz,
                  };
                }
              })
            );
          }
        } catch {
          // Có thể log lỗi hoặc toast
        }
      },
    }),
    deleteQuiz: builder.mutation<ApiResponse<void>, string>({
      query: id => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Quiz'],
    }),
    addQuestion: builder.mutation<
      ApiResponse<QuestionData>,
      { id: string; question: QuestionData }
    >({
      query: ({ id, question }) => ({
        url: `/${id}/questions`,
        method: 'POST',
        body: question,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Quiz', id }],
    }),
    updateQuestion: builder.mutation<
      ApiResponse<QuestionData>,
      { id: string; questionNumber: number; question: QuestionData }
    >({
      query: ({ id, questionNumber, question }) => ({
        url: `/${id}/questions/${questionNumber}`,
        method: 'PUT',
        body: question,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Quiz', id }],
    }),
    deleteQuestion: builder.mutation<
      ApiResponse<QuestionData>,
      { id: string; questionNumber: number }
    >({
      query: ({ id, questionNumber }) => ({
        url: `/${id}/questions/${questionNumber}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Quiz', id }],
    }),
    reorderQuestions: builder.mutation<
      ApiResponse<QuestionData>,
      { id: string; newOrder: number[] }
    >({
      query: ({ id, newOrder }) => ({
        url: `/${id}/questions/reorder`,
        method: 'PUT',
        body: { newOrder },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Quiz', id }],
    }),
    submitQuiz: builder.mutation<
      ApiResponse<SubmitQuizResult>,
      { id: string; payload: SubmitQuizPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/${id}/submit`,
        method: 'POST',
        body: payload,
      }),
      // thường không cần invalidates, nhưng có thể invalidate chi tiết quiz (attempts…)
      invalidatesTags: (res, err, { id }) => [{ type: 'Quiz', id }],
    }),
  }),
});

export const {
  useGetAllQuizzesQuery,
  useGetQuizByIdQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useReorderQuestionsMutation,
  useSubmitQuizMutation,
} = quizApi;
