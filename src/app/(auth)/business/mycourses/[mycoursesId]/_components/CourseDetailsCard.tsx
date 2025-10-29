import Image from 'next/image';


interface CourseDetailsCardProps {
  course: any;
  learners: any;
}

const CourseDetailsCard: React.FC<CourseDetailsCardProps> = ({
  course
}) => {

  return (
    <div className="bg-white p-6 rounded-2xl flex flex-col lg:flex-row gap-6">
      {/* Phần image chính và thông tin khóa học giữ nguyên */}
      <Image
        // src={course.thumbnail.url || ImageCourse} // Sử dụng ảnh mặc định nếu không có
        src={course?.thumbnail?.url} // Sử dụng ảnh mặc định nếu không có
        alt={course.name}
        width={400}
        height={213}
        className="rounded-2xl  w-full lg:w-[400px]"
      />
      <div className="flex-1 flex flex-col justify-between gap-5">
        <div>
          <h1 className="text-2xl font-semibold text-black">{course.name}</h1>
          <p className="text-gray-500 mt-1" title={course.description}>
            {course.description && course.description.length > 50
              ? `${course.description.slice(0, 50)}...`
              : course.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-4 text-sm">
          {/* Các thông tin khác giữ nguyên */}
          <div className="flex flex-col gap-1">
            <span className="text-gray-500">Total Licenses</span>
            <span className="font-medium text-black">{course.totalLicenses}</span>
          </div>
        </div>

        {/* Phần progress bar giữ nguyên */}
        <div className="flex items-end justify-between gap-4">
          {/* <div className="w-full">
            <span className="font-medium text-black">Completed Course:</span>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-[#3858F8] h-3 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-[#3858F8] font-medium text-xl">{progress}%</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsCard;
