// src/app/(auth)/dashboard/courses/instructors/[id]/_components/InstructorInfoCard.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { User } from '@/types/user';

interface InstructorInfoCardProps {
  instructor: User;
}

const InstructorInfoCard: React.FC<InstructorInfoCardProps> = ({ instructor }) => {
  return (
    // Container chính của card, có position: relative để chứa avatar
    <div className="relative flex flex-col sm:flex-row items-center  text-center sm:text-left">
      {/* Container cho Avatar, được kéo lên trên và căn giữa */}
      <div
        className="
        relative w-28 h-28 sm:w-44 sm:h-44
        flex-shrink-0 
        -mt-16 sm:-mt-20 md:-mt-24  /* Kéo avatar lên trên */
        mb-4 sm:mb-0 sm:mr-6      /* Tạo khoảng cách với text */
      "
      >
        <Image
          src={instructor.avatar?.url || '/assets/images/default-avatar.png'}
          alt={`Profile photo of ${instructor.name}`}
          fill
          sizes="246px"
          className="rounded-full object-cover border-4 "
        />
      </div>

      {/* Container cho Tên và Chức danh */}
      <div className="min-w-0">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">{instructor.name}</h1>
        <p className="text-base text-gray-500 mt-1 truncate">
          {instructor.profession || 'Instructor'}
        </p>
      </div>
    </div>
  );
};

export default InstructorInfoCard;
