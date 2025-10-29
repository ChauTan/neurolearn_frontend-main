import { Button } from '@/components/common/ui/Button2'; // Đảm bảo đường dẫn này đúng
import React from 'react';

const ReviewCourseHeader: React.FC = () => {
    return (
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900">Review Course</h1>
            <div className="flex space-x-4">
                {/* Nút Edit */}
                <Button
                    variant="outline" // Sử dụng variant "outline" của Button component
                    size="default" // Hoặc size nào phù hợp, "default" tương ứng với rounded px-9 py-3
                    className="px-6 py-2" // Giữ lại padding cũ nếu bạn muốn tùy chỉnh nhỏ hơn size "default"
                >
                    Edit
                </Button>

                {/* Nút Publish Course */}
                <Button
                    variant="default" // Sử dụng variant "default" của Button component (bg-[#3858F8] text-white)
                    size="default" // Hoặc size nào phù hợp
                    className="px-6 py-2" // Giữ lại padding cũ nếu bạn muốn tùy chỉnh nhỏ hơn size "default"
                // Bỏ 'text-gray-900' ở đây vì variant="default" đã có text-white
                >
                    Publish Course
                </Button>
            </div>
        </div>
    );
};

export default ReviewCourseHeader;