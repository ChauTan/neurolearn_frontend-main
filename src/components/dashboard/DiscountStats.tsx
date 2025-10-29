'use client';

import { Percent, Users, Calendar, TrendingUp } from 'lucide-react';

interface DiscountStatsProps {
    totalDiscounts: number;
    activeDiscounts: number;
    totalUsage: number;
    averageDiscountValue: number;
}

export default function DiscountStats({
    totalDiscounts,
    activeDiscounts,
    totalUsage,
    averageDiscountValue
}: DiscountStatsProps) {
    const stats = [
        {
            label: 'Total Discounts',
            value: totalDiscounts,
            icon: Percent,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Active Discounts',
            value: activeDiscounts,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Total Usage',
            value: totalUsage,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            label: 'Avg. Discount',
            value: `${averageDiscountValue.toLocaleString()} VNĐ`,
            icon: Calendar,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 