'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Banner from './_components/Banner';
import FilterSection from './_components/FilterSection';
import CourseGrid from './_components/CourseGrid';

const CoursesPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1', 10);
    const category = searchParams.get('category') || undefined;
    const level = searchParams.get('level') || undefined;
    const rawPrice = searchParams.get('price');
    const price = rawPrice === 'Free' || rawPrice === 'Paid' ? rawPrice : undefined;
    const rating = searchParams.get('rating') ? parseInt(searchParams.get('rating')!, 10) : undefined;
    const search = searchParams.get('search') || undefined;

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/courses?${params.toString()}`);
    };

    return (
        <div className="min-h-screen pb-10">
            <Banner />

            <div className="relative z-80 -mt-[64px]">
                <Suspense fallback={<div>Loading filters...</div>}>
                    <FilterSection />
                </Suspense>
            </div>
            <div className="max-w-[1380px] mx-auto px-4 space-y-10 mt-8">
                <CourseGrid
                    page={page}
                    limit={12}
                    category={category}
                    level={level}
                    price={price}
                    rating={rating}
                    search={search}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default CoursesPage;
