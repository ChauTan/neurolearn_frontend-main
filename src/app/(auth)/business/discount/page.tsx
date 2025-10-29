'use client';
import { useEffect, useState } from 'react';
import DiscountTable from '@/components/dashboard/DiscountTable';
import React from 'react';
import Loading from '@/components/common/Loading';
import { CommonPagination } from '@/components/common/ui';

interface Discount {
  _id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  amount: number; // từ backend
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  courseIds?: string[];
  createdAt: string;
}

export default function Page() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_SERVER_URI;
        if (!apiUrl) {
          throw new Error('API URL not configured');
        }

        const res = await fetch(
          `${apiUrl}/discount/available`,
          {
            credentials: 'include',
            cache: 'no-store',
          }
        );

        if (!res.ok) {
          const errorText = await res.text().catch(() => res.statusText);
          throw new Error(`Failed to fetch discounts: ${res.status} - ${errorText}`);
        }

        const result = await res.json();
        setDiscounts(result.discounts || []);
      } catch (err) {
        console.error('Error fetching discounts:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch discounts';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full rounded-2xl">
        <div className="w-full overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Discount Management</h1>
          </div>
          <Loading message="Loading certificates..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full rounded-2xl">
        <div className="w-full overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Discount Management</h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading discounts</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!discounts || discounts.length === 0) {
    return (
      <div className="flex h-screen w-full rounded-2xl">
        <div className="w-full overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Discount Management</h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No discounts available</h3>
              <p className="text-gray-600">There are no discounts to display at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full rounded-2xl">
      <div className="w-full overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Discount Management</h1>
        </div>

        {/* Discount Table */}
        <div className="w-full">
          <DiscountTable discounts={discounts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)} />
        </div>

        {/* Pagination */}
        <CommonPagination
          page={currentPage}
          totalPages={Math.ceil(discounts.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
} 