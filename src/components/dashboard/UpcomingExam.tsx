'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useCallback } from 'react';

interface ExamItem {
    courseId: string;        // <-- thêm để build href
    courseName: string;
    thumbnail: string;
    exams: {
        name: string;
        duration: string;      // ví dụ "30 Mins"
    }[];
}

interface UpcomingExamProps {
    items: ExamItem[];
    title?: string;
}

export default function UpcomingExam({ items, title = 'Upcoming Exam' }: UpcomingExamProps) {
    const hasItems = Array.isArray(items) && items.length > 0;

    // chuyển wheel -> scrollTop và chặn scroll “lọt” ra ngoài
    const listRef = useRef<HTMLDivElement>(null);
    const onWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
        const el = listRef.current;
        if (!el) return;
        e.preventDefault();      // chặn trang cuộn
        e.stopPropagation();
        el.scrollTop += e.deltaY; // cuộn dọc trong khối
    }, []);


    return (
        <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
            <div className="flex flex-col gap-1 w-full">
                <h2 className="text-[28px] sm:text-[32px] font-semibold text-black leading-[34px] sm:leading-[38px]">
                    {title}
                </h2>
            </div>

            {!hasItems ? (
                <div className="mt-6 flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-gray-600">
                    No upcoming exams.
                </div>
            ) : (
                    <div
                        ref={listRef}
                        onWheel={onWheel}
                        className="mt-6 flex flex-col gap-6 w-full
             overflow-y-auto overflow-x-hidden min-h-0
              max-h-[360px] sm:max-h-[420px] pr-1
             overscroll-y-contain
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-black/10"
                        style={{ scrollbarGutter: 'stable' }} // tránh layout shift khi hiện scrollbar
                    >

                        {items.map((item, idx) => {
                            const hasExams = Array.isArray(item.exams) && item.exams.length > 0;

                        return (
                            <div key={`${item.courseId}-${idx}`} className="w-full">
                                {/* Course info */}
                                <div
                                    className={[
                                        'flex items-center gap-3 bg-[#F7F8FA] p-3',
                                        hasExams ? 'rounded-t-xl' : 'rounded-xl',
                                    ].join(' ')}
                                >
                                    <div className="w-[63px] h-[63px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.courseName}
                                            width={63}
                                            height={63}
                                            sizes="63px"
                                            className="object-cover"
                                            quality={85}
                                        />
                                    </div>
                                    <span
                                        className="text-[18px] sm:text-[20px] font-medium text-black leading-[22px] sm:leading-[24px] truncate"
                                        title={item.courseName}
                                    >
                                        {item.courseName}
                                    </span>
                                </div>

                                {/* Exam list */}
                                {hasExams ? (
                                    <div className="bg-[#F7F8FA]">
                                        {item.exams.map((exam, eIdx) => {
                                            const isLast = eIdx === item.exams.length - 1;
                                            return (
                                                <Link
                                                    key={`${item.courseId}-${eIdx}`}
                                                    href={`/watch-course/${item.courseId}`}    // <-- điều hướng vào trang xem khóa
                                                    className={[
                                                        'block group',
                                                        isLast ? 'rounded-b-xl' : '',
                                                    ].join(' ')}
                                                    title={`Go to ${item.courseName}`}
                                                >
                                                    <div
                                                        className={[
                                                            'flex justify-between items-center px-3 py-2',
                                                            'border-t border-white/60',
                                                            'transition-colors duration-150 group-hover:bg-white',
                                                        ].join(' ')}
                                                    >
                                                        {/* Không còn ảnh/icon của quiz */}
                                                        <div className="flex items-center gap-2 text-black font-medium text-[14px] sm:text-[16px] min-w-0">
                                                            <span className="truncate">{exam.name}</span>
                                                        </div>

                                                        <div className="text-black/80 font-medium text-[14px] sm:text-[16px] whitespace-nowrap">
                                                            {exam.duration}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="bg-[#F7F8FA] rounded-b-xl px-3 py-3 text-gray-500 text-sm">
                                        No exams scheduled for this course.
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
