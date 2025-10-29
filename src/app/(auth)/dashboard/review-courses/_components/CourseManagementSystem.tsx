import React, { useState } from 'react';
import {
  Search, Eye, Trash2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { Course } from './types';

interface CourseManagementSystemProps {
  courses: Course[];
}

const CourseManagementSystem: React.FC<CourseManagementSystemProps> = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All courses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Xóa khai báo hoặc gán giá trị cho biến setCourses

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All courses' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteCourse = (courseId: number) => {
    console.log(`Deleting course with ID: ${courseId}`);
  };

  const handleViewProgress = (courseId: number) => {
    console.log(`Viewing progress for course ID: ${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header + Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="border rounded px-3 py-1"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <select
              className="ml-4 border rounded px-3 py-1"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {['All courses', 'UI/UX', 'Development', 'Data Science', 'Marketing', 'Creative'].map(cat => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Request</button>
            <button className="bg-white border px-4 py-2 rounded">Courses</button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-4">Browse The Course</h2>

        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 font-semibold text-gray-600 border-b pb-2">
          <div>Instructor</div>
          <div>Course Title</div>
          <div>Category</div>
          <div>Request Date</div>
          <div>Progress</div>
          <div></div>
        </div>

        {/* Table Body */}
        <div>
          {currentCourses.map(course => (
            <div key={course.id} className="grid grid-cols-6 gap-4 items-center py-3 border-b">
              <div className="flex items-center gap-2">
                <Image
                  src={course.instructor.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium">{course.instructor.name}</div>
                  <div className="text-xs text-gray-400">{course.instructor.email}</div>
                </div>
              </div>
              <div>{course.title}</div>
              <div>{course.category}</div>
              <div>{course.requestDate}</div>
              <div>
                <button onClick={() => handleViewProgress(course.id)}>
                  <Eye className="w-5 h-5 text-blue-500" />
                </button>
              </div>
              <div>
                <button onClick={() => handleDeleteCourse(course.id)}>
                  <Trash2 className="w-5 h-5 text-orange-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          <span>{currentPage}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="disabled:opacity-50"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseManagementSystem; 