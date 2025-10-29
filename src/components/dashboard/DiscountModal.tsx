'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Percent, Tag, DollarSign, Users } from 'lucide-react';

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

interface DiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    discount?: Discount | null;
    onSave: (discount: Omit<Discount, '_id' | 'usedCount' | 'createdAt'>) => void;
}

export default function DiscountModal({ isOpen, onClose, discount, onSave }: DiscountModalProps) {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        discountType: 'percentage' as 'percentage' | 'fixed',
        discountValue: 0,
        minAmount: 0,
        maxDiscount: 0,
        usageLimit: 100,
        startDate: '',
        endDate: '',
        isActive: true,
        applicableCourses: [] as string[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (discount) {
            setFormData({
                code: discount.code,
                name: discount.name,
                description: discount.description,
                discountType: discount.discountType,
                discountValue: discount.discountValue,
                minAmount: discount.minAmount || 0,
                maxDiscount: discount.maxDiscount || 0,
                usageLimit: discount.usageLimit,
                startDate: discount.startDate,
                endDate: discount.endDate,
                isActive: discount.isActive,
                applicableCourses: discount.applicableCourses
            });
        } else {
            setFormData({
                code: '',
                name: '',
                description: '',
                discountType: 'percentage',
                discountValue: 0,
                minAmount: 0,
                maxDiscount: 0,
                usageLimit: 100,
                startDate: '',
                endDate: '',
                isActive: true,
                applicableCourses: []
            });
        }
        setErrors({});
    }, [discount, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.code.trim()) {
            newErrors.code = 'Discount code is required';
        } else if (formData.code.length < 3) {
            newErrors.code = 'Discount code must be at least 3 characters';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Discount name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (formData.discountValue <= 0) {
            newErrors.discountValue = 'Discount value must be greater than 0';
        }

        if (formData.discountType === 'percentage' && formData.discountValue > 100) {
            newErrors.discountValue = 'Percentage cannot exceed 100%';
        }

        if (formData.usageLimit <= 0) {
            newErrors.usageLimit = 'Usage limit must be greater than 0';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        }

        if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
            newErrors.endDate = 'End date must be after start date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSave({
                code: formData.code.toUpperCase(),
                name: formData.name,
                description: formData.description,
                discountType: formData.discountType,
                discountValue: formData.discountValue,
                minAmount: formData.minAmount > 0 ? formData.minAmount : undefined,
                maxDiscount: formData.maxDiscount > 0 ? formData.maxDiscount : undefined,
                usageLimit: formData.usageLimit,
                startDate: formData.startDate,
                endDate: formData.endDate,
                isActive: formData.isActive,
                applicableCourses: formData.applicableCourses
            });
            onClose();
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {discount ? 'Edit Discount' : 'Create New Discount'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Tag className="w-4 h-4 inline mr-1" />
                                Discount Code *
                            </label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.code ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., SUMMER2024"
                            />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Discount Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., Summer Sale 2024"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Describe what this discount offers..."
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Discount Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Discount Type
                            </label>
                            <select
                                value={formData.discountType}
                                onChange={(e) => handleInputChange('discountType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (VNĐ)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Percent className="w-4 h-4 inline mr-1" />
                                Discount Value *
                            </label>
                            <input
                                type="number"
                                value={formData.discountValue}
                                onChange={(e) => handleInputChange('discountValue', parseFloat(e.target.value) || 0)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.discountValue ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder={formData.discountType === 'percentage' ? '20' : '50000'}
                                min="0"
                                max={formData.discountType === 'percentage' ? '100' : undefined}
                            />
                            {errors.discountValue && <p className="text-red-500 text-xs mt-1">{errors.discountValue}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Minimum Amount (VNĐ)
                            </label>
                            <input
                                type="number"
                                value={formData.minAmount}
                                onChange={(e) => handleInputChange('minAmount', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="100000"
                                min="0"
                            />
                        </div>
                    </div>

                    {formData.discountType === 'percentage' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Discount (VNĐ)
                            </label>
                            <input
                                type="number"
                                value={formData.maxDiscount}
                                onChange={(e) => handleInputChange('maxDiscount', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="500000"
                                min="0"
                            />
                        </div>
                    )}

                    {/* Usage and Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="w-4 h-4 inline mr-1" />
                                Usage Limit *
                            </label>
                            <input
                                type="number"
                                value={formData.usageLimit}
                                onChange={(e) => handleInputChange('usageLimit', parseInt(e.target.value) || 0)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.usageLimit ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="100"
                                min="1"
                            />
                            {errors.usageLimit && <p className="text-red-500 text-xs mt-1">{errors.usageLimit}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Start Date *
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.startDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                End Date *
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleInputChange('endDate', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                            Active (Available for use)
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {discount ? 'Update Discount' : 'Create Discount'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 