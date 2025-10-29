'use client';

import { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

interface DiscountFilterDropdownProps {
    onFilterChange: (filters: DiscountFilters) => void;
}

export interface DiscountFilters {
    status: 'all' | 'active' | 'inactive' | 'expired';
    discountType: 'all' | 'percentage' | 'fixed';
    dateRange: 'all' | 'this-week' | 'this-month' | 'this-year';
}

export default function DiscountFilterDropdown({ onFilterChange }: DiscountFilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<DiscountFilters>({
        status: 'all',
        discountType: 'all',
        dateRange: 'all'
    });

    const handleFilterChange = (key: keyof DiscountFilters, value: string) => {
        const newFilters = { ...filters, [key]: value as any };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const getFilterLabel = () => {
        const activeFilters = [];
        if (filters.status !== 'all') activeFilters.push(filters.status);
        if (filters.discountType !== 'all') activeFilters.push(filters.discountType);
        if (filters.dateRange !== 'all') activeFilters.push(filters.dateRange);

        return activeFilters.length > 0 ? `${activeFilters.length} filters` : 'All discounts';
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            >
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{getFilterLabel()}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                    <div className="space-y-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>

                        {/* Discount Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Discount Type
                            </label>
                            <select
                                value={filters.discountType}
                                onChange={(e) => handleFilterChange('discountType', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="all">All Types</option>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>

                        {/* Date Range Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date Range
                            </label>
                            <select
                                value={filters.dateRange}
                                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                                <option value="all">All Time</option>
                                <option value="this-week">This Week</option>
                                <option value="this-month">This Month</option>
                                <option value="this-year">This Year</option>
                            </select>
                        </div>

                        {/* Clear Filters Button */}
                        <div className="pt-2 border-t">
                            <button
                                onClick={() => {
                                    const resetFilters: DiscountFilters = {
                                        status: 'all',
                                        discountType: 'all',
                                        dateRange: 'all'
                                    };
                                    setFilters(resetFilters);
                                    onFilterChange(resetFilters);
                                }}
                                className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
} 