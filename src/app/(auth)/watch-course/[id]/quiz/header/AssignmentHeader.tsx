// watch-course/[id]/quiz/header/AssignmentHeader.tsx
import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';

interface AssignmentHeaderProps {
  progress: number;
  // Thêm một prop cho hàm xử lý khi nhấn mũi tên quay lại
  onBackClick?: () => void;
}

export const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({ progress, onBackClick }) => {
  return (
    // Wrapper cho toàn bộ nội dung header, bây giờ sẽ nhận toàn bộ chiều rộng
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-10"> {/* Gap giữa mũi tên và phần text */}
        {/* Mũi tên quay lại */}
        <button
          onClick={onBackClick}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          {/* SVG Icon for back arrow - consider using a proper icon library */}
          <svg className="w-6 h-6 text-[#292D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>

        <div className="flex items-center gap-6"> {/* Không còn icon book ở đây */}
          {/* Giữ lại phần text "Knowledge check" và "Practice Assignment" */}
          <div>
            <div className="text-xl font-medium text-[#3858F8] leading-6">Knowledge check</div>
            <div className="text-base font-medium text-[#6B6B6B] leading-5">Practice Assignment</div>
          </div>
        </div>
      </div>

      {/* Progress Bar và Percentage - di chuyển ra ngoài */}
      <div className="flex flex-col items-end gap-2 flex-grow max-w-[744px] mx-10"> {/* max-w để giới hạn chiều rộng */}
        <div className="w-full text-right text-xl font-medium text-[#3858F8] leading-6">{progress}%</div>
        <ProgressBar progress={progress} className="w-full" />
      </div>

      {/* Timer Display - vẫn giữ nguyên nhưng nằm độc lập */}
      {/* TimerDisplay sẽ được truyền vào từ component cha */}
    </div>
  );
};