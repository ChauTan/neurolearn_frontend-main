'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: any;
}



export default function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-5 shadow-sm hover:cursor-pointer">
      {/* Gradient radial inline mà không cần class global */}
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 z-0"
        style={{
          background: 'radial-gradient(circle, rgba(191,219,254,1.5) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(60px)',
          opacity: 1,
        }}
      />

      <div className="relative z-10 flex items-center gap-4">
        <div className="rounded-full p-3">{icon}</div>
        <div>
          <p className="text-2xl font-bold text-blue-500">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
    </div>
  );
}
