'use client';

import React from 'react';
import Image from 'next/image';

const Banner: React.FC = () => {
    return (
        <div className="relative mt-20 w-full h-[200px] md:h-[220px] rounded-3xl overflow-hidden">
            <Image
                src="/assets/home/CoursesPageBanner.png"
                alt="Banner"
                fill
                className="object-cover object-center"
                priority
            />
            {/* Overlay text */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-start px-6 md:px-10">
                <h1 className="text-xl md:text-2xl font-semibold text-left leading-snug text-white max-w-[600px]">
                    Enhance Knowledge With <br className="hidden md:block" /> Online Courses
                </h1>
            </div>
        </div>
    );
};

export default Banner;
