'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchInstructorRequestProps {
    searchTerm?: string;
    onSearchChange?: (value: string) => void;
    activeTab?: 'requests' | 'instructors';
    searchPlaceholder?: string;
}

export default function SearchInstructorRequest({
    searchTerm = "",
    onSearchChange,
    searchPlaceholder = "Search instructors requests"
}: SearchInstructorRequestProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onSearchChange?.(value);
    };

    return (
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="pl-12 pr-4 py-3 bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-100 h-10 text-black"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
        </div>
    );
}
