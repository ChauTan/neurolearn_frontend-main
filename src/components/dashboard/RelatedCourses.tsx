'use client';

import React, { useRef, useCallback } from 'react';
import Link from 'next/link';
import { Course } from '@/types/course';
import CourseCard from '../common/CourseCard';

interface RelatedCoursesProps {
    title?: string;
    viewAllHref?: string;
    courses: Course[];
}

export default function RelatedCourses({
    title = 'Related Courses',
    viewAllHref = '/courses',
    courses,
}: RelatedCoursesProps) {
    const scrollerRef = useRef<HTMLDivElement>(null);

    // Chuyển deltaY của wheel thành scrollLeft để cuộn ngang bằng chuột
    const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        const el = scrollerRef.current;
        if (!el) return;
        // Nếu người dùng cuộn dọc nhiều hơn ngang thì mới chặn và chuyển thành ngang
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        }
    }, []);

    return (
        <div className="w-full bg-white rounded-2xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-black">{title}</h2>
                <Link href={viewAllHref} className="text-blue-600 text-sm font-medium hover:underline">
                    View all
                </Link>
            </div>

            {/* Courses Scroll */}
            <div className="-mx-1">
                <div
                    ref={scrollerRef}
                    onWheel={onWheel}
                    className="flex gap-4 px-1 snap-x snap-mandatory scroll-smooth
                     overflow-x-auto overflow-y-hidden
                     overscroll-x-contain overscroll-y-none
                     touch-pan-x
                     [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none' }} // Firefox: hide scrollbar
                >
                    {courses.map((course) => (
                        <div key={course._id} className="snap-start shrink-0 w-[260px] sm:w-[300px]">
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
