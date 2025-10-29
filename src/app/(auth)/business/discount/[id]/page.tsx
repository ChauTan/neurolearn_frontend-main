'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Calendar, Percent, Tag, Users, DollarSign, Eye, Trash2 } from 'lucide-react';

interface Discount {
    _id: string;
    code: string;
    name: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minAmount?: number;
    maxDiscount?: number;
    usageLimit: number;
    usedCount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    applicableCourses: string[];
    createdAt: string;
}

export default function DiscountDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [discount, setDiscount] = useState<Discount | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch discount data from API
        const fetchDiscount = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/discounts/${params.id}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDiscount(data.discount || data);
                } else {
                    console.error('Failed to fetch discount');
                }
            } catch (error) {
                console.error('Error fetching discount:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchDiscount();
        }
    }, [params.id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (isActive: boolean, endDate: string) => {
        const isExpired = new Date(endDate) < new Date();

        if (isExpired) {
            return <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">Expired</span>;
        }

        return isActive ?
            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">Active</span> :
            <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">Inactive</span>;
    };

    const getUsagePercentage = () => {
        if (!discount) return 0;
        return (discount.usedCount / discount.usageLimit) * 100;
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full rounded-2xl">
                <div className="w-full overflow-y-auto p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-16 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!discount) {
        return (
            <div className="flex h-screen w-full rounded-2xl">
                <div className="w-full overflow-y-auto p-6">
                    <div className="text-center py-12">
                        <div className="text-gray-500 mb-4">Discount not found</div>
                        <button
                            onClick={() => router.back()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full rounded-2xl">
            <div className="w-full overflow-y-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{discount.name}</h1>
                        <p className="text-gray-600">Discount Details</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                            Edit
                        </button>
                        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Tag className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Discount Code</p>
                                        <p className="font-mono font-medium text-lg">{discount.code}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Description</p>
                                    <p className="text-gray-800">{discount.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Percent className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-gray-600">Type:</span>
                                        <span className="font-medium capitalize">{discount.discountType}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-gray-600">Value:</span>
                                        <span className="font-medium">
                                            {discount.discountType === 'percentage'
                                                ? `${discount.discountValue}%`
                                                : `${discount.discountValue.toLocaleString()} VNĐ`
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Usage Statistics */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Usage Statistics</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm text-gray-600">Usage</span>
                                    </div>
                                    <span className="font-medium">{discount.usedCount}/{discount.usageLimit}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-blue-600 h-3 rounded-full transition-all"
                                        style={{ width: `${getUsagePercentage()}%` }}
                                    ></div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {discount.usageLimit - discount.usedCount} uses remaining
                                </div>
                            </div>
                        </div>

                        {/* Applicable Courses */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Applicable Courses</h2>
                            <div className="space-y-2">
                                {discount.applicableCourses.map((course, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                        <span className="text-gray-700">{course}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Current Status</span>
                                    {getStatusBadge(discount.isActive, discount.endDate)}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                        {discount.isActive ? 'Available for use' : 'Not available'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Date Information */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Date Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Start Date</p>
                                        <p className="font-medium">{formatDate(discount.startDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">End Date</p>
                                        <p className="font-medium">{formatDate(discount.endDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Created</p>
                                        <p className="font-medium">{formatDate(discount.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Conditions */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Conditions</h3>
                            <div className="space-y-3">
                                {discount.minAmount && (
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            Minimum amount: {discount.minAmount.toLocaleString()} VNĐ
                                        </span>
                                    </div>
                                )}
                                {discount.maxDiscount && (
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">
                                            Maximum discount: {discount.maxDiscount.toLocaleString()} VNĐ
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 