'use client';
import { useEffect, useState } from 'react';
import CourseCard from '@/components/business/CourseCard';
import Loading from '@/components/common/Loading';
import { CommonPagination } from '@/components/common/ui';

interface Business {
  courses: any[];
}

export default function MyCoursesListPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_SERVER_URI;
        if (!apiUrl) {
          throw new Error('API URL not configured');
        }

        const res = await fetch(`${apiUrl}/business/me`, {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) {
          const errorText = await res.text().catch(() => res.statusText);
          throw new Error(`Failed to fetch business data: ${res.status} - ${errorText}`);
        }

        const result = await res.json();
        setBusiness(result.business);
      } catch (err) {
        console.error('Error fetching business data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Loading message="Loading courses..." />
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading courses</h3>
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

  if (!business || !business.courses || business.courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No courses available</p>
        </div>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.ceil((business.courses?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCourses = business.courses?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {currentCourses.map((course: any) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {/* Pagination */}
      <CommonPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
