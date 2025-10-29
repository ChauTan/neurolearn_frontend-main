'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CourseDetailsCard from './_components/CourseDetailsCard';
import LearnerList from './_components/LearnerList';

interface CourseData {
  course: any;
  learners: any[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const [data, setData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mycoursesId = params.mycoursesId as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_SERVER_URI;
        if (!apiUrl) {
          throw new Error('API URL not configured');
        }

        const res = await fetch(
          `${apiUrl}/business/courses/${mycoursesId}/detail`,
          {
            credentials: 'include',
            cache: 'no-store',
          }
        );

        if (!res.ok) {
          const errorText = await res.text().catch(() => res.statusText);
          throw new Error(`Failed to fetch course detail: ${res.status} - ${errorText}`);
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching course detail:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (mycoursesId) {
      fetchData();
    }
  }, [mycoursesId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading course</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No course data available</p>
        </div>
      </div>
    );
  }

  const { course, learners } = data;

  return (
    <div className="min-h-screen">
      <div className="flex flex-col gap-8">
        <CourseDetailsCard course={course} learners={learners} />
        <LearnerList learners={learners} />
      </div>
    </div>
  );
}
