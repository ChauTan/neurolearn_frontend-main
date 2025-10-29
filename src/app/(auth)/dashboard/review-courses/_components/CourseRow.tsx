import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Course } from './types';
import Image from 'next/image';

interface CourseRowProps {
  course: Course;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
}

const CourseRow: React.FC<CourseRowProps> = ({ course, onView, onDelete }) => {
  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="col-span-4 flex items-center gap-3">
        <Image
          src={course.instructor.avatar}
          alt={course.instructor.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{course.instructor.name}</h3>
          <p className="text-sm text-gray-500">{course.instructor.email}</p>
        </div>
      </div>
      <div className="col-span-3 flex items-center">
        <h3 className="font-medium text-gray-900 line-clamp-2">{course.title}</h3>
      </div>
      <div className="col-span-2 flex items-center">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {course.category}
        </span>
      </div>
      <div className="col-span-2 flex items-center">
        <span className="text-gray-900 font-medium">{course.requestDate}</span>
      </div>
      <div className="col-span-1 flex items-center justify-center gap-2">
        <button
          onClick={() => onView(course.id)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Progress"
        >
          <Eye className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Course"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CourseRow;