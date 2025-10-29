// src/app/(auth)/dashboard/courses/instructors/[id]/_components/ReviewCard.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { IReview } from '@/types/course'; // Ensure correct path
import { MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // Import hàm định dạng thời gian

interface ReviewCardProps {
  review: IReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Hàm để tạo timestamp tương đối (ví dụ: "2 weeks ago")
  const timeAgo = (dateValue?: string | Date): string => {
    // 1. Return default string if no date
    if (!dateValue) {
      return 'a while ago';
    }

    try {
      // 2. Convert to Date object if it's a string, if already Date then keep as is
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Invalid date for formatDistanceToNow:', dateValue);
      // 3. Return empty string or default value if error
      return '';
    }
  };

  return (
    <div className="bg-white rounded-xl  p-5 relative border border-gray-100 h-full flex flex-col">
      {/* Header của card */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src={'/assets/images/default-avatar.png'}
              alt={review.user.name}
              fill
              sizes="40px"
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">{review.user.name}</h4>
            <p className="text-xs text-gray-700">{timeAgo(review.createdAt)}</p>
          </div>
        </div>
        <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed my-4 line-clamp-4 flex-grow">
        {review.comment}
      </p>
      {/* Footer của card */}
      <div className="flex items-center justify-between pt-3  border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-gray-700">{review.rating.toFixed(1)}</span>
          <Image src={'/assets/icons/blue-star.svg'} alt="Star icon" width={16} height={16} />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors">
            <Image src={'/assets/icons/like.svg'} alt="Star icon" width={16} height={16} />
            {/* <span>{...số like...}</span> */}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors">
            <Image src={'/assets/icons/dislike.svg'} alt="Star icon" width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
