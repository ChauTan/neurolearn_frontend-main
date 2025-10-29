'use client';

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchInstructorProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    onFilterClick?: () => void;
    searchPlaceholder?: string;
    filterText?: string;
}

export default function SearchInstructor({
    searchTerm = "",
    onSearchChange,
    onFilterClick,
    searchPlaceholder = "Search instructors...",
    filterText = "All categories"
}: SearchInstructorProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onSearchChange?.(value);
    };

    const handleFilterClick = () => {
        onFilterClick?.();
    };

    return (
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3 sm:gap-4">
            <div className="relative w-full sm:w-auto lg:min-w-[300px] xl:min-w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="block text-black w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400 h-[42px]"
                />
            </div>
            <button
                onClick={handleFilterClick}
                className="flex items-center text-sm text-gray-700 bg-white border border-gray-200 px-4 py-2.5 rounded-full hover:bg-gray-50 h-[42px] transition-colors w-full sm:w-auto justify-center flex-shrink-0"
            >
                <SlidersHorizontal size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                <span className="whitespace-nowrap">{filterText}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1.5 text-gray-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        </div>
    );
}
