'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';

interface SearchCourseProps {
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    searchTerm?: string;
}

export default function SearchCourse({
    onSearchChange,
    searchPlaceholder = 'Search courses...',                   
    searchTerm = ''
}: SearchCourseProps) {
    const [open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange?.(e.target.value);
    };
    // Close on outside click / Esc
    useEffect(() => {
        if (!open) return;
        const onDocClick = (e: MouseEvent) => {
            const t = e.target as Node;
            if (menuRef.current?.contains(t)) return;
            if (btnRef.current?.contains(t)) return;
            setOpen(false);
        };
        const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);

        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onEsc);
        };
    }, [open]);

    return (
        <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-3 sm:gap-4 relative">
            {/* Search */}
            <div className="relative w-full sm:flex-1 lg:min-w-[300px] xl:min-w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="block text-black w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white rounded-full shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400 h-[42px]"
                    aria-label="Search courses"
                />
            </div>
        </div>
    );
}
