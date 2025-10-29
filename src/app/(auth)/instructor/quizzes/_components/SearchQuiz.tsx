'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, SlidersHorizontal, Check } from 'lucide-react';

interface SearchCourseProps {
    onSearchChange?: (value: string) => void;
    onFilterSelect?: (value: string) => void;
    searchPlaceholder?: string;
    filterText?: string;              // <-- dùng cái này để quyết định ẩn/hiện
    searchTerm?: string;
    filterOptions?: string[];
}

export default function SearchQuiz({
    onSearchChange,
    onFilterSelect,
    searchPlaceholder = 'Search quizzes...',
    filterText,                       // <-- không set default nữa
    searchTerm = '',
    filterOptions = [],               // <-- mặc định rỗng
}: SearchCourseProps) {
    const [open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange?.(e.target.value);
    };

    const handleSelect = (value: string) => {
        onFilterSelect?.(value);
        setOpen(false);
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

    // Nếu filterText/filerOptions trở thành falsy → đóng dropdown
    useEffect(() => {
        if (!filterText?.trim() || !filterOptions?.length) setOpen(false);
    }, [filterText, filterOptions]);

    const shouldShowFilter = !!filterText?.trim() && (filterOptions?.length ?? 0) > 0;

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

            {/* Filter */}
            {shouldShowFilter && (
                <div className="relative">
                    <button
                        ref={btnRef}
                        onClick={() => setOpen(v => !v)}
                        aria-haspopup="menu"
                        aria-expanded={open}
                        className={`flex items-center text-sm text-gray-700 bg-white border border-gray-300 px-4 py-2.5 rounded-full hover:bg-gray-50 shadow-sm h-[42px] transition-colors duration-150 ease-in-out w-full sm:w-auto justify-center sm:justify-start flex-shrink-0 ${open ? 'ring-1 ring-blue-500/50' : ''
                            }`}
                    >
                        <SlidersHorizontal size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                        <span className="whitespace-nowrap">{filterText}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ml-1.5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Animated dropdown */}
                    <div
                        ref={menuRef}
                        role="menu"
                        aria-label="Filter menu"
                        className={`absolute z-50 right-0 mt-2 w-44 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden transition-all duration-150 ease-out ${open ? 'opacity-100 scale-100 translate-y-0' : 'pointer-events-none opacity-0 scale-95 -translate-y-1'
                            }`}
                    >
                        <div className="py-1 max-h-72 overflow-auto">
                            {filterOptions.map(opt => {
                                const active = opt === filterText;
                                return (
                                    <button
                                        key={opt}
                                        role="menuitem"
                                        onClick={() => handleSelect(opt)}
                                        className={`w-full flex items-center justify-between text-left px-3 py-2 text-sm transition-colors ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="truncate">{opt}</span>
                                        {active && <Check size={16} className="text-blue-600 ml-2" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
