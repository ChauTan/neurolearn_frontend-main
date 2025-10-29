'use client';
import { useEffect, useState } from 'react';
import HeaderBanner from './_components/HeaderBanner';
import StatCard from './_components/StatCard';
import LearningProgressChart from './_components/LearningProgressChart';
import Image from 'next/image';
import Book from '@/public/assets/business/book.svg';
import Award from '@/public/assets/business/award.svg';
import Teacher from '@/public/assets/business/teacher.svg';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { useBusinessGroupChat } from '@/hooks/useBusinessGroupChat';

interface DashboardData {
  totalEmployees: number;
  totalManagers: number;
  totalCourses: number;
  employeeMonthlyData: any[];
  managerMonthlyData: any[];
}

export default function DashboardPage({ params }: { params: Promise<{ businessId: string }> }) {
  return (
    <ErrorBoundary>
      <DashboardContent params={params} />
    </ErrorBoundary>
  );
}

function DashboardContent({ params }: { params: Promise<{ businessId: string }> }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string>('');

  // Sử dụng hook để tự động tạo business group chat
  const { error: groupChatError } = useBusinessGroupChat(businessId);

  useEffect(() => {
    const getParams = async () => {
      try {
        const resolvedParams = await params;
        setBusinessId(resolvedParams.businessId);
      } catch (err) {
        console.error('Error resolving params:', err);
        setError('Invalid business ID');
      }
    };
    getParams();
  }, [params]);

  // Log group chat status
  useEffect(() => {
    if (groupChatError) {
      console.warn('Business group chat error:', groupChatError);
    }
  }, [groupChatError]);

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
          `${apiUrl}/business/${businessId}/statistics`,
          {
            credentials: 'include',
            cache: 'no-store',
          }
        );

        if (!res.ok) {
          const errorText = await res.text().catch(() => res.statusText);
          throw new Error(`Failed to fetch statistics: ${res.status} - ${errorText}`);
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (businessId && businessId.trim() !== '') {
      fetchData();
    }
  }, [businessId]);

  if (loading) {
    return (
      <Loading message="Loading dashboard data..." />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading dashboard</h3>
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
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  const { totalEmployees, totalManagers, totalCourses, employeeMonthlyData, managerMonthlyData } = data;

  const statData = [
    {
      title: 'Total Employees',
      value: String(totalEmployees ?? 0),
      icon: <Image src={Book} alt="book" className="h-9 w-9 text-primary" />,
    },
    {
      title: 'Total Managers',
      value: String(totalManagers ?? 0),
      icon: <Image src={Teacher} alt="Teacher" className="h-9 w-9 text-primary" />,
    },
    {
      title: 'Total Courses',
      value: String(totalCourses ?? 0),
      icon: <Image src={Award} alt="Award" className="h-9 w-9 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto max-w-7xl space-y-6">
        <HeaderBanner businessId={businessId} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statData.map(stat => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
          ))}
        </div>

        <div className="grid grid-cols-1">
          <div className="lg:col-span-3">
            <LearningProgressChart employeeMonthlyData={employeeMonthlyData} managerMonthlyData={managerMonthlyData} />
          </div>
        </div>
      </div>
    </div>
  );
}
