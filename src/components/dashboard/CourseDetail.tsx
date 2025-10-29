'use client';

import Image from 'next/image';
import React from 'react';

interface CourseStat {
    label: string;
    icon: string;
    value: number;
    width?: number;
    height?: number;
}

interface CourseDetailProps {
    isLoading: boolean;
    stats: CourseStat[];
}

export default function CourseDetail({ isLoading, stats }: CourseDetailProps) {
    return (
        <div className="text-3xl font-bold text-black max-w-full mx-auto bg-[#F7F8FA]">
            <div className="flex justify-between gap-8 w-full">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="flex-1 text-base h-[120px] bg-[#FFFFFF] text-[#6B6B6B] rounded-2xl p-6 flex flex-col justify-between"
                    >
                        <div className="flex flex-row items-center justify-between w-full">
                            <div
                                className="flex items-center justify-center"
                                style={{ width: item.width ?? 50, height: item.height ?? 50 }}
                            >
                                <Image
                                    src={item.icon}
                                    alt={item.label}
                                    width={item.width ?? 50}
                                    height={item.height ?? 50}
                                />
                            </div>
                            <span className="text-4xl font-bold text-[#3858F8]">
                                {isLoading ? '...' : item.value}
                            </span>
                        </div>
                        <div className="flex justify-end">
                            <span className="text-base text-[#6B6B6B]">{item.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
