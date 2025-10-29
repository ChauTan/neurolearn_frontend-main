'use client';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/apiSlice';
import authSlice from './features/auth/authSlice';
import { courseApi } from './features/course/courseApi';
import courseReducer from './features/course/courseSlice';
import { expertApi } from './features/expert/expertApi';
import { bankApi } from './features/bank/bankApi';
import chatReducer from './features/chat/chatSlice';
import { quizApi } from './features/quiz/quizApi';
import { categoryApi } from './features/course/category/categoryApi';
import { levelApi } from './features/course/level/levelApi';
import { sectionApi } from './features/course/section/sectionApi';
import { lessonApi } from './features/course/section/lesson/lessonApi';
import { requestApi } from './features/request/requestApi';
// import orderSlice from './features/order/orderSlice';

// Create an array of all API middlewares

// const apiMiddlewares = [
//   apiSlice.middleware,
//   courseApi.middleware,
//   expertApi.middleware,
//   bankApi.middleware
// ];

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [expertApi.reducerPath]: expertApi.reducer,
    [bankApi.reducerPath]: bankApi.reducer,
    [sectionApi.reducerPath]: sectionApi.reducer,
    [lessonApi.reducerPath]: lessonApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [levelApi.reducerPath]: levelApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    [requestApi.reducerPath]: requestApi.reducer,

    auth: authSlice,
    course: courseReducer,
    chat: chatReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      courseApi.middleware,
      expertApi.middleware,
      bankApi.middleware,
      sectionApi.middleware,
      lessonApi.middleware,
      categoryApi.middleware,
      levelApi.middleware,
      quizApi.middleware,
      requestApi.middleware,
    ),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
