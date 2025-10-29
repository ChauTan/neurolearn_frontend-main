'use client';
import React, { useState, useEffect } from 'react';
import InstructorInfoCard from '@/components/instructor-detail/InstructorInfoCard';
import InstructorAbout from '@/components/instructor-detail/InstructorAbout';
import InstructorStats from '@/components/instructor-detail/InstructorStats';
import InstructorTabs from '@/components/instructor-detail/InstructorTabs';
import CourseCard from '@/components/instructor-detail/CourseCard';
import ReviewList from '@/components/instructor-detail/ReviewList';
import { Course, IReview } from '@/types/course';
import { User } from '@/types/user';
import Link from 'next/link';
import { getUserById } from '@/lib/services/user';

interface InstructorDetailPageClientProps {
  params: { id: string };
}

const InstructorDetailPageClient: React.FC<InstructorDetailPageClientProps> = ({ params }) => {
  const { id } = params;
  const [instructor, setInstructor] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [allReviews, setAllReviews] = useState<IReview[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'reviews'>('courses');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      (async () => {
        try {
          const user = await getUserById(id);
          if (user) {
            setInstructor(user);
            const courses = (user.uploadedCourses || []).map((course: any) => ({
              ...course,
              publisher: {
                name: user.name,
                avatar: user.avatar,
                email: user.email,
                profession: user.profession,
                description: user.introduce || "",
                rating: user.rating || 0,
                students: user.student || 0,
                courses: user.uploadedCourses?.length || 0,
              },
            }));
            setCourses(courses);
            const reviews = courses.flatMap((course: Course) => course.reviews || []);
            setAllReviews(reviews);
          } else {
            setInstructor(null);
          }
        } catch (error) {
          setInstructor(null);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center text-gray-500">
          <p className="text-lg">Loading Instructor Profile...</p>
          <p className="text-sm">Please wait a moment.</p>
        </div>
      </div>
    );
  }
  if (!instructor) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold">Instructor Not Found</h2>
          <p>The profile you are looking for does not exist or could not be loaded.</p>
          <Link href="/dashboard/teacher" className="mt-4 inline-block text-blue-500 hover:underline">
            &larr; Back to instructors list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl pt-16 sm:pt-20 p-6 md:p-8 relative ">
            <InstructorInfoCard instructor={instructor} />
          </div>
          <InstructorAbout introductionText={instructor.introduce} />
        </div>
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            <InstructorStats instructor={instructor} totalCourses={courses.length} />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <InstructorTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showSeeAll={activeTab === 'reviews'}
          onSeeAllClick={() => alert('Navigate to all reviews page')}
        />
        <div className="mt-6">
          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
          {activeTab === 'reviews' && <ReviewList reviews={allReviews} />}
        </div>
      </div>
    </div>
  );
};

export default InstructorDetailPageClient;
