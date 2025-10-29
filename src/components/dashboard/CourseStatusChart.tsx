'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Completed', value: 55, color: '#000000' },
  { name: 'Learning', value: 35, color: '#00CE9C' },
  { name: 'Pending', value: 10, color: '#FF7410' },
];

const CourseStatusChart = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-2xl p-6 h-[500px]">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-black mb-6">Course Status</h3>

        {/* Donut Chart */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-semibold text-black">100%</span>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-black text-base font-medium">{item.name}</span>
              <span className="text-gray-600 text-base">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${(item.value / total) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseStatusChart;
