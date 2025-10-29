'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearchChange?: (value: string) => void;
  onFilterSelect?: (value: string) => void;
  searchPlaceholder?: string;
  filterText?: string;              // <-- dùng cái này để quyết định ẩn/hiện
  searchTerm?: string;
  filterOptions?: string[];
}

export default function SearchBar({
  onSearchChange,
  searchPlaceholder = 'Search...',
  searchTerm = '',
}: SearchBarProps) {

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  return (
    <div className="flex h-10 w-100 flex-col sm:flex-row w-full sm:w-auto items-center gap-3 sm:gap-4">
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
