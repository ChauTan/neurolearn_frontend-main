'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ArrowLeft, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Mon', value: 10 },
  { name: 'Tue', value: 25 },
  { name: 'Wed', value: 45 },
  { name: 'Thu', value: 75 },
  { name: 'Fri', value: 62 },
];

const LearningProgressChart = () => {
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week');

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-black">Learning Progress over time</h3>
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('week')}
            className={`px-3 py-2 rounded-lg text-lg font-medium transition-colors ${
              activeTab === 'week' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`px-3 py-2 rounded-lg text-lg font-medium transition-colors ${
              activeTab === 'month' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Chart Container */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9D9D9" />
              <XAxis
                dataKey="name"
                axisLine={true}
                tickLine={false}
                stroke="#D9D9D9"
                fontSize={16}
                fontWeight={500}
                tick={{ fill: '#000', fontSize: 16 }}
              />
              <YAxis
                axisLine={true}
                tickLine={false}
                stroke="#D9D9D9"
                fontSize={16}
                fontWeight={500}
                tick={{ fill: '#000', fontSize: 16 }}
                domain={[0, 100]}
                tickFormatter={value => `${value}%`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3858F8"
                strokeWidth={4}
                dot={{ fill: '#3858F8', strokeWidth: 0, r: 0 }}
                activeDot={{ r: 8, fill: '#3858F8', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Indicator */}
        <div className="absolute top-10 right-16">
          <div className="bg-white rounded-2xl p-3 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between gap-6 mb-2">
              <span className="text-gray-600 text-sm">Rating</span>
              <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
                <TrendingUp size={12} className="text-green-500" />
                <span className="text-green-500 text-xs font-medium">7%</span>
              </div>
            </div>
            <div className="text-2xl font-semibold text-blue-500">62%</div>
          </div>
        </div>

        {/* Highlighted Bar */}
        <div className="absolute bottom-16 left-80 w-20 h-64 bg-gradient-to-t from-blue-500/50 to-transparent rounded-t-xl pointer-events-none"></div>

        {/* Arrow Navigation */}
        <div className="absolute bottom-16 right-20">
          <button className="w-14 h-14 rounded-full border border-black flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
            <ArrowLeft size={24} className="text-blue-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningProgressChart;
