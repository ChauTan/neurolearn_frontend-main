import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Section {
    _id: string;
    title: string;
    description?: string;
    courseId: string;
    order: number;
    isPublished?: boolean;
    lessons?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface SectionDetail extends Section {
    lessons?: any[];
}

export type ApiResponse<T> = {
  _id: string;
  success: boolean;
  data: T;
  message?: string;
  cached?: boolean;
};

export type SectionLean = {
  _id: string;
  courseId: string;
  order: number;
  title: string;
  description?: string;
  lessons: string[];
  quizzes: string[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type LessonPayload = {
  _id: string;
  sectionId: string;
  order: number;
  title: string;
  isPublished: boolean;
  isFree?: boolean;
  links: Array<{ title: string; url: string }>;
  questions: unknown[]; // sửa theo schema của bạn nếu có
  createdAt: string;
  updatedAt: string;
  __v?: number;
  videoUrl?: { public_id: string; url: string };
  description?: string;
};

export type QuizPayload = {
  _id: string;
  name: string;
  duration: string;
  totalQuestions?: number;
  order: number;
  isPublished: boolean;
  sectionId: string;
  // thêm trường khác nếu bạn trả full quiz
};
export type ItemLesson = {
  kind: 'lesson';
  _id: string;
  order: number;
  title: string;
  payload: LessonPayload;
};

export type ItemQuiz = {
  kind: 'quiz';
  _id: string;
  order: number;
  name: string;
  payload: QuizPayload;
};

export type SectionItem = ItemLesson | ItemQuiz;

export type SectionWithItems = SectionLean & {
  items: SectionItem[];
};

type ReorderSectionItem = { kind: 'lesson' | 'quiz'; id: string; order: number };
type RemoveItemBody = {
  sectionId: string;
  kind: 'lesson' | 'quiz';
  id: string;
  hardDelete?: boolean;
};

interface RootState {
  auth?: {
    token?: string;
  };
}

export const sectionApi = createApi({
  reducerPath: 'sectionApi',
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
  tagTypes: ['Section'],
  endpoints: builder => ({
    getAllSections: builder.query<ApiResponse<Section[]>, string>({
      query: courseId => `/sections/course/${courseId}`,
      providesTags: ['Section'],
    }),
    getSectionsByUserId: builder.query<ApiResponse<SectionWithItems[]>, void>({
      query: () => `/sections/user`,
      providesTags: ['Section'],
    }),
    getSectionDetail: builder.query<ApiResponse<SectionDetail>, string>({
      query: sectionId => `/sections/detail/${sectionId}`,
      providesTags: (result, error, id) => [{ type: 'Section', id }],
    }),
    createSection: builder.mutation<
      ApiResponse<Section>,
      { courseId: string; data: Partial<Section> }
    >({
      query: ({ courseId, data }) => ({
        url: `/sections/create/${courseId}`,
        method: 'POST',
        body: {
          title: data.title,
          description: data.description ?? '',
          isPublished: Boolean(data.isPublished), 
        },
      }),
      invalidatesTags: ['Section'],
    }),
    updateSection: builder.mutation<ApiResponse<Section>, { id: string; data: Partial<Section> }>({
      query: ({ id, data }) => ({
        url: `/sections/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Section', id }],
    }),
    deleteSection: builder.mutation<ApiResponse<void>, string>({
      query: sectionId => ({
        url: `/sections/delete/${sectionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Section'],
    }),
    reorderSections: builder.mutation<
      ApiResponse<null>,
      { sectionOrders: { sectionId: string; order: number }[] }
    >({
      query: body => ({
        url: '/sections/reorder',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Section'],
    }),
    publishSection: builder.mutation<ApiResponse<Section>, string>({
      query: sectionId => ({
        url: `/sections/publish/${sectionId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Section', id }],
    }),
    unpublishSection: builder.mutation<ApiResponse<Section>, string>({
      query: sectionId => ({
        url: `/sections/unpublish/${sectionId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Section', id }],
    }),
    addQuizToSection: builder.mutation<
      ApiResponse<any>,
      { sectionId: string; quizId: string; position?: number }
    >({
      query: ({ sectionId, ...body }) => ({
        url: `/sections/${sectionId}/add-quiz`,
        method: 'PATCH', // hoặc PUT theo server
        body,
      }),
      invalidatesTags: ['Section'],
    }),
    // Reorder mixed items (lesson + quiz) bên trong section — PATCH /sections/:id/reorder
    reorderSection: builder.mutation<
      ApiResponse<void>,
      { sectionId: string; items: ReorderSectionItem[] }
    >({
      query: ({ sectionId, items }) => ({
        url: `/sections/${sectionId}/reorder`,
        method: 'PATCH',
        body: { items },
      }),
      invalidatesTags: ['Section'],
    }),

    // Gỡ hoặc xoá item (lesson/quiz) khỏi section — PATCH /sections/:id/remove-item
    removeItemFromSection: builder.mutation<ApiResponse<void>, RemoveItemBody>({
      query: ({ sectionId, ...body }) => ({
        url: `/sections/${sectionId}/remove-item`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Section'],
    }),
  }),
});

export const {
  useGetAllSectionsQuery,
  useGetSectionsByUserIdQuery,
  useGetSectionDetailQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useReorderSectionsMutation,
  usePublishSectionMutation,
  useUnpublishSectionMutation,
  useAddQuizToSectionMutation,
  useReorderSectionMutation,
  useRemoveItemFromSectionMutation,
} = sectionApi;
