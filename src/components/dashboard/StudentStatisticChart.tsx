'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from 'recharts';

interface Point {
  name: string;
  // Dành cho user
  progress?: number;   // 0..100
  completed?: number;  // optional: vẫn hỗ trợ nếu sau này dùng
  hours?: number;      // optional: vẫn hỗ trợ nếu sau này dùng
  // Dành cho instructor
  buy?: number;
  view?: number;
}

interface Props {
  isLoading: boolean;
  chartData: Point[];
  isInstructor: boolean;
}

const BLUE = '#2563eb';
const GRAY_GRID = '#F1F5F9';
const GRAY_DOT = '#D1D5DB';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <span className="inline-block w-2.5 h-2.5 rounded" style={{ background: p.color }} />
          <span className="text-gray-600">
            {p.name}:{' '}
            <span className="font-medium text-black">
              {p.dataKey === 'progress' ? `${p.value}%`
                : p.dataKey === 'hours' ? `${p.value}h`
                  : p.value}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default function StudentStatisticChart({
  isLoading,
  chartData,
  isInstructor,
}: Props) {
  const hasData = Array.isArray(chartData) && chartData.length > 0;

  // Chuẩn hoá cho User: chỉ lấy name + progress dạng number
  const normalizedUserData = !isInstructor
    ? (chartData || []).map((d) => ({
      name: d?.name ?? '',
      progress: Number((d as any)?.progress ?? 0),
      completed: Number((d as any)?.completed ?? 0),
      hours: Number((d as any)?.hours ?? 0),
    }))
    : chartData;

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
        <h2 className="text-xl font-bold text-black">
          {isInstructor ? 'Instructor Statistics' : 'Progress by Course'}
        </h2>

        {/* Legend */}
        <div className="flex items-center gap-4">
          {isInstructor ? (
            <>
              <LegendDot color={GRAY_DOT} label="View courses" />
              <LegendDot color={BLUE} label="Buy courses" highlight />
            </>
          ) : (
            <>
              <LegendDot color={BLUE} label="Progress" highlight />
              <LegendDot color="#94A3B8" label="Hours" />
              <LegendDot color={GRAY_DOT} label="Complete" />
            </>
          )}

        </div>
      </div>

      <div className="w-full h-72 relative">
        {isLoading ? (
          <SkeletonChart />
        ) : !hasData ? (
          <EmptyState />
        ) : (
              <ResponsiveContainer width="100%" height="100%">
                {isInstructor ? (
                  // ===== INSTRUCTOR: stack buy/view =====
                  <BarChart data={chartData} barCategoryGap={18}>
                    <CartesianGrid vertical={false} stroke={GRAY_GRID} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(2,132,199,0.06)' }}
                      content={<CustomTooltip />}
                    />
                    <Bar
                      dataKey="buy"
                      name="Buy"
                      stackId="a"
                      fill={BLUE}
                      radius={[6, 6, 0, 0]}
                      barSize={56}
                    />
                    <Bar
                      dataKey="view"
                      name="View"
                      stackId="a"
                      fill={GRAY_DOT}
                      radius={[0, 0, 6, 6]}
                      barSize={56}
                    />
                  </BarChart>
                ) : (
                  // ===== USER: progress % (1 bar) =====
                  < BarChart data={normalizedUserData} barCategoryGap={20}>
                    <CartesianGrid vertical={false} stroke={GRAY_GRID} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }} />

                    {/* Trục % cho progress */}
                    <YAxis yAxisId="left" domain={[0, 100]} axisLine={false} tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }} />

                    {/* Trục số cho hours & completed */}
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false}
                      tick={{ fill: '#64748B', fontSize: 12 }} />

                    <Tooltip cursor={{ fill: 'rgba(2,132,199,0.06)' }} content={<CustomTooltip />} />

                    <Bar dataKey="progress" name="Progress" yAxisId="left"
                      fill={BLUE} radius={[6, 6, 0, 0]} maxBarSize={40}>
                      <LabelList dataKey="progress" position="top"
                        formatter={(v: number) => `${v}%`} />
                    </Bar>

                    <Bar dataKey="hours" name="Hours" yAxisId="right"
                      fill="#94A3B8" radius={[6, 6, 0, 0]} maxBarSize={40}>
                      <LabelList dataKey="hours" position="top"
                        formatter={(v: number) => `${v}h`} />
                    </Bar>

                    <Bar dataKey="completed" name="Complete" yAxisId="right"
                      fill={GRAY_DOT} radius={[6, 6, 0, 0]} maxBarSize={40}>
                      <LabelList dataKey="completed" position="top" />
                    </Bar>
              </BarChart>

                )}
              </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

/* ===== UI bits ===== */

function LegendDot({
  color,
  label,
  highlight = false,
}: {
  color: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-3.5 h-3.5 rounded-full inline-block"
        style={{ background: color }}
      />
      <span
        className={`text-sm ${highlight ? 'text-blue-600 font-medium' : 'text-gray-500'
          }`}
      >
        {label}
      </span>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="absolute inset-0 p-4">
      <div className="h-full w-full grid grid-cols-12 items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-md animate-pulse"
            style={{ height: `${20 + (i % 5) * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
      <div className="w-10 h-10 rounded-full bg-gray-100 mb-3" />
      <p className="text-sm text-gray-500">No statistics available yet.</p>
      <p className="text-xs text-gray-400">
        Start learning to see your progress here.
      </p>
    </div>
  );
}
