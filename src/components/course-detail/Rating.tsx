'use client';

import Image from 'next/image';
import React from 'react';

export default function Rating({ rating }: { rating: number }) {
  // number of full stars
  const fullStars = Math.floor(rating);
  // build an array of booleans length 5
  const stars = Array.from({ length: 5 }, (_, i) => i < fullStars);

  return (
    <div className="w-full max-w-[395px] h-[91px] bg-white rounded-2xl shadow-md p-4 mx-auto">
      <div className="flex items-center justify-between h-full">
        {/* Left: Avatar + Info */}
        <div className="flex items-center gap-4">
          <Image
            src={"/assets/images/happy-face.png"}
            alt={'rating'}
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
          <div>
            <div className="text-black font-bold text-xl">Rating</div>
            <div className="text-black text-sm">
              {/* {studentCount} Students */}
            </div>
          </div>
        </div>

        {/* Right: Stars + Rating */}
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-1">
            {stars.map((filled, idx) => (
              <Image
                key={idx}
                src={filled ? '/assets/icons/star.svg' : '/assets/icons/un-star.svg'}
                alt={filled ? 'Star filled' : 'Star empty'}
                width={24}
                height={24}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
