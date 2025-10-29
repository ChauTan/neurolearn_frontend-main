'use client';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetIncomeQuery } from '@/lib/redux/features/income/incomeApi';
import { skipToken } from '@reduxjs/toolkit/query';

import { TooltipProps } from 'recharts';

function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-white rounded-xl shadow-lg px-6 py-4">
        <div className="text-gray-500 font-semibold text-base flex items-center gap-2">
          Total Revenue
        </div>
        <div className="text-2xl font-bold text-black mt-1">
          {(value as number).toLocaleString('vi-VN')} VND
        </div>
      </div>
    );
  }
  return null;
}

export default function RevenueStatisticChart() {
  const [mode, setMode] = useState<'month' | 'year'>('month');

  const { user } = useSelector((state: any) => state.auth);

  // Luôn gọi hook, nhưng skip nếu chưa có userId
  const { data, isLoading } = useGetIncomeQuery(user?._id ?? skipToken);

  const chartData =
    mode === 'month' ? data?.monthlyChart || [] : data?.yearlyChart || [];

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-black">Revenue Statistics</h2>
        <div className="flex gap-2">
          <button
            className={`px-6 py-2 rounded-xl font-semibold text-base transition ${mode === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-gray-500'
              }`}
            onClick={() => setMode('month')}
          >
            Month
          </button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold text-base transition ${mode === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-gray-500'
              }`}
            onClick={() => setMode('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="w-full h-96 relative">
        {isLoading || !user?._id ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
          </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
