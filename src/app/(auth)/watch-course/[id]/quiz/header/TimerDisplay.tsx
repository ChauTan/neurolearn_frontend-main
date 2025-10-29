// watch-course/[id]/quiz/header/TimerDisplay.tsx
import Image from 'next/image';
import React from 'react';
import clockIcon from '@/public/assets/create-quiz/timer-pause.svg'; // Import clock icon

interface TimerDisplayProps {
  timeLeft: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft }) => { // <-- Đảm bảo có 'export'
  return (
    <div className="flex items-center gap-3">
      {/* Clock Icon (consider using an actual SVG icon component here) */}
      <div className="relative w-10 h-10 rounded-full bg-[#F8E7EB] flex items-center justify-center">
       <Image
          alt='Timer'
          src={clockIcon}
          fill // <--- Sử dụng fill để lấp đầy container
          sizes="(max-width: 768px) 100vw, 50vw" // Thêm sizes để tối ưu hiệu suất ảnh
        />
      </div>
      <div className="text-xl font-medium text-[#F02656] leading-6">{timeLeft}</div>
    </div>
  );
};