'use client';
import React from 'react';
import Image from 'next/image'; // <<-- THÊM IMPORT IMAGE
import { User } from '@/types/user';
import { Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';

// <<-- SỬA LẠI StatItem ĐỂ NHẬN VÀO MỘT ICON ĐÃ RENDER -->>
const StatItem: React.FC<{
  icon: React.ReactNode; // Nhận vào một React Node (có thể là <Image /> hoặc icon từ lucide)
  title: string;
  value: React.ReactNode;
}> = ({ icon, title, value }) => (
  <div>
    {/* Phần tiêu đề và icon */}
    <div className="flex items-center gap-2 text-black mb-2">
              {/* Render icon prop directly */}
      {icon}
      <h4 className="text-lg font-semibold">{title}</h4>
    </div>
    {/* Phần giá trị */}
    <div>{value}</div>
  </div>
);

const SocialLink: React.FC<{ href?: string; icon: React.ReactNode }> = ({ href, icon }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
    >
      {icon}
    </a>
  );
};

interface InstructorStatsProps {
  instructor: User;
  totalCourses: number;
}

const InstructorStats: React.FC<InstructorStatsProps> = ({ instructor, totalCourses }) => {

  return (
    <div className="bg-white rounded-2xl  p-6 sm:p-8 flex flex-col h-full">
      {/* Các chỉ số thống kê */}
      <div className="space-y-6 flex-grow">
        {/* <<-- SỬA Ở ĐÂY: Truyền thẳng component Image vào prop icon -->> */}
        <StatItem
          icon={
            <Image
              src="/assets/icons/outline-black-star.svg"
              alt="Review Icon"
              width={16}
              height={16}
            />
          }
          title="Reviews"
          value={
            <div className="flex items-center gap-2">
              <span className="text-3xl font-semibold text-blue-500">
                {typeof instructor.rating === 'number' ? instructor.rating.toFixed(1) : '0'}
              </span>
              {/* Sử dụng Image cho icon ngôi sao màu xanh */}
              <Image src="/assets/icons/blue-star.svg" alt="Star" width={20} height={20} />
              <span className="text-sm text-gray-500 self-end pb-2">

              </span>
            </div>
          }
        />

        <StatItem
          icon={
            <Image
              src="/assets/icons/people-outline-black.svg"
              alt="Review Icon"
              width={16}
              height={16}
            />
          } // Can still use icon from lucide-react
          title="People"
          value={
            <div className="flex items-center gap-2">
              <span className="text-3xl font-semibold text-blue-500">
                {instructor.student?.toLocaleString() || '0'}
              </span>
              <span className="text-sm text-gray-500 ">Students</span>
            </div>
          }
        />

        <StatItem
          icon={
            <Image src="/assets/icons/book2-black.svg" alt="Review Icon" width={16} height={16}             />
          } // Can still use icon from lucide-react
          title="Courses"
          value={
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-blue-500">{totalCourses}</span>
              <span className="text-sm text-gray-500">Courses</span>
            </div>
          }
        />
      </div>

      {/* Link mạng xã hội */}
      <div className="mt-auto pt-6  border-gray-100">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Social Profile</h3>
        <div className="flex items-center gap-3">
          <SocialLink
            href={instructor.socialLinks?.facebook}
            icon={<Facebook size={18} className="text-gray-600" />}
          />
          <SocialLink
            href={instructor.socialLinks?.twitter}
            icon={<Twitter size={18} className="text-gray-600" />}
          />
          <SocialLink
            href={instructor.socialLinks?.instagram}
            icon={<Instagram size={18} className="text-gray-600" />}
          />
          <SocialLink href="#" icon={<MessageCircle size={18} className="text-gray-600" />} />
        </div>
      </div>
    </div>
  );
};

export default InstructorStats;
