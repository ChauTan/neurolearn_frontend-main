'use client';

import React from 'react';

interface Course {
  id: string;
  title: string;
  image: string;
  learners: { avatar: string }[];
  additionalLearners: number;
  category: string;
  enrollmentDate: string;
  status: 'Pending' | 'Learning' | 'Completed';
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Graphic Design Masterclass - Learn GREAT Design',
    image: '/assets/course-detail/icons/course-thumbnail.jpg',
    learners: [
      { avatar: '/assets/course-detail/icons/avatar1.jpg' },
      { avatar: '/assets/course-detail/icons/avatar2.jpg' },
      { avatar: '/assets/course-detail/icons/avatar3.jpg' },
    ],
    additionalLearners: 10,
    category: 'Design',
    enrollmentDate: '22 May, 2025',
    status: 'Pending',
  },
  {
    id: '2',
    title: 'Graphic Design Masterclass - Learn GREAT Design',
    image: '/assets/course-detail/icons/course-thumbnail.jpg',
    learners: [
      { avatar: '/assets/course-detail/icons/avatar1.jpg' },
      { avatar: '/assets/course-detail/icons/avatar2.jpg' },
      { avatar: '/assets/course-detail/icons/avatar3.jpg' },
    ],
    additionalLearners: 10,
    category: 'Design',
    enrollmentDate: '22 May, 2025',
    status: 'Learning',
  },
];

const StatusBadge: React.FC<{ status: Course['status'] }> = ({ status }) => {
  const getStatusConfig = (status: Course['status']) => {
    switch (status) {
      case 'Pending':
        return { bg: 'bg-gray-200', text: 'text-orange-500' };
      case 'Learning':
        return { bg: 'bg-gray-200', text: 'text-green-500' };
      case 'Completed':
        return { bg: 'bg-gray-200', text: 'text-blue-500' };
      default:
        return { bg: 'bg-gray-200', text: 'text-gray-500' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-4 py-2 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
};

const MyCoursesTable = () => {
  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="text-3xl font-medium text-black mb-6">My Courses</h3>

      {/* Table Header */}
      <div className="flex justify-between items-center py-4 border-b-2 border-gray-200 mb-6">
        <div className="text-gray-600 text-base font-medium w-1/3">Course Name</div>
        <div className="flex justify-between items-center w-2/3 px-4">
          <div className="text-gray-600 text-base font-medium">Learner</div>
          <div className="text-gray-600 text-base font-medium">Category</div>
          <div className="text-gray-600 text-base font-medium">Enrollment date</div>
          <div className="text-gray-600 text-base font-medium">Progress</div>
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-6">
        {mockCourses.map((course, index) => (
          <div key={course.id}>
            <div className="flex justify-between items-center py-4">
              {/* Course Info */}
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">NĐ DO</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-black leading-tight">{course.title}</h4>
                </div>
              </div>

              {/* Other Info */}
              <div className="flex justify-between items-center w-2/3 px-4">
                {/* Learners */}
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {course.learners.slice(0, 3).map((learner, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden"
                      >
                        <div className="w-full h-full bg-gray-400"></div>
                      </div>
                    ))}
                  </div>
                  <span className="ml-3 text-lg font-medium text-black">
                    +{course.additionalLearners}
                  </span>
                </div>

                {/* Category */}
                <div className="text-lg font-medium text-black">{course.category}</div>

                {/* Enrollment Date */}
                <div className="text-lg font-medium text-black">{course.enrollmentDate}</div>

                {/* Status */}
                <div>
                  <StatusBadge status={course.status} />
                </div>
              </div>
            </div>

            {/* Divider */}
            {index < mockCourses.length - 1 && <div className="border-b-2 border-gray-200"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCoursesTable;
