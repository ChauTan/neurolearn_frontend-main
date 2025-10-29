// redux/slices/quizSlice.ts
import { Quiz } from '@/app/(auth)/instructor/quizzes/_components/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  loading: boolean;
  error: string | null;
  filters: {
    courseId: string | null;
    difficulty: 'easy' | 'medium' | 'hard' | null;
  };
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  loading: false,
  error: null,
  filters: {
    courseId: null,
    difficulty: null,
  },
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload;
    },
    setCurrentQuiz: (state, action: PayloadAction<Quiz | null>) => {
      state.currentQuiz = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setQuizFilters: (state, action: PayloadAction<Partial<QuizState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearQuizFilters: state => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setQuizzes,
  setCurrentQuiz,
  setLoading,
  setError,
  setQuizFilters,
  clearQuizFilters,
} = quizSlice.actions;

export default quizSlice.reducer;
