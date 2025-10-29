'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchCourseRequestProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    selectedCategory?: string;
    onCategoryChange?: (value: string) => void;
    categories?: string[];
    selectedStatus?: string;
    onStatusChange?: (value: string) => void;
    statusOptions?: string[];
    activeTab?: 'request' | 'courses';
    searchPlaceholder?: string;
}

export default function SearchCourseRequest({
    searchTerm = "",
    onSearchChange,
    searchPlaceholder = "Search"
}: SearchCourseRequestProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onSearchChange?.(value);
    };

    return (
        <div>
            <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="pl-12 pr-4 bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-100 h-10 text-black"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
        </div>
    );
}
