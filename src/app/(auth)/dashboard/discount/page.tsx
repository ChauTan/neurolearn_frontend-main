'use client';

import DiscountTable from '@/components/dashboard/DiscountTable';
import React, { useState, useEffect } from 'react';
import Loading from '@/components/common/Loading';
import { CommonPagination } from '@/components/common/ui';

interface Discount {
  _id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  amount: number; 
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

const ITEMS_PER_PAGE = 6;

export default function Page() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setIsLoading(true);
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/discount/available`,
                {
                  credentials: 'include',
                    cache: 'no-store',
                  }
                );

          if (!res.ok) throw new Error(`Failed to fetch discounts: ${res.statusText}`);

          const { discounts: fetchedDiscounts } = await res.json();
          setDiscounts(fetchedDiscounts || []);
        } catch (error) {
          console.error('Error fetching discounts:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDiscounts();
    }, []);

  const totalPages = Math.ceil(discounts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDiscounts = discounts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (isLoading) {
    return <Loading message="Loading discounts..." />;
  }

    return (
        <div className="flex h-screen w-full rounded-2xl">
        <div className="w-full overflow-y-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Discount Management</h1>
                </div>

                {/* Discount Table */}
                <div className="w-full">
            <DiscountTable discounts={currentDiscounts as Discount[]} />
          </div>

          {/* Pagination Controls */}
          <CommonPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
            </div>
        </div>
    );
} 