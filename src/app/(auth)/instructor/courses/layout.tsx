// src/app/(auth)/dashboard/courses/layout.tsx
import React from 'react';

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full flex justify-center">
            <main className="flex flex-col gap-6 items-start w-full max-w-[1120px]">
                {children}
            </main>
        </div>
    );
}
