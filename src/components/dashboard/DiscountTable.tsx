'use client';

import { Calendar, Percent, Tag } from 'lucide-react';

interface Discount {
    _id: string;
    code: string;
    name: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    amount: number; // từ backend
    minOrderAmount?: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    usedCount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    courseIds?: string[];
    createdAt: string;
}

interface DiscountTableProps {
    discounts: Discount[];
}

export default function DiscountTable({ discounts }: DiscountTableProps) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    const getStatusBadge = (isActive: boolean, endDate: string) => {
        const isExpired = new Date(endDate) < new Date();
        if (isExpired) {
            return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Expired</span>;
        }
        return isActive
            ? <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span>
            : <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Inactive</span>;
    };


    return (
        <div className="bg-white pt-6 px-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Discount Management</h2>
            </div>

            <table className="w-full table-auto text-left">
                <thead>
                    <tr className="text-sm text-gray-500 border-b">
                        <th className="pb-6">Code</th>
                        <th className="pb-6">Name</th>
                        <th className="pb-6">Discount</th>
                        <th className="pb-6">Valid Period</th>
                        <th className="pb-6">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {discounts.map((discount, idx) => (
                        <tr
                            key={discount._id}
                            className={`text-sm text-black ${idx !== discounts.length - 1 ? 'border-b border-gray-200' : ''}`}
                        >
                            <td className="py-6">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-blue-600" />
                                    <span className="font-mono font-medium">{discount.code}</span>
                                </div>
                            </td>
                            <td className="py-6">
                                <div>
                                    <div className="font-medium">{discount.name}</div>
                                    <div className="text-gray-500 text-xs mt-1">{discount.description}</div>
                                </div>
                            </td>
                            <td className="py-6">
                                <div className="flex items-center gap-1">
                                    <Percent className="w-4 h-4 text-green-600" />
                                    <span className="font-medium">
                                        {discount.discountType === 'percentage'
                                            ? `${discount.amount}%`
                                            : `${discount.amount.toLocaleString()} VNĐ`
                                        }
                                    </span>
                                </div>
                                {discount.minOrderAmount!=null && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        Min: {discount.minOrderAmount.toLocaleString()} VNĐ
                                    </div>
                                )}
                            </td>
                            <td className="py-6">
                                <div className="flex items-center gap-1 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <div className="text-xs">
                                        <div>{formatDate(discount.startDate)}</div>
                                        <div>to {formatDate(discount.endDate)}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-6">
                                {getStatusBadge(discount.isActive, discount.endDate)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {discounts.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">No discounts found</div>
                </div>
            )}

        </div>
    );
}
