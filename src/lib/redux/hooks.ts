import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { useEffect, useState } from 'react';
import { useGetAllSectionsQuery } from '@/lib/redux/features/course/section/sectionApi';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export interface Lesson {
  id: string;
  type: 'video' | 'document' | 'quiz';
  title: string;
  url?: string;
  thumbnail?: string;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export function useLessonsBySections(courseId: string) {
  const {
    data: sectionData,
    isLoading: loadingSections,
    isError: errorSections,
  } = useGetAllSectionsQuery(courseId);

  const [curriculum, setCurriculum] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all lessons manually
  useEffect(() => {
    const fetchLessons = async () => {
      if (!sectionData?.data) return;

      const { data: sections } = sectionData;

      const promises = await Promise.all(
        sections.map(async section => {
          // Call the actual fetch using RTK fetchBaseQuery here
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URI}/lessons/section/${section._id}`,
            {
              credentials: 'include',
            }
          );
          const json = await res.json();
          const lessons = (json?.data || []).map((lesson: any) => ({
            id: lesson._id,
            type: lesson.type || 'video',
            title: lesson.title,
            url: lesson.videoUrl?.url || '',
            thumbnail: lesson.thumbnail || '',
          }));

          return {
            id: section._id,
            title: section.title,
            lessons,
          };
        })
      );

      setCurriculum(promises);
      setIsLoading(false);
    };

    if (sectionData?.data) {
      fetchLessons();
    }
  }, [sectionData]);

  return {
    curriculum,
    isLoading: loadingSections || isLoading,
    isError: errorSections,
  };
}
