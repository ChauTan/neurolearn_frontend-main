// src/app/(auth)/dashboard/courses/instructors/[id]/_components/InstructorTabs.tsx
'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface InstructorTabsProps {
  activeTab: 'courses' | 'reviews';
  onTabChange: (tab: 'courses' | 'reviews') => void;
  courseCount?: number;
  reviewCount?: number;
  onSeeAllClick?: () => void;
  showSeeAll?: boolean;
  seeAllHref?: string; // Prop để truyền đường dẫn cho nút "See all"
}

const InstructorTabs: React.FC<InstructorTabsProps> = ({
  activeTab,
  onTabChange,
  courseCount,
  reviewCount,
  showSeeAll = false,
  seeAllHref = '#',
}) => {
  // Bỏ hàm calc() không cần thiết đi
  // function calc(arg0: number, px: any): any {
  //   throw new Error('Function not implemented.');
  // }

  return (
    <div className="flex items-center justify-between ">
      <div className="relative inline-flex p-1 bg-gray-100 rounded-xl">
        {/* Phần nền trượt (slider) */}
        <div
          className={cn(
            'absolute top-1 left-1 h-[calc(100%-8px)] rounded-lg bg-blue-500 shadow-md transition-transform duration-300 ease-in-out'
          )}
          // <<-- SỬA Ở ĐÂY: Bọc giá trị trong dấu nháy để thành chuỗi -->>
          style={{
            width: 'calc(50% - 4px)',
            transform: activeTab === 'reviews' ? 'translateX(calc(100% + 4px))' : 'translateX(0)',
          }}
        />

        {/* Nút tab "Courses" */}
        <button
          onClick={() => onTabChange('courses')}
          className={cn(
            'relative z-10 cursor-pointer flex items-center justify-center gap-2  px-8 py-4 rounded-lg text-sm font-semibold transition-colors duration-200',
            activeTab === 'courses' ? 'text-white' : 'text-gray-700  '
          )}
        >
          <Image
            src={
              activeTab === 'courses'
                ? '/assets/icons/book2-white.svg'
                : '/assets/icons/book2-black.svg'
            }
            alt="Courses Icon"
            width={16}
            height={16}
          />
          <span>Courses</span>
          {courseCount !== undefined && (
            <span
              className={cn(
                'ml-1.5 text-xs px-2 py-0.5 rounded-full',
                activeTab === 'courses' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              )}
            >
              {courseCount}
            </span>
          )}
        </button>

        {/* Nút tab "Reviews" */}
        <button
          onClick={() => onTabChange('reviews')}
          className={cn(
            'relative z-10 cursor-pointer flex items-center justify-center gap-2  px-8 py-4 rounded-lg text-sm font-semibold transition-colors duration-200',
            activeTab === 'reviews' ? 'text-white' : 'text-gray-700  '
          )}
        >
          <Star
            size={16}
            className={cn(
              'transition-colors duration-200',
              activeTab === 'reviews' ? 'text-white' : 'text-gray-500'
            )}
          />
          <span>Reviews</span>
          {reviewCount !== undefined && (
            <span
              className={cn(
                'ml-1.5 text-xs px-2 py-0.5 rounded-full',
                activeTab === 'reviews' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              )}
            >
              {reviewCount}
            </span>
          )}
        </button>
      </div>

      {/* Nút "See all" */}
      {showSeeAll && (
        <Link
          href={seeAllHref}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
        >
          See all
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
};

export default InstructorTabs;
