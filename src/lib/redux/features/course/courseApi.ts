import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Course } from '@/types/course';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  courses?: T;
  message?: string;
}

interface RootState {
  auth?: {
    token?: string;
  };
}

interface PaginatedCourses {
  page: number;
  totalCourses: number;
  totalPages: number;
  limit: number;
  courses: Course[];
}

interface ReviewStats {
  average: number;
  total: number;
  stats: { star: number; percent: number }[];
}

interface StudentStats {
  name: string;
  view: number;
  buy: number;
}

interface CourseStats {
  totalCourses: number;
  pendingCourses: number;
  coursesSold: number;
  publishedCourses: number;
}

interface LatestCourse {
  _id: string;
  name: string;
  thumbnail: string;
  status: 'draft' | 'pending' | 'published';
  stepsCompleted: number;
  stepsTotal: number;
}

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URI}`,
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
    getCourses: builder.query<ApiResponse<Course[]>, void>({
      query: () => '/courses',
      providesTags: ['Course'],
    }),
    getCourseById: builder.query<ApiResponse<Course>, string>({
      query: id => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    getCourseByDetail: builder.query<ApiResponse<Course>, string>({
      query: id => `/courses/course/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    getTopCourses: builder.query<ApiResponse<{ courses: Course[] }>, void>({
      query: () => '/courses/top-courses',
      providesTags: ['Course'],
    }),
    getTopViewing: builder.query<ApiResponse<{ courses: Course[] }>, void>({
      query: () => '/courses/top-courses-viewing',
      providesTags: ['Course'],
    }),
    getReviewCourseById: builder.query<ApiResponse<Course>, string>({
      query: id => `/courses/review/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    getUserCourses: builder.query<ApiResponse<Course[]>, void>({
      query: () => '/courses/user-courses',
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(course => ({ type: 'Course' as const, id: course._id })),
              { type: 'Course' },
            ]
          : [{ type: 'Course' }],
      transformResponse: (response: { success: boolean; data: Course[] }) => {
        return {
          success: response.success,
          data: response.data,
        };
      },
    }),

    createCourse: builder.mutation<ApiResponse<Course>, Partial<Course>>({
      query: course => ({
        url: '/courses/create-course',
        method: 'POST',
        body: course,
      }),
      invalidatesTags: result => {
        const baseTags = result?.data?._id
          ? [{ type: 'Course' as const }, { type: 'Course' as const, id: result.data._id }]
          : [{ type: 'Course' as const }];

        // Gộp thêm tag LatestCourse theo publisherId nếu có
        const latestTag = result?.data?.publisher?._id
          ? [{ type: 'Course' as const, id: `LATEST-${result.data.publisher._id}` }]
          : [];

        return [...baseTags, ...latestTag];
      },
    }),
    updateCourse: builder.mutation<ApiResponse<Course>, { id: string; course: Partial<Course> }>({
      query: ({ id, course }) => ({
        url: `/courses/update-course/${id}`,
        method: 'PUT',
        body: course,
      }),
      invalidatesTags: (result, error, { id }) => {
        const baseTags = [{ type: 'Course' as const, id }, { type: 'Course' as const }];

        const latestTag = result?.data?.publisher?._id
          ? [{ type: 'Course' as const, id: `LATEST-${result.data.publisher._id}` }]
          : [];

        return [...baseTags, ...latestTag];
      },
    }),
    deleteCourse: builder.mutation<ApiResponse<void>, string>({
      query: id => ({
        url: `/courses/delete-course/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),
    searchCourses: builder.query<
      ApiResponse<Course[]>,
      { search: string; category?: string; level?: string }
    >({
      query: ({ search, category, level }) => ({
        url: '/courses/search',
        method: 'GET',
        params: { search, category, level },
      }),
      providesTags: ['Course'],
    }),
    getCoursesPaginated: builder.query<
      PaginatedCourses,
      {
        page?: number;
        limit?: number;
        category?: string;
        level?: string;
        subCategory?: string;
        price?: 'Free' | 'Paid';
        rating?: number;
        language?: string;
        authorId?: string;
        search?: string;
      }
    >({
      query: params => ({
        url: '/courses/pagination',
        method: 'GET',
        params,
      }),

      transformResponse: (response: PaginatedCourses & { success: boolean }) => {
        return {
          page: response.page,
          limit: response.limit,
          totalCourses: response.totalCourses,
          totalPages: response.totalPages,
          courses: response.courses,
        };
      },

      serializeQueryArgs: ({ queryArgs }) => {
        const {
          page = 1,
          limit = 12,
          category = '',
          level = '',
          price = '',
          rating = '',
          subCategory = '',
          language = '',
          authorId = '',
          search = '',
        } = queryArgs;

        return `courses-${page}-${limit}-${category}-${level}-${price}-${rating}-${subCategory}-${language}-${authorId}-${search}`;
      },

      keepUnusedDataFor: 60,
      providesTags: ['Course'],
    }),
    getInstructorReviewStats: builder.query<ReviewStats, string>({
      query: id => `/courses/course/${id}/reviews`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
      transformResponse: (response: ReviewStats & { success?: boolean }) => {
        // Nếu API trả thêm success, bỏ qua nó và chỉ return stats
        return {
          average: response.average,
          total: response.total,
          stats: response.stats,
        };
      },
    }),
    getStudentStats: builder.query<{ stats: StudentStats[] }, string>({
      query: instructorId => `/courses/course/${instructorId}/stats`,
    }),
    getCourseStats: builder.query<CourseStats, string>({
      query: instructorId => `/courses/course/${instructorId}/course-stats`,
    }),
    getLatestCourse: builder.query<{ course: LatestCourse | null }, string>({
      query: instructorId => `/courses/course/${instructorId}/latest-course`,
      providesTags: (result, error, instructorId) => [
        { type: 'Course', id: `LATEST-${instructorId}` },
      ],
    }),
    publishCourse: builder.mutation<ApiResponse<Course>, string>({
      query: id => ({
        url: `/courses/publish-course/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Course', id }, { type: 'Course' }],
    }),
    unpublishCourse: builder.mutation<ApiResponse<Course>, string>({
      query: id => ({
        url: `/courses/unpublish-course/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Course', id }, { type: 'Course' }],
    }),
    getAllPurchasedCourses: builder.query<ApiResponse<Course[]>, void>({
      query: () => '/courses/purchased/my-course',
      providesTags: ['Course'],
      transformResponse: (response: ApiResponse<Course[]>) => {
        console.log('Purchased courses response:', response);

        return {
          success: response.success,
          data: response.data,
        };
      },
    }),
    getAllAssignedCourses: builder.query<ApiResponse<Course[]>, void>({
      query: () => '/courses/assigned/my-course',
      providesTags: ['Course'],
      transformResponse: (response: ApiResponse<Course[]>) => {
        console.log('Assigned courses response:', response);

        return {
          success: response.success,
          data: response.data,
        };
      },
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetCourseByDetailQuery,
  useGetReviewCourseByIdQuery,
  useGetTopCoursesQuery,
  useGetTopViewingQuery,
  useGetUserCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useSearchCoursesQuery,
  useGetCoursesPaginatedQuery,
  useGetInstructorReviewStatsQuery,
  useGetStudentStatsQuery,
  useGetCourseStatsQuery,
  useGetLatestCourseQuery,
  usePublishCourseMutation,
  useUnpublishCourseMutation,
  useGetAllPurchasedCoursesQuery,
  useGetAllAssignedCoursesQuery,
} = courseApi;
