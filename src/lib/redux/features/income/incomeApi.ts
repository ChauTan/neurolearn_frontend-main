import { apiSlice } from '../api/apiSlice';

type ChartData = { name: string; revenue: number };

type IncomeResponse = {
  success: boolean;
  monthlyChart: ChartData[];
  yearlyChart: ChartData[];
};

type TotalIncomeResponse = {
  success: boolean;
  income: number;
  message?: string;
};

export const incomeApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getIncome: builder.query<IncomeResponse, string>({
      // userId là params
      query: userId => ({
        url: `income/${userId}/chart`,
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Income'],
    }),
    
    // Thêm endpoint mới để lấy total income
    getTotalIncome: builder.query<TotalIncomeResponse, void>({
      query: () => ({
        url: 'revenue/income/me',
        method: 'GET',
        credentials: 'include' as const,
      }),
      providesTags: ['Income'],
    }),
  }),
});

export const { useGetIncomeQuery, useGetTotalIncomeQuery } = incomeApi;
