'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query';

import CourseDetail from '@/components/dashboard/CourseDetail';
import CourseStatus from '@/components/dashboard/CourseStatus';
import EvalueStatistic from '@/components/dashboard/EvalueStatistic';
import RevenueStatisticChart from '@/components/dashboard/RevenueStatisticChart';
import StudentStatisticChart from '@/components/dashboard/StudentStatisticChart';

import {
  useGetLatestCourseQuery,
  useGetCourseStatsQuery,
  useGetStudentStatsQuery,
} from '@/lib/redux/features/course/courseApi';
import Loading from '@/components/common/Loading';

export default function InstructorDashboard() {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();

    const role = user?.role;
    const [ready, setReady] = useState(false);
  
    // Mark as client-ready to avoid hydration flicker
    useEffect(() => setReady(true), []);
  
    // Redirect when not instructor
    useEffect(() => {
      if (!ready) return;
      if (role === undefined) return;
      if (role !== 'instructor') {
       router.replace('/'); // send non-instructor to home
      }
    }, [ready, role, router]);
  
    
  // ====== Query data ======
  const { data: latestCourseData, isLoading: isLoadingCourse } = useGetLatestCourseQuery(
    user?._id ?? skipToken
  );
  const { data: statsData, isLoading: isLoadingStats } = useGetCourseStatsQuery(
    user?._id ?? skipToken
  );
  const { data: studentStatsData, isLoading: isLoadingStudent } = useGetStudentStatsQuery(
    user?._id ?? skipToken
  );

  const course = latestCourseData?.course;
  const chartData = studentStatsData?.stats ?? [];

  // InstructorDashboard.tsx
  const handleContinue = ({
    courseId,
    status,
  }: {
    courseId: string;
    status: string;
  }) => {
    if (!courseId) return;
    router.push(
      status === 'draft'
        ? `/instructor/courses/edit-course/${courseId}`
        : `/instructor/courses/${courseId}`
    );
  };


  const stats = [
    {
      label: 'Total Courses',
      icon: '/assets/icons/blue-book.svg',
      value: statsData?.totalCourses ?? 0,
      width: 50,
      height: 50,
    },
    {
      label: 'Pending Courses',
      icon: '/assets/icons/hourglass.svg',
      value: statsData?.pendingCourses ?? 0,
      width: 35,
      height: 35,
    },
    {
      label: 'Courses Sold',
      icon: '/assets/icons/sold.svg',
      value: statsData?.coursesSold ?? 0,
      width: 50,
      height: 50,
    },
    {
      label: 'Published',
      icon: '/assets/icons/blue-completion.svg',
      value: statsData?.publishedCourses ?? 0,
      width: 50,
      height: 50,
    },
  ];
  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || role !== 'instructor') return <Loading message="Redirecting..." className="min-h-screen" />;
  return (
    <div className="flex h-full">
      <div className="w-full overflow-y-auto">
        {/* Banner */}
        <div className="rounded-2xl overflow-hidden w-full">
          <Image
            src="/assets/images/banner-dashboard.png"
            alt="Dashboard Banner"
            width={1500}
            height={800}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="mt-6 space-y-6">
          {/* Stats */}
          <CourseDetail isLoading={isLoadingStats} stats={stats} />

          {/* Latest Course */}
          <CourseStatus
            isLoading={isLoadingCourse}
            role="instructor" 
            course={course || undefined}
            onContinue={({ courseId, status }) =>
              handleContinue({ courseId, status })
            }
          />

          {/* Student Statistic */}
          <StudentStatisticChart isLoading={isLoadingStudent} chartData={chartData} isInstructor={true} />

          {/* Revenue + Evaluation */}
          <div className="flex gap-6">
            <div className="w-[70%]">
              <RevenueStatisticChart />
            </div>
            <div className="w-[30%]">
              <div className="bg-white rounded-2xl p-4 w-full h-full flex flex-col">
                <EvalueStatistic />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
