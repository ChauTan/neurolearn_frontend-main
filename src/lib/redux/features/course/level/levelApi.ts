import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Level {
    _id: string;
    name: string;
}

interface ApiResponse<T> {
    success: boolean;
    levels?: T;
    message?: string;
}

interface RootState {
    auth?: {
        token?: string;
    };
}

export const levelApi = createApi({
    reducerPath: 'levelApi',
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
    tagTypes: ['Level'],
    endpoints: (builder) => ({
        getLevels: builder.query<ApiResponse<Level[]>, void>({
            query: () => '/levels',
            providesTags: ['Level'],
        }),
        createLevel: builder.mutation<ApiResponse<Level>, { name: string }>({
            query: (body) => ({
                url: '/levels',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Level'],
        }),
    }),
});

export const {
    useGetLevelsQuery,
    useCreateLevelMutation,
} = levelApi;
