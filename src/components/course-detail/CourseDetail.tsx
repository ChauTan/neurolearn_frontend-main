'use client';

import type { Course } from '@/types/course';
import Image from 'next/image';

export default function CourseDetail({ course }: { course: Course | any }) {
  // Calculate total lessons from sections
  const calculateTotalLessons = (sections: any[]) => {
    if (!Array.isArray(sections)) return 0;
    return sections.reduce((total, section) => {
      return total + (Array.isArray(section.lessons) ? section.lessons.length : 0);
    }, 0);
  };

  // Format duration
  const formatDuration = (duration: number) => {
    if (!duration) return 'N/A';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  // Get level name - handle both object and string formats
  const getLevelName = (level: any) => {
    if (typeof level === 'object' && level !== null) {
      return level.name || 'All levels';
    }
    if (typeof level === 'string') {
      // For now, just show the level ID or use a simple mapping
      // In a real app, you might want to fetch level names from API
      const levelMap: { [key: string]: string } = {
        '689ad7cc84ae071c1e67987b': 'Beginner',
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
      };
      return levelMap[level] || 'All levels';
    }
    return 'All levels';
  };

  const totalLessons = calculateTotalLessons(course?.sections || []);
  const durationText = course?.durationText || (course?.duration ? formatDuration(course.duration) : 'N/A');
  const levelName = getLevelName(course?.level);
  const purchasedCount = course?.purchased ?? 0; // Default to 0 if not available

  return (
    <div className="text-3xl font-bold text-black max-w-full mx-auto bg-[#F7F8FA] rounded-xl">
      <div className="pb-4">Course detail</div>
      <div className="flex justify-between gap-4 w-full">
        <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
          Lesson
          <div className="flex items-center gap-2 text-black mt-2">
            <Image src="/assets/icons/play.svg" alt="Play Icon" width={24} height={24} />
            <span>{totalLessons}</span>
          </div>
        </div>
        <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
          Duration
          <div className="flex items-center gap-2 text-black mt-2">
            <Image src="/assets/icons/clock.svg" alt="Clock Icon" width={24} height={24} />
            <span>{durationText}</span>
          </div>
        </div>
        <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
          Skill level
          <div className="flex items-center gap-2 text-black mt-2">
            <Image src="/assets/icons/sort.svg" alt="Sort Icon" width={24} height={24} />
            <span>{levelName}</span>
          </div>
        </div>
        <div className="flex-1 text-base h-[116px] bg-[#FFFFFF] text-[#6B6B6B] rounded-lg p-6">
          Purchased
          <div className="flex items-center gap-2 text-black mt-2">
            <Image src="/assets/icons/eye.svg" alt="Eye Icon" width={24} height={24} />
            <span>{purchasedCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
