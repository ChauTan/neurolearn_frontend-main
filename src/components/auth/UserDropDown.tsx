'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import LogoutIcon from '@/public/assets/home/user-dropdown/logout.svg';

import dashboard from '@/public/assets/icons/dashboard.svg';
import courses from '@/public/assets/icons/book.svg';
import createQuiz from '@/public/assets/icons/create.svg';
import earning from '@/public/assets/icons/wallet.svg';
import message from '@/public/assets/icons/message.svg';
import setting from '@/public/assets/icons/setting.svg';
import teacher from '@/public/assets/icons/teacher.svg';
import certificate from '@/public/assets/icons/award.svg';
import purchaseHistory from '@/public/assets/icons/purchase-history.svg';
import reviewIcon from '@/public/assets/icons/book.svg';
import withdrawIcon from '@/public/assets/review/withdrawal.svg';
import businessIcon from '@/public/assets/review/business.svg';
import peopleIcon from '@/public/assets/icons/teacher.svg';
import discountIcon from '@/public/assets/business/discount.svg';

import { AnimatePresence, motion, Variants } from 'framer-motion';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/ui/DropdownMenu';

import defaultAvatar from '@/public/assets/images/avatar.png';
import { signOutAction } from '@/lib/actions/auth';
import { useLogoutQuery, useSocialAuthMutation } from '@/lib/redux/features/auth/authApi';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'user' | string;
  avatar?: { url?: string };
  businessInfo?: { businessId?: string; role?: string };
}
interface LoadUserResponse { user: User }

