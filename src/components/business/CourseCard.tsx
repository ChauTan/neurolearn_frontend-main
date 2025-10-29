'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import InviteModal from './InviteModal';

export default function CourseCard({ course }: any) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [totalLicenses, setTotalLicenses] = useState(course?.totalLicenses);

  return (
    <>
      <Link
        href={`/business/mycourses/${course?.course?._id}`}
        className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
      >
        {/* HEADER: Thumbnail + (Category + Title) */}
        <div className="flex items-start p-6 gap-5">
          {/* Thumbnail */}
          <div className="relative w-44 h-24 flex-shrink-0">
            <Image
              src={course?.course?.thumbnail?.url}
              alt={course?.course?.name || 'Course thumbnail'}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-xl group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {/* Content */}
          <div className="flex flex-col w-full space-y-2">
            {/* Row 1: Category (left) + Invite Icon (right) */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1 flex-1 pr-2">
                <span className="text-lg font-semibold text-black leading-tight line-clamp-2">
                  {course?.course?.name?.split(' ').slice(0, 6).join(' ') +
                    (course?.course?.name?.split(' ').length > 6 ? '...' : '')}
                </span>
              </div>
              <button
                type="button"
                onClick={e => {
                  e.preventDefault();
                  setIsInviteOpen(true);
                }}
                className="flex-shrink-0"
              >
                <Image src="/assets/icons/invite.svg" alt="Invite Icon" height={40} width={40} />
              </button>
            </div>
            {/* Row 2: Course Description */}
            <div className="mt-1">
              <h3 className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                {course?.course?.description?.split(' ').slice(0, 12).join(' ') +
                  (course?.course?.description?.split(' ').length > 12 ? '...' : '')}
              </h3>
            </div>
          </div>
        </div>
        {/* BODY: Info Row, Avatars, Progress */}
        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Info Row */}
          <div className="flex items-center justify-between text-sm text-gray-500 gap-2">
            {/* Date / Courses / Count */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Total Licenses: {totalLicenses}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        course={course?.course}
        totalLicenses={totalLicenses}
        setTotalLicenses={setTotalLicenses}
      />
    </>
  );
}
