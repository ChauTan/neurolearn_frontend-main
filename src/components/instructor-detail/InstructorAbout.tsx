// src/app/(auth)/dashboard/courses/instructors/[id]/_components/InstructorAbout.tsx
'use client';
import React, { useState, useRef, useLayoutEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InstructorAboutProps {
  introductionText?: string;
}

const InstructorAbout: React.FC<InstructorAboutProps> = ({ introductionText }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [canBeClamped, setCanBeClamped] = useState(false); // <<-- State mới để "ghi nhớ"
  const textRef = useRef<HTMLParagraphElement | null>(null);

  const textToShow = introductionText || "This instructor hasn't added a biography yet.";

      // This effect will check if content is longer than 3 lines
  useLayoutEffect(() => {
    // Hàm để kiểm tra xem có overflow không
    const checkCanBeClamped = () => {
      if (textRef.current) {
        const element = textRef.current;
        // Tạm thời bỏ line-clamp để đo chiều cao đầy đủ
        element.classList.remove('line-clamp-3');
        const scrollHeight = element.scrollHeight;

        // Đo chiều cao của 3 dòng
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
        const threeLinesHeight = lineHeight * 3;

        // Bật lại line-clamp
        element.classList.add('line-clamp-3');

        // Nếu chiều cao đầy đủ lớn hơn chiều cao của 3 dòng, thì có thể thu gọn/mở rộng
        if (scrollHeight > threeLinesHeight) {
          setCanBeClamped(true);
        } else {
          setCanBeClamped(false);
        }
      }
    };

    // Create a small timeout to ensure the browser has finished calculating the layout
    const timer = setTimeout(checkCanBeClamped, 10);

    window.addEventListener('resize', checkCanBeClamped);

    // Cleanup listener và timeout
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkCanBeClamped);
    };
  }, [introductionText]); // Chỉ chạy lại khi text thay đổi, không phụ thuộc vào isExpanded

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-2xl  p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-3">About Me</h2>

      <p
        ref={textRef}
        className={cn(
          'text-sm text-gray-600 leading-relaxed transition-all duration-300',
          // Luôn áp dụng line-clamp-3 ban đầu để effect đo đạc
          // Xóa nó đi khi isExpanded là true
          !isExpanded && 'line-clamp-3'
        )}
      >
        {textToShow}
      </p>

              {/* Only show button when content can be truncated */}
      {canBeClamped && (
        <button
          onClick={toggleExpanded}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 mt-3"
        >
          <span className="cursor-pointer">{isExpanded ? 'Show less' : 'Show more'}</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}
    </div>
  );
};

export default InstructorAbout;
