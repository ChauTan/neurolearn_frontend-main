'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import { useSelector } from 'react-redux';
import { UserDropdown } from '../auth/UserDropDown';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import SearchIcon from '@/public/assets/home/Search.svg';
import BuyIcon from '@/public/assets/home/Buy.svg';
import LogoSVG from '@/public/assets/icons/logo.svg';
import Image from 'next/image';
import { RootState } from '@/lib/redux/store';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import ExploreDropdown from '../home/ExploreDropdown';
import { Skeleton } from '../common/ui/Skeleton';
import defaultCourseImage from '@/public/assets/images/default-course.png';
import defaultInstructorImage from '@/public/assets/images/default-avatar.png';
import { useSession } from 'next-auth/react';

const Header: React.FC = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<SearchResults>({ courses: [], instructors: [] });
  const [showResults, setShowResults] = useState(false);
  const [isLoadings, setIsLoadings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const searchRef = useRef<HTMLInputElement | null>(null);
  const { showModal } = useModal();
  const { isLoading } = useLoadUserQuery(undefined);
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const { status } = useSession(); // 'loading' | 'authenticated' | 'unauthenticated'

  interface SearchResults {
    courses: any[];
    instructors: any[];
  }

  const SearchResultSkeleton = () => (
    <div className="p-1 flex items-center">
      <Skeleton className="h-10 w-10 rounded mr-2" />
      <div className="w-full">
        <Skeleton className="h-4 w-3/4 mb-2 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-1/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
    </div>
  );

  // Animations
  const headerVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { type: 'spring', damping: 20, stiffness: 100, when: 'beforeChildren' }
    }
  };

  const buttonVariants: Variants = {
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { scale: 0.95 }
  };

  const searchVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 20, stiffness: 200 } }
  };

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  // Scroll state
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus input khi bật search
  useEffect(() => {
    if (isSearchActive && searchRef.current) searchRef.current.focus();
  }, [isSearchActive]);

  // ESC để đóng
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsSearchActive(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Responsive flag
  useEffect(() => {
    const apply = () => setIsMobile(window.innerWidth < 768);
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  // Search debounce
  useEffect(() => {
    if (!searchValue.trim()) {
      setResults({ courses: [], instructors: [] });
      setShowResults(false);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsLoadings(true);
    setShowResults(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/courses/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ search: searchValue }),
        });
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoadings(false);
      }
    }, 700);

    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [searchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);

  const handleClickOutside = (event: MouseEvent) => {
    if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
      setShowResults(false);
      setIsSearchActive(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // User section (giữ UI, co giãn kích thước)
  let userSection = null;
  const isSessionLoading = status === 'loading';
  const isSessionAuthed = status === 'authenticated';
  if (isSessionLoading || isLoading) {
    userSection = null; // optionally render skeleton
  } else if (reduxUser || isSessionAuthed) {
    userSection = (
      <div className="flex items-center gap-2">
        <UserDropdown />
      </div>
    );
  } else {
    userSection = (
      <div className="flex gap-2">
        <motion.button
          onClick={() => showModal('login')}
          className="w-[96px] h-[44px] sm:w-[124px] sm:h-[56px] bg-white rounded-[120px] text-[14px] sm:text-[16px] font-medium text-[#0D0D0D] hover:bg-gray-100 transition"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Log In
        </motion.button>
        <motion.button
          onClick={() => showModal('signup')}
          className="w-[96px] h-[44px] sm:w-[124px] sm:h-[56px] bg-[#3858F8] rounded-[120px] text-[14px] sm:text-[16px] font-medium text-white hover:bg-blue-700 transition"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Sign Up
        </motion.button>
      </div>
    );
  }

  return (
    <motion.header
      className="w-full py-3 sm:py-4 z-[100] relative"
      initial="hidden"
      animate={['visible', isScrolled ? 'scrolled' : '']}
      variants={headerVariants}
      style={{ isolation: 'isolate' }}
    >
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Left: Logo + Explore */}
        <motion.div
          className="flex items-center gap-3 sm:gap-6 md:gap-[24px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center gap-2">
              <Image src={LogoSVG} alt="Academix Logo" width={40} height={40} priority className="sm:w-[45px] sm:h-[45px]" />
              <span className="text-2xl sm:text-3xl font-bold text-[#0D0D0D] hidden sm:inline whitespace-nowrap">
                Academix
              </span>
            </Link>
          </motion.div>

          {/* Explore: ẩn trên mobile, giữ style desktop */}
          <div className="hidden lg:block">
            <ExploreDropdown />
          </div>
        </motion.div>

        {/* Right group */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-[13px]">
          {/* Search button + field */}
          <div className="relative flex items-center" ref={searchContainerRef}>
            <motion.button
              onClick={() => setIsSearchActive(active => !active)}
              className="bg-white rounded-full p-[12px] sm:p-[16px] flex items-center justify-center ml-2 sm:ml-5"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="Search"
            >
              <Image src={SearchIcon} alt="Search" width={20} height={20} />
            </motion.button>

            {/* Desktop search popover (giữ style hiện tại) */}
            <AnimatePresence>
              {!isMobile && isSearchActive && (
                <motion.div
                  variants={searchVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute right-full top-1/2 -translate-y-1/2 translate-x-2 z-90 hidden md:block"
                >
                  <div className="relative">
                    <input
                      ref={searchRef}
                      value={searchValue}
                      onChange={handleSearchChange}
                      onFocus={() => searchValue.trim() && setShowResults(true)}
                      type="text"
                      placeholder="Search for courses..."
                      className="w-[70vw] z-90 max-w-[480px] md:w-[420px] lg:w-[480px] px-5 py-3 text-sm text-gray-700 border border-gray-300 rounded-full shadow-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 z-20 transition-all"
                    />

                    <AnimatePresence>
                      {showResults && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute z-40 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                        >
                          <div className="py-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-500 scrollbar-track-primary-100">
                            {isLoadings ? (
                              <div className="px-2">
                                {[...Array(5)].map((_, i) => <SearchResultSkeleton key={i} />)}
                              </div>
                            ) : (
                              <>
                                {results.courses.length > 0 && (
                                  <div className="px-2">
                                      <h3 className="px-3 py-1 text-sm font-medium text-gray-500">Courses</h3>
                                      {results.courses.map((course) => (
                                        <Link key={course._id} href={`/courses/${course._id}`} legacyBehavior>
                                          <a className="block hover:bg-gray-50">
                                            <div className="flex items-center p-3">
                                              <div className="flex-shrink-0">
                                                <Image
                                                  src={course?.thumbnail?.url || defaultCourseImage}
                                                  alt="Course Image"
                                                  width={60}
                                                  height={45}
                                                  className="rounded object-cover"
                                                />
                                              </div>
                                              <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{course?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">
                                                  {course?.description?.length > 50 ? `${course.description.slice(0, 50)}...` : course.description}
                                                </p>
                                              </div>
                                            </div>
                                          </a>
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                  {results.instructors.length > 0 && (
                                    <div className="px-2">
                                      <h3 className="px-3 py-1 text-sm font-medium text-gray-500">Instructors</h3>
                                      {results.instructors.map((user) => (
                                        <Link key={user._id} href={`/instructors/${user._id}`} legacyBehavior>
                                          <a className="block hover:bg-gray-50">
                                            <div className="flex items-center p-3">
                                              <div className="flex-shrink-0">
                                                <Image
                                                  src={user?.avatar?.url || defaultInstructorImage}
                                                  alt="User Avatar"
                                                  width={40}
                                                  height={40}
                                                  className="rounded-full object-cover"
                                                />
                                              </div>
                                              <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.role}</p>
                                              </div>
                                            </div>
                                          </a>
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                  {results.courses.length === 0 && results.instructors.length === 0 && (
                                  <div className="text-center text-gray-500 p-4">No results found</div>
                                )}
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile search overlay (full-width), giữ tone trắng + bo tròn input */}
            <AnimatePresence>
              {isMobile && isSearchActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-90 bg-white/95 backdrop-blur-sm md:hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <input
                        ref={searchRef}
                        value={searchValue}
                        onChange={handleSearchChange}
                        onFocus={() => searchValue.trim() && setShowResults(true)}
                        type="text"
                        placeholder="Search for courses..."
                        className="flex-1 z-90 px-5 py-3 text-sm text-gray-700 border border-gray-300 rounded-full shadow-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      />
                      <button
                        onClick={() => { setIsSearchActive(false); setShowResults(false); }}
                        className="px-4 py-2 text-sm font-medium text-[#0D0D0D] bg-white rounded-full border border-gray-300"
                        aria-label="Close search"
                      >
                        Close
                      </button>
                    </div>

                    <div className="mt-3 z-90 rounded-lg border border-gray-200 bg-white shadow-lg max-h-[60vh] overflow-y-auto">
                      {isLoadings ? (
                        <div className="px-2 py-2">
                          {[...Array(6)].map((_, i) => <SearchResultSkeleton key={i} />)}
                        </div>
                      ) : (
                        <>
                          {results.courses.length > 0 && (
                            <div className="px-2 py-2">
                              <h3 className="px-3 py-1 text-sm font-medium text-gray-500">Courses</h3>
                              {results.courses.map((course) => (
                                <Link key={course._id} href={`/courses/${course._id}`} onClick={() => setIsSearchActive(false)} className="block hover:bg-gray-50">
                                  <div className="flex items-center p-3">
                                    <Image src={course?.thumbnail?.url || defaultCourseImage} alt="Course" width={60} height={45} className="rounded object-cover" />
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-gray-900">{course?.name}</p>
                                      <p className="text-xs text-gray-500 truncate">
                                        {course?.description?.length > 50 ? `${course.description.slice(0, 50)}...` : course.description}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                          {results.instructors.length > 0 && (
                            <div className="px-2 py-2">
                              <h3 className="px-3 py-1 text-sm font-medium text-gray-500">Instructors</h3>
                              {results.instructors.map((user) => (
                                <Link key={user._id} href={`/instructors/${user._id}`} onClick={() => setIsSearchActive(false)} className="block hover:bg-gray-50">
                                  <div className="flex items-center p-3">
                                    <Image src={user?.avatar?.url || defaultInstructorImage} alt="User" width={40} height={40} className="rounded-full object-cover" />
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                      <p className="text-xs text-gray-500">{user.role}</p>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          )}
                          {results.courses.length === 0 && results.instructors.length === 0 && (
                            <div className="text-center text-gray-500 p-4">No results found</div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/cart" className="bg-white rounded-full p-[12px] sm:p-[16px] flex items-center justify-center">
              <Image src={BuyIcon} alt="Buy" width={20} height={20} />
            </Link>
          </motion.div>

          {/* User Section */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {userSection}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
