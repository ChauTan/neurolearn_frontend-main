'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Instructor {
  name?: string;
  role?: string;
  avatar?: {
    url?: string;
  };
  likes?: number;
}

export default function InstructorInfo({ instructor, courseName }: { instructor: Instructor, courseName: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="max-w-full rounded-2xl">
      {/* Header Section */}
      <h1 className="text-3xl font-bold text-black mb-6 leading-snug">
        {courseName || 'Graphic Design Master – Learn GREAT Design'}
      </h1>

      <div className="flex items-center justify-between gap-4 mb-8 w-full">
        {/* Profile Info */}
        <div className="flex items-center gap-4 min-w-[250px]">
          <Image
            src={
              imageError
                ? '/assets/images/placeholder-teacher.jpg'
                : instructor?.avatar?.url || '/assets/images/teacher.jpg'
            }
            alt="Instructor"
            width={50}
            height={50}
            className="rounded-full ring-2 ring-white object-cover w-15 h-15"
            onError={() => setImageError(true)}
          />
          <div>
            <div className="text-black font-semibold text-lg">{instructor?.name || 'Unknown Instructor'}</div>
            <div className="text-gray-600 text-sm">
              {instructor?.role || 'Instructor'}
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-black">
            <Image src="/assets/icons/heart.svg" alt="Heart Icon" width={20} height={20} />
            <span>{instructor?.likes || 0} Likes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-black">
            <Image src="/assets/icons/upload-file.svg" alt="Share Icon" width={20} height={20} />
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  );
}
