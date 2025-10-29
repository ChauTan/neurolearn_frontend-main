'use client';

import Image from 'next/image';

export default function CourseDetail() {
  return (
    <div className="text-3xl font-bold text-black max-w-full mx-auto bg-[#F7F8FA] rounded-2xl shadow-md">
      <div className="flex justify-between gap-4 w-full">
        <div className="flex-1 text-base bg-[#FFFFFF] text-[#0D0D0D] rounded-2xl space-y-4 p-6">
          {/* Lesson */}
          <div className="flex items-center gap-3">
            <Image src="/assets/icons/play.svg" alt="Play Icon" width={24} height={24} />
            <span className="w-24">Lesson</span>
            <span className="font-semibold text-black">128 videos</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-3">
            <Image src="/assets/icons/clock.svg" alt="Clock Icon" width={24} height={24} />
            <span className="w-24">Duration</span>
            <span className="font-semibold text-black">56h 28m</span>
          </div>

          {/* Skill level */}
          <div className="flex items-center gap-3">
            <Image src="/assets/icons/sort.svg" alt="Sort Icon" width={24} height={24} />
            <span className="w-24">Skill level</span>
            <span className="font-semibold text-black">Beginner</span>
          </div>

          {/* View */}
          <div className="flex items-center gap-3">
            <Image src="/assets/icons/eye.svg" alt="Eye Icon" width={24} height={24} />
            <span className="w-24">View</span>
            <span className="font-semibold text-black">12,450 person</span>
          </div>
        </div>
      </div>
    </div>
  );
}
