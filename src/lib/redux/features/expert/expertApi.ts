import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from '@/types/user';

interface InstructorsResponse {
  success: boolean;
  instructors: User[];
}

export const expertApi = createApi({
  reducerPath: 'expertApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  }),
  endpoints: (builder) => ({
    getAllExperts: builder.query<User[], void>({
      query: () => 'users/get-instructors',
      transformResponse: (response: InstructorsResponse) => response.instructors,
    }),
    getExpertById: builder.query<User, string>({
      query: (id) => `users/instructors/${id}`,
    }),
  }),
});

export const {
  useGetAllExpertsQuery,
  useGetExpertByIdQuery,
} = expertApi; 