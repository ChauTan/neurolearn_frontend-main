'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useGetAllPurchasedCoursesQuery } from '@/lib/redux/features/course/courseApi';
import LearningCard from './_components/LearningCard';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/ui/Button2';
import SearchCourse from '@/components/dashboard/SearchCourse';
import { CommonPagination } from '@/components/common/ui';

const ITEMS_PER_PAGE = 6;

// Safe string helpers
const s = (v: any) => (v == null ? '' : String(v));
const sa = (v: any) => (Array.isArray(v) ? v.map(s).join(' ') : s(v)); // array → "a b c", non-array → string

export default function LearningPage() {
    const { data: courseData, isLoading } = useGetAllPurchasedCoursesQuery();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => setCurrentPage(1), [searchTerm]);

    // Normalize API result
    const purchasedList = useMemo(() => {
        if (!courseData) return [];
        if (courseData.success === false) return [];
        return Array.isArray(courseData.data) ? courseData.data : [];
    }, [courseData]);

    // Search filter (robust against non-strings)
    const filteredCourses = useMemo(() => {
        let list = purchasedList;

        // Apply search
        if (searchTerm.trim()) {
            const q = searchTerm.trim().toLowerCase();
            list = list.filter((c: any) => {
                const name = s(c?.name || c?.title);
                const author = s(c?.authorId?.name);
                const category = sa(c?.category) + ' ' + sa(c?.categories);
                const tags = sa(c?.tags);
                const haystack = `${name} ${author} ${category} ${tags}`.toLowerCase();
                return haystack.includes(q);
            });
        }

        return list;
    }, [purchasedList, searchTerm]);

    // Pagination (same UX as your CourseCardGrid)
    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen space-y-6">
            {/* Top: Search always visible */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <SearchCourse
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            </div>
            {/* Loading inline (keep layout) */}
            {isLoading && <Loading message="Loading courses..." />}
            {/* Search meta */}
            {searchTerm.trim() && !isLoading && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                        Found <strong>{filteredCourses.length}</strong> result{filteredCourses.length === 1 ? '' : 's'}
                        {` for "`}<span className="font-medium">{searchTerm}</span>{`"`}
                    </span>
                </div>
            )}
            {/* Content area */}
            {!isLoading && (
                <>
                    {filteredCourses.length === 0 ? (
                        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
                            <p className="text-gray-600">
                                {purchasedList.length === 0
                                    ? 'You do not have any learning course!'
                                    : 'No courses match your search.'}
                            </p>

                            {purchasedList.length === 0 ? (
                                <Button variant="ghost" size="default" onClick={() => router.push('/courses')}>
                                    Explore Courses
                                </Button>
                            ) : (
                                <Button variant="ghost" size="default" onClick={() => setSearchTerm('')}>
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {currentCourses.map((course: any) => (
                                    <LearningCard key={course._id} course={course} />
                                ))}
                            </div>

                                {/* Pagination */}
                                <CommonPagination
                                    page={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                        </>
                    )}
                </>
            )}
        </div>
    );
}
