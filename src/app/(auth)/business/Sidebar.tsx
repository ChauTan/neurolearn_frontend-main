'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

// Icons
import dashboard from '@/public/assets/icons/dashboard.svg';
import courses from '@/public/assets/icons/book.svg';
import message from '@/public/assets/icons/message.svg';
import setting from '@/public/assets/icons/setting.svg';
import magicPenIcon from '@/public/assets/create-quiz/magicpen.svg';
import purchaseHistory from '@/public/assets/icons/purchase-history.svg';
import discount from '@/public/assets/business/discount.svg';


const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useSelector((state: any) => state.auth);

  const isBusinessAdmin = user?.businessInfo?.role === 'admin';

  const menuItems = [
    { icon: dashboard, label: 'Dashboard', path: `/business/dashboard/${user?.businessInfo?.businessId}` },
    {
      icon: courses,
      label: 'My Courses',
      path: '/business/mycourses',
    },
    { icon: dashboard, label: 'Employee', path: '/business/employees' },
    { icon: message, label: 'Message', path: '/business/message', suffixIcon: magicPenIcon },
    { icon: purchaseHistory, label: 'Purchase History', path: '/business/purchase-history' },
    { icon: discount, label: 'Discount', path: '/business/discount' },
  ];

  if (isBusinessAdmin) {
    menuItems.push({ icon: setting, label: 'Setting', path: '/business/setting' });
  }

  return (
    <div className="w-full h-screen flex flex-col items-start p-4 rounded-2xl bg-white">
      <nav className="flex flex-col gap-4 w-full">
        {menuItems.map(item => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-xl font-medium transition-all h-15 ${
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
