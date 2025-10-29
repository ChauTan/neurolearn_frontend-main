'use client';

import Image from 'next/image';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { IReview } from '@/types/course';

export default function Review({ reviews }: { reviews: IReview[] }) {
  return (
    <div className="max-w-full mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-black">Review and rating</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="w-[311px] min-h-[249px] bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Image
                  src={review.user?.avatar?.url || '/assets/images/avatar.png'}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-black">
                    {review.user?.name || 'Anonymous'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {review?.user?.createdAt
                      ? new Date(review.user.createdAt).toLocaleDateString('vi-VN')
                      : 'Unknown date'}
                  </p>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-400 leading-none pr-1">”</div>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-700 leading-relaxed mt-2 mb-3 flex-1">
              {review.comment}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>{review.rating.toFixed(1)}</span>
                <Star size={14} fill="#3858F8" color="#3858F8" />
              </div>
              <div className="flex items-center gap-3">
                <ThumbsUp size={16} />
                <ThumbsDown size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
