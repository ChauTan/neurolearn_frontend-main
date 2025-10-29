import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { User } from '@/types/user';
import { BusinessResponse } from '@/types/business';
import { DiscountResponse, Discount, CreateDiscountRequest, UpdateDiscountRequest } from '@/types/discount';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI || 'http://localhost:8000',
    credentials: 'include',
    prepareHeaders: headers => {
      // Don't manually set Authorization header for HttpOnly cookies
      // The browser will automatically send the cookie with credentials: 'include'
      return headers;
    },
  }),
  tagTypes: ['User', 'Income'],
  endpoints: builder => ({
    refreshToken: builder.query({
      query: () => ({
        url: 'users/refresh',
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: 'users/me',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['User'],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          // For session-based auth, just update the user info, do NOT overwrite token
          const user = result.data?.user;

          if (user) {
            // Don't try to get HttpOnly cookie, just update user info
            dispatch({
              type: 'auth/userLoggerIn',
              payload: {
                accessToken: 'session-based', // Keep session-based for HttpOnly cookies
                user: user,
              },
            });
          }
        } catch (error) {
          console.log('LoadUser error:', error);
        }
      },
    }),
    updateCurrentUserInfo: builder.mutation<{ user: User }, Partial<User>>({
      query: updatedData => ({
        url: 'users/update-user', // <<-- ĐẢM BẢO ĐÂY LÀ ĐÚNG ENDPOINT TRÊN BACKEND CỦA BẠN -->>
        method: 'PUT', // Hoặc PATCH tùy backend
        body: updatedData,
      }),
      // <<-- QUAN TRỌNG: INVALIDATE TAG 'User' SAU KHI CẬP NHẬT THÀNH CÔNG -->>
      invalidatesTags: ['User'],
    }),
    // <<-- THAY ĐỔI: THÊM MUTATION CẬP NHẬT AVATAR -->>
    updateUserAvatar: builder.mutation<{ user: User }, string>({
      // `string` ở đây là base64 image string
      query: avatarBase64 => ({
        url: 'users/update-avatar', // <<-- ĐẢM BẢO ĐÂY LÀ ĐÚNG ENDPOINT TRÊN BACKEND CỦA BẠN -->>
        method: 'PUT', // Hoặc POST tùy backend
        body: { avatar: avatarBase64 }, // Backend của bạn cần nhận trường `avatar`
      }),
      // <<-- QUAN TRỌNG: INVALIDATE TAG 'User' SAU KHI CẬP NHẬT THÀNH CÔNG -->>
      invalidatesTags: ['User'],
    }),
    // <<-- THAY ĐỔI: Thêm oldPassword vào payload -->>
    updatePassword: builder.mutation<any, { newPassword: string }>({
      query: data => ({
        url: 'users/update-password', // This should match your backend's password update API
        method: 'PUT',
        body: data,
      }),
      // No invalidatesTags: ['User'] here, as password change typically requires re-login
      // and user data might not change visually. The useEffect in SettingPage handles logout/redirect.
    }),
    getInstructors: builder.query<User[], void>({
      query: () => ({
        url: 'users/instructors',
        method: 'GET',
      }),
    }),
    getPendingRequests: builder.query<{ success: boolean; data: any[] }, { type: string; status?: string }>({
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
    }),
    handleRequest: builder.mutation<
      any,
      { type: string; requestId: string; action: 'approve' | 'reject' }
    >({
      query: ({ type, requestId, action }) => {
        let url = '';
        if (type === 'course_approval') url = `/request/handle-request-course/${requestId}`;
        else if (type === 'business_verification')
          url = `/request/handle-request-business/${requestId}`;
        else if (type === 'instructor_verification')
          url = `/request/instructor-verification/${requestId}/action`;
        return {
          url,
          method: 'PUT',
          body: { action },
        };
      },
    }),
    getAllBusinesses: builder.query<BusinessResponse, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search = '' }) => {
        let url = `/business/all?page=${page}&limit=${limit}`;
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        return {
          url,
          method: 'GET',
        };
      },
    }),
    // Discount APIs
    getAllDiscounts: builder.query<DiscountResponse, { 
      page?: number; 
      limit?: number; 
      search?: string;
      type?: string;
      accessType?: string;
      isActive?: boolean;
      businessId?: string;
    }>({
      query: ({ page = 1, limit = 10, search = '', type, accessType, isActive, businessId }) => {
        let url = `/discount?page=${page}&limit=${limit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (type) url += `&type=${type}`;
        if (accessType) url += `&accessType=${accessType}`;
        if (isActive !== undefined) url += `&isActive=${isActive}`;
        if (businessId) url += `&businessId=${businessId}`;
        return {
          url,
          method: 'GET',
        };
      },
    }),
    getDiscountById: builder.query<Discount, string>({
      query: (id) => ({
        url: `/discount/${id}`,
        method: 'GET',
      }),
    }),
    createDiscount: builder.mutation<Discount, CreateDiscountRequest>({
      query: (discountData) => ({
        url: '/discount',
        method: 'POST',
        body: discountData,
      }),
    }),
    updateDiscount: builder.mutation<Discount, UpdateDiscountRequest>({
      query: ({ id, ...discountData }) => ({
        url: `/discount/${id}`,
        method: 'PUT',
        body: discountData,
      }),
    }),
    deleteDiscount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/discount/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useRefreshTokenQuery,
  useLoadUserQuery,
  useGetInstructorsQuery,
  useUpdateCurrentUserInfoMutation, // <<-- THAY ĐỔI: EXPORT HOOK MỚI -->>
  useUpdateUserAvatarMutation, // <<-- THAY ĐỔI: EXPORT HOOK MỚI -->>
  useUpdatePasswordMutation,
  useGetPendingRequestsQuery,
  useHandleRequestMutation,
  useGetAllBusinessesQuery,
  // Discount hooks
  useGetAllDiscountsQuery,
  useGetDiscountByIdQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = apiSlice;
