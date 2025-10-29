// CourseCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/types/course';
import { useState } from 'react';


interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [imageError, setImageError] = useState(false);
  const authorName = course.publisher?.name || 'Instructor Name';
  const authorAvatar = course.publisher?.avatar?.url || '/assets/images/default-avatar.png';
  const authorProfession = course.publisher?.role || 'Instructor';
  const formatPrice = (price: number): string => {
    if (course.isFree) return 'Free';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      currencyDisplay: 'code', 
    }).format(price);
  };

  const originalPrice =
    course.estimatedPrice || (course.price && course.price > 0 ? course.price * 1.5 : 0);
  const reviewCount = course.reviews?.length || 0;

  const handleWishlistClick = () => {
    // Handle wishlist logic
  };

  const handleCartClick = () => {
    // Handle cart logic
  };

  return (
    <Link href={`/courses/${course._id}`} className="block h-full group">
      <div className="bg-white rounded-xl  overflow-hidden  transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1 border border-gray-100">
        <div className="p-3 flex items-center gap-3 border-b border-gray-100">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={authorAvatar}
              alt={authorName}
              fill
              sizes="40px"
              className="rounded-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-grow">
            <h4 className="font-semibold text-sm text-gray-800 truncate">{authorName}</h4>
            <p className="text-xs text-gray-500 truncate">{authorProfession}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Add to wishlist"
              onClick={handleWishlistClick}
            >
              <Image src="/assets/icons/heart-blue.svg" alt="Star icon" width={16} height={16} />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              title="Add to cart"
              onClick={handleCartClick}
            >
              <Image src="/assets/icons/Buy.svg" alt="Star icon" width={16} height={16} />
            </button>
          </div>
        </div>
        <div className="relative h-48 w-full ">
          <Image
            src={imageError
              ? '/assets/images/placeholder-course.jpg'
              : typeof course.thumbnail === 'string'
                ? course.thumbnail
                : course.thumbnail?.url || '/assets/images/placeholder-course.jpg'}
            alt={course.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-2xl"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-md font-semibold mb-1.5 leading-snug line-clamp-2  text-gray-800 group-hover:text-blue-600 transition-colors">
            {course.name}
          </h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
            {course.description || course.subTitle}
          </p>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex gap-2">
              <span className="text-sm font-semibold text-gray-800 ">
                {course.rating.toFixed(1)}
              </span>
              <Image src="/assets/icons/blue-star.svg" alt="Star icon" width={16} height={16} />
            </div>
            {originalPrice > (course.price || 0) && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-baseline  gap-2   justify-between ">
            <span className="text-sm text-gray-800">
              {reviewCount.toLocaleString()} Review rating
            </span>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(course.price || 0)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
