'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux/store';

// Icons
import dashboard from '@/public/assets/icons/dashboard.svg';
import courses from '@/public/assets/icons/book.svg';
import createQuiz from '@/public/assets/icons/create.svg';
import earning from '@/public/assets/icons/wallet.svg';
import message from '@/public/assets/icons/message.svg';
import setting from '@/public/assets/icons/setting.svg';
import magicPenIcon from '@/public/assets/create-quiz/magicpen.svg';
import certificate from '@/public/assets/icons/award.svg';
import purchaseHistory from '@/public/assets/icons/purchase-history.svg';
import reviewIcon from '@/public/assets/icons/book.svg';
import withdrawIcon from '@/public/assets/review/withdrawal.svg';
import businessIcon from '@/public/assets/review/business.svg';
import peopleIcon from '@/public/assets/icons/teacher.svg';
import discountIcon from '@/public/assets/business/discount.svg';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  suffixIcon?: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'user' | string;
  avatar?: {
    url?: string;
  };
  businessInfo?: {
    businessId?: string;
    role?: string;
  };
}

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth) as { user: User | null };

  const userRole = typeof user === 'string' ? 'user' : user?.role || 'user';

  const menuByRole: Record<string, MenuItem[]> = {
    user: [
      { icon: dashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: courses, label: 'Courses', path: '/dashboard/my-courses' },
      ...(user?.businessInfo?.role === 'employee'
        ? [
            {
              icon: courses,
              label: 'Business Courses',
              path: '/dashboard/assign-course',
            },
          ]
        : []),
      { icon: purchaseHistory, label: 'Purchase History', path: '/dashboard/purchase-history' },
      { icon: certificate, label: 'Certificate', path: '/dashboard/certificate' },
      { icon: message, label: 'Message', path: '/dashboard/message' },
      { icon: discountIcon, label: 'Discount', path: '/dashboard/discount' },
      { icon: setting, label: 'Setting', path: '/dashboard/setting' },
    ],
    instructor: [
      { icon: dashboard, label: 'Dashboard', path: '/instructor/dashboard' },
      { icon: courses, label: 'Learning', path: '/instructor/learning' },
      { icon: courses, label: 'Courses', path: '/instructor/courses' },
      { icon: createQuiz, label: 'Quizzes', path: '/instructor/quizzes', suffixIcon: magicPenIcon },
      { icon: earning, label: 'Earning', path: '/dashboard/earning' },
      // { icon: withdrawIcon, label: 'Withdrawals', path: '/dashboard/withdrawals' },
      { icon: purchaseHistory, label: 'Purchase History', path: '/dashboard/purchase-history' },
      { icon: certificate, label: 'Certificate', path: '/dashboard/certificate' },
      { icon: message, label: 'Message', path: '/dashboard/message' },
      { icon: setting, label: 'Setting', path: '/dashboard/setting' },
    ],
    admin: [
      { icon: reviewIcon, label: 'Course Requests', path: '/dashboard/review-courses' },
      { icon: withdrawIcon, label: 'Withdrawals', path: '/dashboard/withdrawals' },
      { icon: peopleIcon, label: 'Instructor Requests', path: '/dashboard/review-instructor' },
      { icon: businessIcon, label: 'Business Requests', path: '/dashboard/business-requests' },
      { icon: discountIcon, label: 'Discount Management', path: '/dashboard/discount-management' },
      { icon: certificate, label: 'Certificate', path: '/dashboard/certificate' },
      { icon: setting, label: 'Setting', path: '/dashboard/setting' },
    ],
  };

  // Choose menu items based on user role
  const menuItems: MenuItem[] = menuByRole[userRole] || menuByRole['user'];

  return (
    <div className="w-full max-h-screen flex flex-col items-start p-4 rounded-2xl bg-white">
      <nav className="flex flex-col gap-4 w-full">
        {menuItems.map((item: MenuItem) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                isActive
                  ? 'bg-gray-100 text-[#3858F8]'
                  : 'text-black hover:text-[#3858F8] hover:bg-gray-50'
              }`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className={`transition-colors ${
                  isActive ? 'filter-blue' : 'group-hover:filter-blue'
                }`}
              />
              {item.label}
              {item.suffixIcon && (
                <Image
                  src={item.suffixIcon}
                  alt={`${item.label} options`}
                  width={24}
                  height={24}
                  className="transition-opacity font-bold opacity-70 group-hover:opacity-100"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
