'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import CourseDetail from '@/components/dashboard/CourseDetail';
import CourseStatus from '@/components/dashboard/CourseStatus';
import RelatedCourses from '@/components/dashboard/RelatedCourses';
import StudentStatisticChart from '@/components/dashboard/StudentStatisticChart';
import UpcomingExam from '@/components/dashboard/UpcomingExam';
import Loading from '@/components/common/Loading';

export default function UserDashboard() {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const role = user?.role;
  const [ready, setReady] = useState(false);

  // Mark as client-ready to avoid hydration flicker
  useEffect(() => setReady(true), []);

  // Redirect when not user
  useEffect(() => {
    if (!ready) return;
    if (role === undefined) return;
    if (role !== 'user') {
      router.replace('/'); // send non-user to home
    }
  }, [ready, role, router]);


  // Redirect admin to course requests page
  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/dashboard/review-courses');
    }
  }, [user?.role, router]);

  useEffect(() => {
    if (!user?._id || user?.role === 'admin') return;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/users/dashboard/${user._id}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        );

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error('Fetch dashboard error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?._id]);

  const stats = [
    {
      label: 'Total Courses',
      icon: '/assets/icons/blue-book.svg',
      value: data?.stats?.totalCourses ?? 0,
      width: 50,
      height: 50,
    },
    {
      label: 'Completed',
      icon: '/assets/icons/teacher-fill.svg',
      value: data?.stats?.completedCourses ?? 0,
      width: 50,
      height: 50,
    },
    {
      label: 'Certificate',
      icon: '/assets/icons/award-fill.svg',
      value: data?.stats?.certificates ?? 0,
      width: 50,
      height: 50,
    },
    {
      label: 'Hour Spent',
      icon: '/assets/icons/clock-fill.svg',
      value: data?.stats?.hoursSpent ?? 0,
      width: 50,
      height: 50,
    },
  ];

  // UserDashboard.tsx
  const handleCourseCta = ({
    courseId,
    role,
    status,
    nextLessonId,
  }: {
    courseId: string;
    role: "user" | "instructor";
    status: string;
    nextLessonId?: string | null;
  }) => {
    if (!courseId) return;

    if (role === "instructor") {
      router.push(
        status === "draft"
          ? `/dashboard/courses/edit-course/${courseId}`
          : `/dashboard/courses/${courseId}`
      );
      return;
    }

    // role === "user"
    // Ưu tiên đi thẳng tới bài tiếp theo (nếu còn)
    if (nextLessonId) {
      router.push(`/watch-course/${courseId}/`);
      return;
    }

    // Hoàn thành 100% hoặc không có nextLesson -> tuỳ flow của bạn:
    // 1) Về trang tổng quan khoá học:
    router.push(`/watch-course/${courseId}`);
    // 2) Hoặc mở trang chứng chỉ (nếu có):
    // router.push(`/dashboard/certificates/${courseId}`);
  };
  if (isLoading) {
    return <Loading message="Loading dashboard..." className="min-h-screen" />;
  }

  // Don't render dashboard content for admin
  if (user?.role === 'admin') {
    return <Loading message="Redirecting..." className="min-h-screen" />;
  }
  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || role !== 'user') return <Loading message="Redirecting..." className="min-h-screen" />;

  return (
    <div className="flex h-full overflow-x-hidden">
      <div className="w-full overflow-y-auto">
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
          <CourseDetail isLoading={isLoading} stats={stats} />
          <CourseStatus
            isLoading={isLoading}
            role="user" // hoặc bỏ qua để auto-detect theo shape
            course={data?.latestCourse as any}
            onContinue={handleCourseCta}
          />
          <StudentStatisticChart
            isLoading={isLoading}
            chartData={data?.studentStats ?? []}
            isInstructor={!true} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="min-w-0">
              <div className="bg-white rounded-2xl p-4 w-full h-full flex flex-col">
                {isLoading ? (
                  <Loading message="Loading courses..." size="sm" className="min-h-[200px]" />
                ) : (
                  <RelatedCourses
                    courses={data?.relatedCourses || []}
                    title="Related Courses"
                    viewAllHref="/courses"
                  />
                )}
              </div>
            </div>
            <div className="min-w-0">
              <UpcomingExam items={data?.upcomingExams || []} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
