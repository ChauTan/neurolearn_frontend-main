'use client';

import { Pie, PieChart, Tooltip } from 'recharts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/common/ui/Card';

const chartData = [
  { name: 'Completed', value: 55, fill: '#2563eb' }, // blue-700
  { name: 'Learning', value: 35, fill: '#34d399' }, // green-400
  { name: 'Pending', value: 5, fill: '#f97316' }, // orange-500
];

const ProgressBar = ({
  label,
  percentage,
  colorClass,
}: {
  label: string;
  percentage: number;
  colorClass: string;
}) => (
  <div className="w-full">
    {' '}
    {/* ✅ Thêm w-full tại đây */}
    <div className="flex justify-between text-sm">
      <span className="font-semibold text-foreground text-gray-700">{label}</span>
      <span className="text-gray-700">{percentage}%</span>
    </div>
    <div className="mt-1 h-2 rounded-full bg-secondary">
      <div className={`h-2 rounded-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

export default function CourseStatus() {
  return (
    <Card className="rounded-xl bg-background shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>Course Status</CardTitle>
      </CardHeader>

      <CardContent className="relative flex items-center justify-center h-[110px]">
        {/* Chart */}
        <PieChart width={192} height={192}>
          <Tooltip />
          <Pie
            data={[{ name: 'Background', value: 100 }]}
            dataKey="value"
            innerRadius={68}
            outerRadius={85}
            fill="#c0c0c0" // màu xám (gray-200)
            stroke="0"
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={68} // tăng từ 60 ➜ 68 để vòng nhỏ lại
            outerRadius={85}
            stroke="0"
            cornerRadius={8}
          />
        </PieChart>

        {/* Centered percentage */}
        <div className="absolute text-center text-3xl font-bold text-foreground text-gray-900">
          100%
        </div>
      </CardContent>

      <CardFooter className="flex-col space-y-4 text-sm pt-6">
        <ProgressBar label="Completed" percentage={55} colorClass="bg-blue-700" />
        <ProgressBar label="Learning" percentage={35} colorClass="bg-emerald-400" />
        <ProgressBar label="Pending" percentage={5} colorClass="bg-orange-500" />
      </CardFooter>
    </Card>
  );
}
