import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// User interface for the request
interface RequestUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  purchasedCourses: string[];
  uploadedCourses: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  address?: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  introduce?: string;
  phoneNumber?: string;
  profession?: string;
  socialLinks?: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  assignedCourses: string[];
}

// Course interface for the request
interface RequestCourse {
  _id: string;
  name: string;
  subTitle: string;
  description: string;
  thumbnail: {
    public_id: string;
    url: string;
  };
  overview: string;
}

// Lesson interface
interface RequestLesson {
  _id: string;
  title: string;
  order: number;
  isPublished: boolean;
  videoUrl: {
    public_id: string;
    url: string;
  };
}

// Section interface
interface RequestSection {
  _id: string;
  title: string;
  order: number;
  isPublished: boolean;
  lessons: RequestLesson[];
}

// Detailed course data in the request
interface RequestCourseData {
  _id: string;
  name: string;
  subTitle: string;
  description: string;
  overview: string;
  level: string;
  category: string;
  price: number;
  estimatedPrice: number;
  thumbnail: {
    public_id: string;
    url: string;
  };
  duration: number;
  benefits: Array<{
    title: string;
    _id: string;
  }>;
  prerequisites: Array<{
    title: string;
    _id: string;
  }>;
  isFree: boolean;
  isDraft: boolean;
  isPublished: boolean;
}

// Meta information about the request
interface RequestMeta {
  summary: {
    sections: {
      old: number;
      newDraft: number;
      updatedPublished: number;
    };
    lessons: {
      old: number;
      newDraft: number;
    };
    hasDraftChanges: boolean;
  };
  sections: {
    old: string[];
    newDraft: string[];
    updatedPublished: string[];
  };
  lessons: {
    old: string[];
    newDraft: string[];
    bySection: {
      [sectionId: string]: {
        oldLessons: string[];
        newLessons: string[];
      };
    };
  };
}

// Request data containing course and sections
interface RequestData {
  course: RequestCourseData;
  sections: RequestSection[];
  meta: RequestMeta;
}

// Main course approval request interface
interface CourseApprovalRequest {
  _id: string;
  type: 'course_approval';
  courseId: RequestCourse;
  businessId: string | null;
  userId: RequestUser;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  processedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  data: RequestData;
}

export const requestApi = createApi({
  reducerPath: 'requestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    credentials: 'include',
    // Don't manually set Authorization header for HttpOnly cookies
    // The browser will automatically send the cookie with credentials: 'include'
  }),
  tagTypes: ['Request'],
  endpoints: builder => ({
    createCourseApprovalRequest: builder.mutation<
      ApiResponse<any>,
      {
        courseId: string;
        message?: string;
        courseSnapshot?: any;
        sectionsSnapshot?: any;
      }
    >({
      query: body => ({
        url: '/request/create-request-course',
        method: 'POST',
        body, // JSON
      }),
    }),
    getInstructorCourseRequests: builder.query<
      { success: boolean; total: number; data: CourseApprovalRequest[] },
      void
    >({
      query: () => '/request/instructor/course-requests',
      providesTags: ['Request'],
    }),
    updateCourseApprovalRequest: builder.mutation<
      ApiResponse<CourseApprovalRequest>,
      { requestId?: string; courseId: string; message?: string; status?: string }
    >({
      query: ({ requestId, courseId, message, status }) => ({
        url: '/request/update-course-approval-request',
        method: 'PUT',
        body: { requestId, courseId, message, status },
      }),
      invalidatesTags: ['Request'],
    }),
    // Add endpoint for getting pending requests with full data structure
    getPendingCourseRequests: builder.query<
      { success: boolean; data: CourseApprovalRequest[] },
      { type: string; status?: string }
    >({
      query: ({ type, status }) => {
        let url = `/request/get-request-pending?type=${type}`;
        if (status && status !== 'all') {
          url += `&status=${status}`;
        }
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: ['Request'],
    }),
  }),
});

export const {
  useCreateCourseApprovalRequestMutation,
  useGetInstructorCourseRequestsQuery,
  useUpdateCourseApprovalRequestMutation,
  useGetPendingCourseRequestsQuery,
} = requestApi;

// Export types for use in other components
export type {
  CourseApprovalRequest,
  RequestUser,
  RequestCourse,
  RequestLesson,
  RequestSection,
  RequestCourseData,
  RequestMeta,
  RequestData,
};
