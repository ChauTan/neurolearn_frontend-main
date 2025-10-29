'use client';

import Image from 'next/image';

interface PublisherCardProps {
  author: {
    name: string;
    email?: string;
    role?: string;
    avatar?: {
      public_id?: string;
      url?: string;
    };
    description?: string;
    rating?: number;
    reviews?: number;
    students?: number;
    courses?: number;
  };
  updatedAt?: Date;
}

export default function PublisherCard({ author, updatedAt }: PublisherCardProps) {
  const {
    name,
    avatar,
    role,
    description,
    rating,
    reviews,
    students,
    courses,
  } = author || {};

  return (
    <div className="max-w-full w-[395px] p-4 bg-white rounded-2xl shadow-md border border-gray-200 mx-auto">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold text-black">Publisher</h2>
        <a href="#" className="text-sm text-[#3858F8]">
          View profile
        </a>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 relative">
          <Image
            src={avatar?.url || '/assets/images/avatar.png'}
            alt="Avatar"
            fill
            className="rounded-full border border-gray-300 object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-800 leading-tight">{name}</p>
          <p className="text-xs text-gray-500">{role || 'Instructor'}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-4 line-clamp-3">{description}</p>
      <div className="space-y-2">
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/blue-star.svg" alt="Star Icon" width={20} height={20} />
          {rating} 
        </div>
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/blue-completion.svg" alt="Review Icon" width={20} height={20} />
          {reviews} Reviews
        </div>
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/people.svg" alt="Students Icon" width={20} height={20} />
          {students} Students
        </div>
        <div className="flex items-center text-sm text-black gap-3">
          <Image src="/assets/icons/blue-play.svg" alt="Courses Icon" width={20} height={20} />
          {courses} Courses
        </div>
      </div>
      {updatedAt && (
        <div className="text-xs text-gray-400 mt-3 text-right">
          Updated: {new Date(updatedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
