'use client';

import { useGetCourseByIdQuery } from '@/lib/redux/features/course/courseApi';
import { useParams } from 'next/navigation';
import Image from 'next/image';

import CourseContent from '@/components/course-detail/CourseContent';
import CourseDetail from '@/components/course-detail/CourseDetail';
import InstructorInfo from '@/components/common/ui/InstuctorInfo';
import OverView from '@/components/course-detail/OverView';
import PublisherCard from '@/components/course-detail/PublisherCard';
import Rating from '@/components/course-detail/Rating';
import Review from '@/components/course-detail/Review';
import CourseCard from '@/components/course-detail/CourseCard';
import { IReview, ISection } from '@/types/course';
import CourseGrid from '@/components/course-detail/CourseGrid';

export default function CourseDetailsPage() {
  const { id } = useParams();
  const {
    data: response,
    isLoading: loading,
    error,
  } = useGetCourseByIdQuery(id as string);

  const course = response?.courses;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold text-red-500">
          {error ? JSON.stringify(error) : 'Course not found'}
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full py-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-[70%] space-y-10">
            {/* Course Thumbnail */}
            <Image
              src={course.thumbnail?.url || '/placeholder-course.jpg'}
              alt={course.name}
              width={1200}
              height={480}
              className="rounded-4xl object-cover"
            />
            {/* Instructor Info */}
            <InstructorInfo courseName={course.name} instructor={course.publisher} />
            {/* Description Section */}
            <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
            <div className="text-gray-700 text-base leading-relaxed space-y-4 mb-6">
              <p>{course?.description || 'No description provided by instructor.'}</p>
            </div>
            {/* Course Detail */}
            <CourseDetail course={course} />
            {/* Course Content */}
            <CourseContent sections={course.sections as ISection[]} showVideo={false} />
            {/* Reviews */}
            <Review reviews={course.reviews as IReview[]} />
          </div>
          {/* RIGHT SIDEBAR */}
          <div className="w-full lg:w-[30%] space-y-15">
            <CourseCard course={course} />
            <Rating rating={course.rating as number} />
            <PublisherCard author={course.publisher} updatedAt={course.updatedAt ? new Date(course.updatedAt) : undefined} />
            <OverView title={course.name} overview={course.overview} />
            {/* Learners are viewing */}
          </div>
        </div>
      </div>
      <CourseGrid title="Learners are viewing" />
    </div>
  );
}
