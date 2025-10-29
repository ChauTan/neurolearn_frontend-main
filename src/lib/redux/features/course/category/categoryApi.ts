import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Category {
    _id: string;
    title: string;
    subCategories?: SubCategory[];
}

export interface SubCategory {
    _id: string;
    title: string;
    categoryId?: string;
}

interface ApiResponse<T> {
    success: boolean;
    categories?: T;
    message?: string;
}

interface RootState {
    auth?: {
        token?: string;
    };
}

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
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
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query<ApiResponse<Category[]>, void>({
            query: () => '/categories',
            providesTags: ['Category'],
        }),
        getAllCategoriesWithSubcategories: builder.query<ApiResponse<Category[]>, void>({
            query: () => '/categories/all-with-subcategories',
            providesTags: ['Category'],
        }),
        getCategory: builder.query<ApiResponse<Category>, string>({
            query: (id) => `/categories/${id}`,
            providesTags: (result, error, id) => [{ type: 'Category', id }],
        }),
        getSubCategoriesByCategoryId: builder.query<ApiResponse<SubCategory[]>, string>({
            query: (id) => `/categories/sub-category/${id}`,
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation<ApiResponse<Category>, { title: string }>({
            query: (body) => ({
                url: '/categories',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Category'],
        }),
        createSubCategory: builder.mutation<ApiResponse<SubCategory>, { id: string; title: string }>({
            query: ({ id, title }) => ({
                url: `/categories/${id}/sub-category`,
                method: 'POST',
                body: { title },
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetAllCategoriesWithSubcategoriesQuery,
    useGetCategoryQuery,
    useGetSubCategoriesByCategoryIdQuery,
    useCreateCategoryMutation,
    useCreateSubCategoryMutation,
} = categoryApi;
