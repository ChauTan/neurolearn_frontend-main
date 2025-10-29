'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center min-h-screen">
      <div className="flex min-h-screen w-full max-w-7xl">
        {/* Sidebar chiếm 1/6 */}
        <div className="w-1/6 mt-6">
          <Sidebar />
        </div>
        {/* Nội dung chiếm 5/6 */}
        <div className="w-5/6 p-6">{children}</div>
      </div>
    </div>
  );
}