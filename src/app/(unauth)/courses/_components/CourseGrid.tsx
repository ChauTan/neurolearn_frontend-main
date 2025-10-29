'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGetCoursesPaginatedQuery } from '@/lib/redux/features/course/courseApi';
import CourseCard from '@/components/common/CourseCard';
import { CommonPagination } from '@/components/common/ui';
import { fadeIn, staggerContainer } from '@/utils/animations';

interface CourseGridProps {
    page: number;
    limit: number;
    category?: string;
    level?: string;
    price?: 'Free' | 'Paid';
    rating?: number;
    search?: string;
    onPageChange: (page: number) => void;
}

const CourseGrid: React.FC<CourseGridProps> = ({
    page,
    limit,
    category,
    level,
    price,
    rating,
    search,
    onPageChange,
}) => {
    const { data, isLoading, isFetching, isError } = useGetCoursesPaginatedQuery({
        page,
        limit,
        category,
        level,
        price,
        rating,
        search,
    });

    const courses = Array.isArray(data?.courses) ? data?.courses : [];

    // Calculate minimum height based on the limit (assuming each card is ~280px tall + gap)
    const minGridHeight = Math.ceil(limit / 4) * (280 + 24); // 24 is gap-6 (1.5rem)

    const skeletonArray = new Array(limit).fill(null);
    if (isError) {
        return <div className="text-red-500 text-center mt-10">Unable to load courses.</div>;
    }
    return (
        <div className="space-y-10">
            {(isLoading || isFetching) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {skeletonArray.map((_, index) => (
                        <div
                            key={`skeleton-${index}`}
                            className="h-[280px] w-full bg-gray-100 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            )}

            {!isLoading && courses.length === 0 && (
                <div className="text-center text-gray-500 py-10">No courses available.</div>
            )}

            {!isLoading && courses.length > 0 && (
                <div style={{ minHeight: `${minGridHeight}px` }}>
                    <motion.div
                        key={`page-${page}`}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        layout // Add layout animation to smooth transitions
                    >
                        {courses.map((course, index) => (
                            <motion.div
                                key={course._id}
                                variants={fadeIn}
                                transition={{ delay: index * 0.05 }}
                                layout // Add layout animation to smooth transitions
                            >
                                <CourseCard course={course} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            )}

            <CommonPagination
                page={page}
                totalPages={data?.totalPages ?? 1}
                isFetching={isFetching}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default CourseGrid;