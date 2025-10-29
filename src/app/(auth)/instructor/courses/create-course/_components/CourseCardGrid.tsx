"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { useGetUserCoursesQuery } from "@/lib/redux/features/course/courseApi";
import { useGetInstructorCourseRequestsQuery } from "@/lib/redux/features/request/requestApi";
import Loading from "@/components/common/Loading";
import { CommonPagination } from "@/components/common/ui";

const ITEMS_PER_PAGE = 6;

interface CourseCardGridProps {
  searchTerm?: string;
}

const CourseCardGrid: React.FC<CourseCardGridProps> = ({ searchTerm = "" }) => {
  const router = useRouter();
  const {
    data: courseData,
    isLoading: loadingCourses,
    isError,
    error: courseError,
  } = useGetUserCoursesQuery();
  const {
    data: requestData,
    isLoading: loadingRequests,
  } = useGetInstructorCourseRequestsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const handleOpenCreateCourse = () => {
    router.push("/instructor/courses/create-course");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const mergedCourses = useMemo(() => {
    const coursesSrc = courseData?.data || [];
    const requests = requestData?.data || [];

    let courses = coursesSrc.map((course: any) => {
      const req = requests.find((r: any) => r.courseId?._id === course._id);

      let status = "Draft";
      if (course.isPublished) status = "Published";
      if (req?.status === "pending") status = "Pending";
      if (req?.status === "rejected") status = "Rejected";

      return { ...course, status };
    });

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      courses = courses.filter((c: any) => (c.name || "").toLowerCase().includes(q));
    }

    return courses;
  }, [courseData, requestData, searchTerm]);

  if (loadingCourses || loadingRequests) {
    return <Loading message="Loading courses..." className="min-h-[calc(100vh-200px)]" />;
  }

  const isNotFound = (courseError as any)?.status === 404;
  if (isError && !isNotFound) {
    return <p className="text-center text-red-500">Something went wrong while loading courses.</p>;
  }

  // Empty state (không có course nào và cũng không phải do search lọc hết)
  const hasAnyCourse = (courseData?.data || []).length > 0;
  if (!hasAnyCourse && !searchTerm.trim()) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-8">
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No courses yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first course.
        </p>
        <div className="mt-6">
          <button
            onClick={handleOpenCreateCourse}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle size={18} className="-ml-1 mr-2" />
            Create Course
          </button>
        </div>
      </div>
    );
  }

  // Không tìm thấy theo từ khóa
  if (searchTerm.trim() && mergedCourses.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-8">
        <h3 className="mt-2 text-lg font-semibold text-gray-800">
          No courses match “{searchTerm}”
        </h3>
        <p className="mt-1 text-sm text-gray-500">Try a different keyword.</p>
        <div className="mt-6">
          <button
            onClick={handleOpenCreateCourse}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle size={18} className="-ml-1 mr-2" />
            Create Course
          </button>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(mergedCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCourses = mergedCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="w-full min-h-screen">
      <div className="flex flex-col justify-between min-h-[900px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full flex-1">
          {currentCourses.map((course: any) => (
            <div key={course._id} className="relative">
              <CourseCard course={course} status={course.status} />
            </div>
          ))}
        </div>

        <CommonPagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
};

export default CourseCardGrid;