function getDropdownList(user: User) {
  const isBusinessAdminOrManager = user?.businessInfo?.role === 'manager';
  if (user.role === 'user' && user?.businessInfo?.role === 'admin') {
    return [
      {
        title: 'Business Dashboard',
        href: `/business/dashboard/${user.businessInfo?.businessId}`,
        icon: <Image src={businessIcon} alt="" width={20} height={20} />,
      },
      {
        title: 'My Courses',
        href: '/business/mycourses',
        icon: <Image src={courses} alt="" width={20} height={20} />,
      },
      {
        title: 'Employee',
        href: '/business/employees',
        icon: <Image src={peopleIcon} alt="" width={20} height={20} />,
      },
      {
        title: 'Message',
        href: '/business/message',
        icon: <Image src={message} alt="" width={20} height={20} />,
      },
      {
        title: 'Purchase History',
        href: '/business/purchase-history',
        icon: <Image src={purchaseHistory} alt="" width={20} height={20} />,
      },
      {
        title: 'Discount',
        href: '/business/discount',
        icon: <Image src={discountIcon} alt="" width={20} height={20} />,
      },
      {
        title: 'Setting',
        href: '/business/setting',
        icon: <Image src={setting} alt="" width={20} height={20} />,
      },

    ];
  }
  const businessItems = isBusinessAdminOrManager
  ? [
      {
        title: 'Business Dashboard',
        href: `/business/dashboard/${user.businessInfo?.businessId}`,
        icon: <Image src={businessIcon} alt="" width={20} height={20} />,
      },
      ...(user?.businessInfo?.role === 'admin'
        ? [
            {
              title: 'Setting',
              href: '/business/setting',
              icon: <Image src={setting} alt="" width={20} height={20} />,
            },
          ]
        : []),
      { title: 'My Courses', href: '/business/mycourses', icon: <Image src={courses} alt="" width={20} height={20} /> },
      { title: 'Employee', href: '/business/employees', icon: <Image src={peopleIcon} alt="" width={20} height={20} /> },
      { title: 'Message', href: '/business/message', icon: <Image src={message} alt="" width={20} height={20} /> },
      { title: 'Purchase History', href: '/business/purchase-history', icon: <Image src={purchaseHistory} alt="" width={20} height={20} /> },
      { title: 'Discount', href: '/business/discount', icon: <Image src={discountIcon} alt="" width={20} height={20} /> },
    ]
  : [];

  if (user.role === 'admin') {
    return [
      { title: 'Course Requests', href: '/dashboard/review-courses', icon: <Image src={reviewIcon} alt="" width={20} height={20} /> },
      { title: 'Teacher', href: '/dashboard/teacher', icon: <Image src={teacher} alt="" width={20} height={20} /> },
      { title: 'Withdrawals', href: '/dashboard/withdrawals', icon: <Image src={withdrawIcon} alt="" width={20} height={20} /> },
      { title: 'Instructor Requests', href: '/dashboard/review-instructor', icon: <Image src={peopleIcon} alt="" width={20} height={20} /> },
      { title: 'Business Requests', href: '/dashboard/business-requests', icon: <Image src={businessIcon} alt="" width={20} height={20} /> },
      { title: 'Certificate', href: '/dashboard/certificate', icon: <Image src={certificate} alt="" width={20} height={20} /> },
      { title: 'Message', href: '/dashboard/message', icon: <Image src={message} alt="" width={20} height={20} /> },
      { title: 'Setting', href: '/dashboard/setting', icon: <Image src={setting} alt="" width={20} height={20} /> },
    ];
  }

  if (user.role === 'instructor') {
    return [
      { title: 'Dashboard', href: '/instructor/dashboard', icon: <Image src={dashboard} alt="" width={20} height={20} /> },
      { title: 'Learning', href: '/instructor/learning', icon: <Image src={courses} alt="" width={20} height={20} /> },
      { title: 'Courses', href: '/instructor/courses', icon: <Image src={courses} alt="" width={20} height={20} /> },
      { title: 'Quizzes', href: '/instructor/quizzes', icon: <Image src={createQuiz} alt="" width={20} height={20} /> },
      { title: 'Earning', href: '/dashboard/earning', icon: <Image src={earning} alt="" width={20} height={20} /> },
      { title: 'Purchase History', href: '/dashboard/purchase-history', icon: <Image src={purchaseHistory} alt="" width={20} height={20} /> },
      { title: 'Certificate', href: '/dashboard/certificate', icon: <Image src={certificate} alt="" width={20} height={20} /> },
      { title: 'Discount', href: '/dashboard/discount', icon: <Image src={discountIcon} alt="" width={20} height={20} /> },
      { title: 'Message', href: '/dashboard/message', icon: <Image src={message} alt="" width={20} height={20} /> },
      { title: 'Setting', href: '/dashboard/setting', icon: <Image src={setting} alt="" width={20} height={20} /> },
      ...businessItems,
    ];
  }

  return [
    { title: 'Dashboard', href: '/dashboard', icon: <Image src={dashboard} alt="" width={20} height={20} /> },
    { title: 'Courses', href: '/dashboard/my-courses', icon: <Image src={courses} alt="" width={20} height={20} /> },
    { title: 'Purchase History', href: '/dashboard/purchase-history', icon: <Image src={purchaseHistory} alt="" width={20} height={20} /> },
    { title: 'Certificate', href: '/dashboard/certificate', icon: <Image src={certificate} alt="" width={20} height={20} /> },
    { title: 'Discount', href: '/dashboard/discount', icon: <Image src={discountIcon} alt="" width={20} height={20} /> },
    { title: 'Message', href: '/dashboard/message', icon: <Image src={message} alt="" width={20} height={20} /> },
    { title: 'Setting', href: '/dashboard/setting', icon: <Image src={setting} alt="" width={20} height={20} /> },
    ...businessItems,
  ];
}

export function UserDropdown() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [logoutTriggered, setLogoutTriggered] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
const { data: session } = useSession(); // status: 'loading' | 'authenticated' | 'unauthenticated'
  const router = useRouter();
  const [socialAuth] = useSocialAuthMutation();

  const { data, isLoading } = useLoadUserQuery(undefined) as {
    data?: LoadUserResponse;
    isLoading: boolean;
  };
  const { refetch: logoutApi } = useLogoutQuery(undefined, { skip: !logoutTriggered });

  // responsive calc
  useEffect(() => {
    const apply = () => setIsMobile(window.innerWidth < 640); // <sm
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  useEffect(() => {
    if (!data?.user && !isLoggingOut) {
      if (session?.user) {
        socialAuth({
          email: session.user.email,
          name: session.user.name,
          avatar: session.user.image
        }).catch(() => { });
      }
    }
  }, [session, data?.user, isLoggingOut, socialAuth]);

  const logoutHandler = async () => {
    setIsLoggingOut(true);
    if (session) await signOut({ redirect: false });
    setLogoutTriggered(true);
  };

  useEffect(() => {
    if (logoutTriggered) {
      logoutApi()
        .then(() => {
          signOutAction().then(() => { if (!session) router.push('/'); });
        })
        .catch(() => router.push('/'))
        .finally(() => setIsLoggingOut(false));
    }
  }, [logoutTriggered, logoutApi, router, session]);

  useEffect(() => {
    if (!session && logoutTriggered) router.push('/');
  }, [session, logoutTriggered, router]);

  if (isLoading || !data?.user) return null;
  const { user } = data;
  const dropdownList = getDropdownList(user);

  // animations
  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 300, mass: 0.5 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, type: 'spring', stiffness: 300 } }),
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="
            flex items-center gap-2 sm:gap-3
            p-[6px_8px] sm:p-[7px_9px]
            bg-white rounded-full
            h-12 sm:h-14 w-fit cursor-pointer transition hover:shadow
          "
        >
          {/* Avatar */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#B8DFF2] overflow-hidden flex items-center justify-center">
            <Image
              className="w-full h-full object-cover rounded-full"
              width={40}
              height={40}
              src={user?.avatar?.url ?? defaultAvatar}
              alt={user.name ?? 'User Avatar'}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Name + Arrow */}
          <div className="flex items-center gap-2 min-w-0">
            {/* hiện tên từ sm trở lên để gọn mobile */}
            <span className="hidden sm:block font-medium text-base text-black truncate leading-none whitespace-nowrap max-w-[120px] md:max-w-[160px]">
              {user.name}
            </span>
            <motion.svg
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-4 h-4 shrink-0 -translate-y-[1px] hidden sm:block"
              viewBox="0 0 16 9"
              fill="none"
            >
              <path d="M1 1L8 8L15 1" stroke="#444444ff" strokeWidth="2" />
            </motion.svg>
          </div>
        </motion.div>
      </DropdownMenuTrigger>

      <AnimatePresence>
        <DropdownMenuContent
          asChild
          forceMount
          // responsive width + high z-index để không bị che
          className="
            w-[92vw] sm:w-[260px] md:w-[280px]
            rounded-[16px] sm:rounded-[20px]
            bg-white shadow-lg border border-gray-100
            max-h-[70vh] overflow-y-auto z-[10060]
          "
          align="end"
          sideOffset={8}
          collisionPadding={12}
          style={{ transform: isMobile ? undefined : 'translateX(-10px)' }}
        >
          <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
            <DropdownMenuLabel className="px-4 sm:px-3 py-2 text-sm text-gray-500" />
            <DropdownMenuSeparator className="border-t border-gray-200" />
            {/* Scrollable Menu Items */}
            <div className="max-h-[55vh] overflow-y-auto">
              <DropdownMenuGroup>
                {dropdownList.map((item, index) => (
                  <DropdownMenuItem asChild key={`${item.title}-${item.href}`}>
                    <Link href={item.href} onClick={() => setOpen(false)}>
                      <motion.div
                        className={`
                          flex items-center gap-3
                          px-4 sm:px-3 py-3 sm:py-[10px]
                          rounded-xl text-[15px] font-medium w-full
                          ${pathname === item.href ? 'bg-gray-100 text-[#3858F8]' : 'text-black hover:bg-gray-100'}
                        `}
                        variants={itemVariants}
                        custom={index}
                      >
                        {item.icon}
                        <span className="truncate">{item.title}</span>
                      </motion.div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </div>
            {/* Fixed Sign Out Button at Bottom */}
            <div className="sticky bottom-0 bg-white pt-2 border-t border-gray-200">
              <DropdownMenuItem asChild>
                <motion.button
                  onClick={logoutHandler}
                  className="flex items-center gap-3 px-4 sm:px-3 py-3 sm:py-[10px] text-red-600 hover:bg-red-50 rounded-xl w-full text-[15px] font-medium"
                  variants={itemVariants}
                  custom={dropdownList.length}
                >
                  <Image src={LogoutIcon} alt="Sign Out" width={20} height={20} />
                  <span className="truncate">Sign Out</span>
                </motion.button>
              </DropdownMenuItem>
            </div>
          </motion.div>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
  );
}
