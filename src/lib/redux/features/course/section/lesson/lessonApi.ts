import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Lesson {
    _id: string;
    title: string;
    description?: string;
    videoUrl?: {
        public_id: string;
        url: string;
    };
    videoLength?: number;
    isFree?: boolean;
    sectionId: string;
    courseId: string;
    order: number;
    isPublished?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface LessonDetail extends Lesson { }

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

interface RootState {
    auth?: {
        token?: string;
    };
}

export const lessonApi = createApi({
  reducerPath: 'lessonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Lesson', 'Section', 'Course'],
  endpoints: builder => ({
    getAllLessons: builder.query<ApiResponse<Lesson[]>, string>({
      query: sectionId => `/lessons/section/${sectionId}`,
      providesTags: ['Lesson'],
    }),
    getLessonDetail: builder.query<ApiResponse<LessonDetail>, string>({
      query: lessonId => `/lessons/detail/${lessonId}`,
      providesTags: (result, error, id) => [{ type: 'Lesson', id }],
    }),

    createLesson: builder.mutation<
      ApiResponse<Lesson>,
      { courseId: string; sectionId: string; data: Partial<Lesson> }
    >({
      query: ({ courseId, sectionId, data }) => ({
        url: `/lessons/create/${courseId}/${sectionId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { courseId, sectionId }) => [
        { type: 'Lesson', id: 'LIST' },
        { type: 'Section', id: sectionId },
        { type: 'Course', id: courseId },
      ],
    }),

    updateLesson: builder.mutation<
      ApiResponse<Lesson>,
      { lessonId: string; data: Partial<Lesson> }
    >({
      query: ({ lessonId, data }) => ({
        url: `/lessons/update/${lessonId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { lessonId }) => [
        { type: 'Lesson', id: lessonId },
        { type: 'Lesson', id: 'LIST' },
      ],
    }),
    deleteLesson: builder.mutation<ApiResponse<void>, string>({
      query: lessonId => ({
        url: `/lessons/delete/${lessonId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lesson'],
    }),
    reorderLesson: builder.mutation<
      ApiResponse<null>,
      { sectionId: string; orderUpdates: { id: string; order: number }[] }
    >({
      query: ({ sectionId, orderUpdates }) => ({
        url: `/lessons/reorder/${sectionId}`,
        method: 'PUT',
        body: { orderUpdates },
      }),
      invalidatesTags: ['Lesson'],
    }),
    publishLesson: builder.mutation<ApiResponse<Lesson>, string>({
      query: lessonId => ({
        url: `/lessons/publish/${lessonId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Lesson', id }],
    }),
    unpublishLesson: builder.mutation<ApiResponse<Lesson>, string>({
      query: lessonId => ({
        url: `/lessons/unpublish/${lessonId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Lesson', id }],
    }),
    uploadLessonVideo: builder.mutation<ApiResponse<Lesson>, { lessonId: string; file: File }>({
      query: ({ lessonId, file }) => {
        const formData = new FormData();
        formData.append('video', file);
        formData.append('lessonId', lessonId);

        return {
          url: `/lessons/upload-lesson-video`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { lessonId }) => [{ type: 'Lesson', id: lessonId }],
    }),
  }),
});

export const {
    useGetAllLessonsQuery,
    useGetLessonDetailQuery,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useReorderLessonMutation,
    usePublishLessonMutation,
    useUnpublishLessonMutation,
    useUploadLessonVideoMutation,
} = lessonApi;
