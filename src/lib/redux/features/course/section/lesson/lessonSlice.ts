import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lesson, LessonDetail } from './lessonApi';

interface LessonState {
    lessons: Lesson[];
    currentLesson: LessonDetail | null;
    loading: boolean;
    error: string | null;
}

const initialState: LessonState = {
    lessons: [],
    currentLesson: null,
    loading: false,
    error: null,
};

const lessonSlice = createSlice({
    name: 'lesson',
    initialState,
    reducers: {
        setLessons: (state, action: PayloadAction<Lesson[]>) => {
            state.lessons = action.payload;
        },
        setCurrentLesson: (state, action: PayloadAction<LessonDetail | null>) => {
            state.currentLesson = action.payload;
        },
        setLessonLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setLessonError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setLessons,
    setCurrentLesson,
    setLessonLoading,
    setLessonError,
} = lessonSlice.actions;

export default lessonSlice.reducer;
