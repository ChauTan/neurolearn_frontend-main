// watch-course/[id]/quiz/ui/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => { // <-- Đảm bảo có 'export'
  return (
    <div className={`w-full h-5 rounded-full bg-[#F7F8FA] p-0.5 ${className}`}>
      <div
        className="h-full rounded-full bg-[#3858F8]"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};