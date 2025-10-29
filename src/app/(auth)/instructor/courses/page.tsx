'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CourseCardGrid from '@/app/(auth)/instructor/courses/create-course/_components/CourseCardGrid';
import Button from '@/components/dashboard/Button';
import SearchCourse from '@/components/dashboard/SearchCourse';

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleOpenCreateCourse = () => {
        router.push('/instructor/courses/create-course');
    };

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
                <SearchCourse
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />
                <div className="flex w-full sm:w-auto justify-center sm:justify-end mt-4 sm:mt-0">
                    <div className="flex gap-2">
                        <Button onClick={handleOpenCreateCourse} label="New Course" />
                        {/* <Button onClick={() => router.push('/instructor/courses/create-course?ai=1')} label="New Course with AI" /> */}
                    </div>
                </div>
            </div>
            <CourseCardGrid searchTerm={searchTerm} />
        </div>
    );
}