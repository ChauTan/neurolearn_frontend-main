import React from 'react';
import LessonItem from './LessonItem';
import QuizItem from './QuizItem';  
import DocumentItem from './DocumentItem'; 

interface Lesson {
    id: string;
    type: 'video' | 'document' | 'quiz';
    title: string;
    url?: string;
    thumbnail?: string;
}

interface Section {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface CourseCurriculumSectionProps {
    curriculum: Section[];
}

const CourseCurriculumSection: React.FC<CourseCurriculumSectionProps> = ({ curriculum }) => {    
    return (
        <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                {' '}
                {/* Changed here */}
                Course Curriculum
            </h2>
            <div className="space-y-6">
                {curriculum.map(section => (
                    <div key={section.id} className="rounded-lg bg-secondary p-6 shadow-sm">
                        <h3 className="mb-4 text-xl font-semibold text-gray-900">
                            {' '}
                            {/* Changed here */}
                            {section.title}
                        </h3>
                        <div className="space-y-4">
                            {section.lessons.map((lesson, index) => {
                                const key = lesson.id || `${section.id}-lesson-${index}`;
                                switch (lesson.type) {
                                    case 'video':
                                        return <LessonItem key={key} lesson={lesson} />;
                                    case 'quiz':
                                        return <QuizItem key={key} lesson={lesson} />;
                                    case 'document':
                                        return <DocumentItem key={key} lesson={lesson} />;
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CourseCurriculumSection;