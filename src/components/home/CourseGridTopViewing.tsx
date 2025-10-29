"use client";

import { Course } from '@/types/course';
import CourseCard from '@/components/common/CourseCard';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/utils/animations';
import Loading from '@/components/common/Loading';
import { useGetTopViewingQuery } from '@/lib/redux/features/course/courseApi';
import { useRouter } from 'next/navigation';
interface CourseGridProps {
  title: string;
}

const CourseGridTopViewing = ({ title }: CourseGridProps) => {
  const { data, isLoading, error } = useGetTopViewingQuery();
  const router = useRouter();


  // Get courses from response

  const courses = data?.success && Array.isArray(data.courses)
    ? data.courses.slice(0, 4)
    : [];

  if (isLoading) {
    return <Loading title={title} />;
  }

  if (error) {
    console.error('Error fetching courses:', error);
    return (
      <div className="py-10 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-medium mb-6">{title}</h2>
          <div className="text-center text-gray-500">Error loading courses</div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="py-10 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-medium mb-6">{title}</h2>
          <div className="text-center text-gray-500">No courses available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <AnimatedSection variants={fadeIn}>
          <h2 className="text-4xl md:text-4xl text-[#0D0D0D] mb-6">{title}</h2>
        </AnimatedSection>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {courses.map((course: Course, index: number) => (
            <motion.div
              key={course._id}
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
          <div
            className="text-blue-600 cursor-pointer hover:bg-blue-500 hover:text-white rounded-lg p-2 w-25"
            onClick={() => router.push('/courses?page=1')}
          >
            View More
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseGridTopViewing;