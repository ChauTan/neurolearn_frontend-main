import React from 'react';
import { CourseHeader } from './CourseHeader';
import { CourseDetails } from './CourseDetails';

import { Course } from '@/types/course';

interface CourseCardProps {
    course: Course;
    status?: string;
}


export const CourseCard: React.FC<CourseCardProps> = ({ course, status }) => {
    const {
        _id,
        name,
        thumbnail,
        category,
        purchased,
        createdAt,
        estimatedPrice,
        price,
    } = course;

    return (
        <article className="relative flex gap-2 p-3 w-[310px] h-[394px] bg-white rounded-[20px] shadow-md ">
            <div className="my-auto min-w-60 w-[332px]">
                <CourseHeader
                    courseId={_id.toString()}
                    thumbnailImage={typeof thumbnail === 'string' ? thumbnail : thumbnail?.url || ''}
                    category={typeof category === 'string' ? category : category?.title || 'Uncategorized'}
                    title={name}
                />
                <CourseDetails
                    memberCount={`Join ${purchased || 0}+ Member`}
                    creationDate={new Date(createdAt).toLocaleDateString('vi-VN')}
                    originalPrice={`${estimatedPrice || 0} VND`}
                    salePrice={`${price || 0} VND`}
                    status={status}
                />
            </div>
        </article>
    );
};

