'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/common/ui/Button2'; // Cập nhật đúng path


export default function LearningProgressChart({employeeMonthlyData, managerMonthlyData}: { employeeMonthlyData: any[], managerMonthlyData: any[] }) {
  const [view, setView] = useState<'employee' | 'manager'>('employee');

  const data = view === 'employee' ? employeeMonthlyData : managerMonthlyData;

  return (
    <div className="rounded-xl bg-background p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground text-gray-900">
          Employees and Managers Chart
        </h2>

        <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
          <Button
            size="sm"
            variant={view === 'employee' ? 'secondary' : 'primary'}
            onClick={() => setView('employee')}
          >
            Employee
          </Button>
          <Button
            size="sm"
            variant={view === 'manager' ? 'secondary' : 'primary'}
            onClick={() => setView('manager')}
          >
            Manager
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative pt-8 mt-8 ">
        {/* Custom Y-axis labels (0% → 100%) */}
        <div className="absolute  left-0 top-0 h-full flex flex-col gap-[22px] text-sm text-gray-900 z-15">
          {[100, 80, 60, 40, 20, 0].map((percent, idx) => (
            <span key={idx}>{percent}%</span>
          ))}
        </div>

        {/* Actual chart shifted right to make space for Y-axis */}
        <div className="ml-10  h-[230px] ">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={0}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '0.5rem',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
                }}
                labelStyle={{ color: '#000' }}
                formatter={(value: number) => [`${value}`, 'Value']}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 5, stroke: '#fff', strokeWidth: 2, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Arrow Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-4 top-1/2 -translate-y-1/2 shadow-md"
        >
          <ArrowRight className="h-5 w-5 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
