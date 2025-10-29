import Image from 'next/image';
import { Star } from 'lucide-react';

export default function SuggestedCourse() {
  const courses = Array(5).fill({
    title: 'Figma UI UX Design Essentials',
    author: 'By Dao Tuan Kiet',
    rating: '4.5',
    image: '/assets/images/suggested-course.png',
  });

  return (
    <div className="max-w-full mx-auto p-4 bg-white rounded-2xl shadow-md border border-gray-200 w-[395px]">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold text-black">Suggested Course</h2>
        <a href="#" className="text-sm text-[#3858F8]">
          View all
        </a>
      </div>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="flex items-center gap-3">
            <Image
              src={course.image}
              alt="course"
              width={150}
              height={150}
              className="rounded-md object-cover"
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-black leading-snug">{course.title}</h3>
              <p className="text-xs text-gray-500">{course.publisher?.name}</p>
              <div className="flex items-center text-xs text-gray-700 gap-1 mt-1">
                <span>{course.rating}</span>
                <Star size={14} fill="#3858F8" color="#3858F8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
