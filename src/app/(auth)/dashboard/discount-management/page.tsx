'use client';

import React, { useState, useEffect } from 'react';
import { ReviewModal } from '@/components/review-common';
import { CommonPagination } from '@/components/common/ui';
import { 
  useGetAllDiscountsQuery, 
  useCreateDiscountMutation, 
  useUpdateDiscountMutation, 
  useDeleteDiscountMutation 
} from '@/lib/redux/features/api/apiSlice';
import { useToast } from '@/hooks/use-toast';
import DiscountCard from '@/components/discount/DiscountCard';
import DiscountForm from '@/components/discount/DiscountForm';
import { Discount, CreateDiscountRequest } from '@/types/discount';
import Loading from '@/components/common/Loading';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const DiscountManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const { toast } = useToast();
 const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.role;
  const [ready, setReady] = useState(false);

  // Mark as client-ready to avoid hydration flicker
  useEffect(() => setReady(true), []);

  // Redirect when not admin
  useEffect(() => {
    if (!ready) return;
    if (role === undefined) return;
    if (role !== 'admin') {
      router.replace('/'); // send non-admin to home
    }
  }, [ready, role, router]);
  const queryParams = {
    page: currentPage,
    limit: 6,
    search: searchTerm,
    // You can add more filters here if your API supports
  };

  const { data: discountData, isLoading: isDiscountLoading, refetch, error } = useGetAllDiscountsQuery(queryParams);
  const [createDiscount, { isLoading: isCreating }] = useCreateDiscountMutation();
  const [updateDiscount, { isLoading: isUpdating }] = useUpdateDiscountMutation();
  const [deleteDiscount] = useDeleteDiscountMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleViewDetails = (discount: Discount) => {
    setSelectedDiscount(discount);
    setOpen(true);
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setIsFormOpen(true);
  };

  const handleDelete = async (discount: Discount) => {
    if (window.confirm(`Are you sure you want to delete the discount "${discount.name}"?`)) {
      try {
        await deleteDiscount(discount._id).unwrap();
        toast({
          title: 'Discount Deleted',
          description: 'The discount has been deleted successfully.',
          variant: 'success',
        });
        refetch();
      } catch (err: any) {
        toast({
          title: 'Delete Failed',
          description: err?.data?.message || 'Failed to delete discount.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCreateNew = () => {
    setEditingDiscount(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateDiscountRequest) => {
    try {
      if (editingDiscount) {
        await updateDiscount({ id: editingDiscount._id, ...data }).unwrap();
        toast({
          title: 'Discount Updated',
          description: 'The discount has been updated successfully.',
          variant: 'success',
        });
      } else {
        await createDiscount(data).unwrap();
        toast({
          title: 'Discount Created',
          description: 'The discount has been created successfully.',
          variant: 'success',
        });
      }
      setIsFormOpen(false);
      setEditingDiscount(null);
      refetch();
    } catch (err: any) {
      toast({
        title: editingDiscount ? 'Update Failed' : 'Creation Failed',
        description: err?.data?.message || 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingDiscount(null);
  };

  const isFormLoading = isCreating || isUpdating;
  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || role !== 'admin') return <Loading message="Redirecting..." className="min-h-screen" />;
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search and Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 w-full text-black">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search discounts..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-gray-50 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-100 h-10 text-black"
              />
            </div>
            <button
              onClick={handleCreateNew}
              className="ml-auto px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              + Create New Discount
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Discount Management</h1>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {isDiscountLoading ? (
            <Loading message="Loading discounts..." size="lg" className="min-h-[calc(100vh-300px)]" />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Discounts</h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">We encountered an issue while loading your discounts. Please try again.</p>
              <button 
                onClick={() => refetch()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
            ) : !discountData?.data || discountData.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l7-3 7 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Discounts Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or create your first discount to get started.</p>
            </div>
          ) : (
            <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {discountData?.data?.map((discount: Discount) => (
                  <DiscountCard
                    key={discount._id}
                    discount={discount}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
                    {/* Pagination */}
                    {discountData?.data && discountData.data.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                        <CommonPagination
                          page={discountData.currentPage || currentPage}
                          totalPages={discountData.totalPages || Math.ceil(discountData.data.length / 6)}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Discount Details Modal */}
      <ReviewModal 
        open={open} 
        onClose={() => setOpen(false)} 
        title="Discount Details" 
        maxWidth="max-w-5xl"
      >
        {selectedDiscount && (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDiscount.name}</h2>
                  <p className="mt-1 text-gray-600">{selectedDiscount.description || 'No description provided'}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDiscount.accessType === 'public' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedDiscount.accessType}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDiscount.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedDiscount.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Discount Code Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-600 mb-2">Discount Code</label>
                <div className="inline-flex items-center bg-white border-2 border-dashed border-gray-300 rounded-lg px-6 py-4">
                  <code className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                    {selectedDiscount.code}
                  </code>
                </div>
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-700 mb-2">
                  {selectedDiscount.discountType === 'percentage' ? `${selectedDiscount.amount}%` : `$${selectedDiscount.amount}`}
                </div>
                <div className="text-sm font-medium text-green-600 uppercase tracking-wide">
                  {selectedDiscount.discountType} Off
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-700 mb-2">
                  {selectedDiscount.usageLimit || '∞'}
                </div>
                <div className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                  Usage Limit
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-700 mb-2">
                  {selectedDiscount.courseIds.length}
                </div>
                <div className="text-sm font-medium text-purple-600 uppercase tracking-wide">
                  Applicable Courses
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-orange-700 mb-2">
                  ${selectedDiscount.minOrderAmount || 0}
                </div>
                <div className="text-sm font-medium text-orange-600 uppercase tracking-wide">
                  Minimum Order
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6m4-6v6m1-10V7a3 3 0 00-3-3H9a3 3 0 00-3 3v4a1 1 0 001 1h8a1 1 0 001-1z" />
                    </svg>
                    Discount Configuration
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Type</span>
                      <span className="text-sm text-gray-900 capitalize font-semibold">{selectedDiscount.discountType}</span>
                    </div>
                    {selectedDiscount.maxDiscountAmount && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Maximum Discount</span>
                        <span className="text-sm text-gray-900 font-semibold">${selectedDiscount.maxDiscountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Minimum Order Amount</span>
                      <span className="text-sm text-gray-900 font-semibold">${selectedDiscount.minOrderAmount || 0}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Access Control
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Allowed Users</span>
                      <span className="text-sm text-gray-900 font-semibold">{selectedDiscount.allowedUsers?.length || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Allowed Businesses</span>
                      <span className="text-sm text-gray-900 font-semibold">{selectedDiscount.allowedBusinesses?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10l4-2 4 2V11" />
                    </svg>
                    Validity Period
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Start Date</span>
                      <span className="text-sm text-gray-900 font-semibold">
                        {selectedDiscount.startDate ? new Date(selectedDiscount.startDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">End Date</span>
                      <span className="text-sm text-gray-900 font-semibold">
                        {selectedDiscount.endDate ? new Date(selectedDiscount.endDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Timestamps
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Created</span>
                      <span className="text-sm text-gray-900 font-semibold">
                        {selectedDiscount.createdAt ? new Date(selectedDiscount.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Last Updated</span>
                      <span className="text-sm text-gray-900 font-semibold">
                        {selectedDiscount.updatedAt ? new Date(selectedDiscount.updatedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ReviewModal>

      {/* Discount Form Modal */}
      <ReviewModal 
        open={isFormOpen} 
        onClose={handleFormCancel} 
        title={editingDiscount ? 'Edit Discount' : 'Create New Discount'} 
        maxWidth="max-w-4xl"
      >
        <DiscountForm
          discount={editingDiscount || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isFormLoading}
        />
      </ReviewModal>
    </div>
  );
};

export default DiscountManagementPage;