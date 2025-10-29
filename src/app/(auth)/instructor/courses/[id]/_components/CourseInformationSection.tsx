import React from 'react';
import Image from 'next/image';
import courseImage from '@/public/assets/images/default-course.png';

interface CourseInformationSectionProps {
    course: {
        title: string;
        subTitle?: string;
        category: string;
        skillLevel: string;
        originalPrice: number;  // price
        salePrice?: number;     // estimatedPrice
        duration?: number;      // minutes
        description: string;
        overview?: string;
        thumbnail: string;      // URL
        prerequisites: string[];
        benefits: string[];
    };
}

// Locale + currency config
const LOCALE = 'vi-VN'; // hiển thị số theo locale VN
const CURRENCY_UNIT = 'VND'; // mệnh giá hiển thị sau số
// Formatter: không thập phân, mệnh giá đứng SAU số tiền
const formatMoney = (n?: number) => {
    // nếu không phải số -> N/A
    if (typeof n !== 'number') return 'N/A';
    // ép về số nguyên + format theo locale (không thập phân)
    const whole = Math.round(n).toLocaleString(LOCALE, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });
    // mệnh giá đặt SAU số tiền
    return `${whole} ${CURRENCY_UNIT}`;
};

const CourseInformationSection: React.FC<CourseInformationSectionProps> = ({ course }) => {
    return (
        <section className="mb-8">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Course Information</h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left info */}
                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">Title</label>
                        <p className="text-lg font-medium text-gray-900">{course.title || '—'}</p>
                    </div>

                    {course.subTitle ? (
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Sub Title</label>
                            <p className="text-gray-900">{course.subTitle}</p>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Category</label>
                            <p className="text-gray-900">{course.category || 'N/A'}</p>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Skill level</label>
                            <p className="text-gray-900">{course.skillLevel || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Original Price</label>
                            <p className="text-gray-900">{formatMoney(course.originalPrice)}</p>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Sale Price</label>
                            <p className="text-gray-900">
                                {typeof course.salePrice === 'number' ? formatMoney(course.salePrice) : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Duration</label>
                            <p className="text-gray-900">{course.duration ? `${course.duration}` : 'N/A'}</p>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">Description</label>
                        <p className="text-lg leading-relaxed text-gray-900 whitespace-pre-wrap">
                            {course.description || '—'}
                        </p>
                    </div>

                    {course.overview ? (
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-600">Overview</label>
                            <p className="text-gray-900 whitespace-pre-wrap">{course.overview}</p>
                        </div>
                    ) : null}

                    {/* Prerequisites */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">Prerequisites</label>
                        {course.prerequisites?.length ? (
                            <ul className="list-disc pl-6 text-gray-900 space-y-1">
                                {course.prerequisites.map((p, i) => (
                                    <li key={`${p}-${i}`}>{p}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No prerequisites specified.</p>
                        )}
                    </div>

                    {/* Benefits */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-600">Benefits</label>
                        {course.benefits?.length ? (
                            <ul className="list-disc pl-6 text-gray-900 space-y-1">
                                {course.benefits.map((b, i) => (
                                    <li key={`${b}-${i}`}>{b}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No benefits specified.</p>
                        )}
                    </div>
                </div>

                {/* Right: thumbnail */}
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                    <Image
                        src={course.thumbnail || courseImage.src}
                        alt="Course Thumbnail"
                        width={400}
                        height={256}
                        className="h-auto max-h-64 w-full rounded-md object-cover"
                        unoptimized={typeof course.thumbnail === 'string' && course.thumbnail.startsWith('http')}
                    />
                    <p className="mt-4 text-center text-sm text-gray-500">Course Thumbnail</p>
                </div>
            </div>
        </section>
    );
};

export default CourseInformationSection;
