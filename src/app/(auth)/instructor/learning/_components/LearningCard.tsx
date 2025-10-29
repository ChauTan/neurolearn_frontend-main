'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LearningCard({ course }: any) {
    return (
        <>
            <Link
                href={`/watch-course/${course?._id}`} // Sử dụng _id thay vì course?.course._id
                className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
                {/* HEADER: Thumbnail + (Category + Title) */}
                <div className="flex items-start p-5 gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-40 h-20 flex-shrink-0">
                        <Image
                            src={course?.thumbnail?.url} // Sử dụng thumbnail từ dữ liệu mới
                            alt={course?.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    {/* Content */}
                    <div className="flex flex-col w-full">
                        {/* Row 1: Category (left) + Invite Icon (right) */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <span className="text-lg font-semibold text-black leading-snug">
                                    {course?.name
                                        ?.split(' ')
                                        .slice(0, 4)
                                        .join(' ') + (course?.name?.split(' ').length > 4 ? '...' : '')}
                                </span>
                            </div>
                        </div>
                        {/* Row 2: Course Description */}
                        <h3 className="text-sm text-gray-400 leading-snug">
                            {course?.description
                                ?.split(' ')
                                .slice(0, 10)
                                .join(' ') + (course?.description?.split(' ').length > 10 ? '...' : '')}
                        </h3>
                    </div>
                </div>
                {/* BODY: Info Row, Avatars, Progress */}
                <div className="px-5 pb-5 flex flex-col gap-4">
                    {/* Info Row */}
                    <div className="flex items-center justify-between text-sm text-gray-500 gap-2">
                        {/* Progress Bar */}
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                            <div
                                className="h-2.5 bg-blue-500"
                                style={{ width: `${course.progress}%` }} // Sử dụng giá trị progress từ API
                            ></div>
                        </div>

                        {/* Progress Percentage */}
                        <div className="flex justify-end items-center mt-1">
                            <p className="text-md font-bold pr-5 text-blue-500">{course.progress}%</p> {/* Hiển thị phần trăm tiến độ */}
                        </div>
                    </div>

                    {/* Số lượng phần học và Thời gian khóa học */}
                    <div className="flex justify-between items-center text-sm text-gray-500 gap-2">
                        <div className="flex items-center gap-1">
                            <span>Sections: {course.sectionsCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>Duration: {course.duration}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}