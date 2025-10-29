'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ReviewHeader, ReviewPagination } from '@/components/review-common';
import { useGetPendingRequestsQuery, useHandleRequestMutation, useGetAllBusinessesQuery } from '@/lib/redux/features/api/apiSlice';
import { useToast } from '@/hooks/use-toast';
import BusinessCard from '@/components/business/BusinessCard';
import BusinessDetailsModal from '@/components/business/BusinessDetailsModal';
import BusinessRequestCard from './_components/BusinessRequestCard';
import { Business } from '@/types/business';
import Loading from '@/components/common/Loading';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { StatusBadge } from '@/components/review-common';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

// Business Request Modal Component using createPortal
const BusinessRequestModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selected: any;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}> = ({ isOpen, onClose, selected, onApprove, onReject }) => {
  if (!isOpen || !selected) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prepare data similar to "Show more" details in card
  const businessData = selected?.data || {};
  const userData = selected?.userId || {};
  const representativeData = businessData?.representative || {};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const modalContent = (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-[9999] p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-900">Business Request: {selected?.userId?.businessInfo?.businessId?.name || businessData?.businessName || selected?.userId?.name || 'N/A'}</h3>
        </div>
        {/* Business Request Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-[70%] space-y-6">
              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">User Information</h4>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={userData?.avatar?.url || userData?.avatar || "/assets/images/avatar.png"}
                    alt={userData?.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-lg">{userData?.name || 'N/A'}</div>
                    <div className="text-gray-500">{userData?.email || 'N/A'}</div>
                    <div className="text-sm text-gray-400">User ID: {userData?._id || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Registration Details (mirrors "Show more") */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Registration Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Information */}
                  <div className="space-y-3 text-sm">
                    <div className="font-semibold text-gray-900 text-base">Business Information</div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">Name:</span>
                      <span>{businessData?.businessName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">Sector:</span>
                      <span className="capitalize">{businessData?.businessSector || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">Email:</span>
                      <span>{businessData?.email || 'N/A'}</span>
                    </div>
                    {businessData?.taxCode && (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">Tax Code:</span>
                        <span>{businessData.taxCode}</span>
                      </div>
                    )}
                    {businessData?.address && (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">Address:</span>
                        <span>{businessData.address}</span>
                      </div>
                    )}
                    {selected?.businessId && (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">Business ID:</span>
                        <span className="font-mono text-xs">{selected.businessId}</span>
                      </div>
                    )}
                  </div>

                  {/* Representative and Account Owner */}
                  <div>
                    <div className="space-y-3 text-sm">
                      <div className="font-semibold text-gray-900 text-base">Representative Details</div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">Name:</span>
                        <span>{representativeData?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">Email:</span>
                        <span>{representativeData?.email || 'N/A'}</span>
                      </div>
                      {representativeData?.phone && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">Phone:</span>
                          <span>{representativeData.phone}</span>
                        </div>
                      )}
                      {representativeData?.address && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">Address:</span>
                          <span>{representativeData.address}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="font-medium text-gray-800 text-sm mb-2">Account Owner</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">Name:</span>
                          <span>{userData?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">Email:</span>
                          <span>{userData?.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">Role:</span>
                          <span className="capitalize">{userData?.role || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">Verified:</span>
                          <span className={userData?.isVerified ? 'text-green-600' : 'text-orange-600'}>
                            {userData?.isVerified ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description & Documents */}
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">Description</h4>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      {businessData?.description || 'No description provided.'}
                    </div>
                  </div>
                  {businessData?.logo && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-700">Business Logo:</div>
                      <div className="relative w-24 h-24">
                        <Image
                          src={businessData.logo}
                          alt="Business Logo"
                          width={96}
                          height={96}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    </div>
                  )}
                  {Array.isArray(businessData?.docImages) && businessData.docImages.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-700">Business Documents:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {businessData.docImages.map((doc: string, index: number) => (
                          <div key={index} className="relative">
                            <Image
                              src={doc}
                              alt={`Document ${index + 1}`}
                              width={150}
                              height={100}
                              className="w-full h-20 object-cover rounded-lg border border-gray-200"
                            />
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                              Doc {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="w-full lg:w-[30%] space-y-6">
              {/* Request Details */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 text-sm">Request Type:</span>
                    <div className="font-semibold text-blue-600">{selected?.type ? selected.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Business Verification'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Request Date:</span>
                    <div className="font-semibold">{selected?.createdAt ? new Date(selected.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Status:</span>
                    <div className="font-semibold">
                      <StatusBadge status={selected?.status || 'pending'} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Summary */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Request Type</span>
                    <span className="font-semibold">{selected?.type?.replace('_', ' ') || 'Business'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-semibold ${selected?.status === 'approved' ? 'text-green-600' : selected?.status === 'rejected' ? 'text-red-600' : 'text-orange-600'}`}>{selected?.status || 'Pending'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Business Sector</span>
                    <span className="font-semibold capitalize">{businessData?.businessSector || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="font-semibold">{selected?.createdAt ? formatDate(selected.createdAt) : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await onReject(selected._id || selected.id);
                  onClose();
                } catch (err: any) {
                  // Error handling will be done in parent component
                }
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Reject
            </button>
            <button
              onClick={async () => {
                try {
                  await onApprove(selected._id || selected.id);
                  onClose();
                } catch (err: any) {
                  // Error handling will be done in parent component
                }
              }}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render modal outside the parent layout
  return createPortal(modalContent, document.body);
};

const categories = ['All requests', 'UI/UX', 'Development', 'Data Science', 'Marketing', 'Creative'];
const statusOptions = ['all', 'pending', 'approved', 'rejected'];

const BusinessRequestsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All requests');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [businessPage, setBusinessPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [businessDetailsOpen, setBusinessDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'request' | 'business'>('request');
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
  // API call for business approval requests
  const { data: requestData, isLoading: isRequestLoading, refetch } = useGetPendingRequestsQuery({
    type: 'business_verification',
    status: selectedStatus
  });
  const [handleRequest] = useHandleRequestMutation();

  // API call for all businesses
  const { data: businessData, isLoading: isBusinessLoading } = useGetAllBusinessesQuery({
    page: businessPage,
    limit: 6,
    search: searchTerm
  });

  // Refetch when status changes
  useEffect(() => {
    refetch();
  }, [selectedStatus, refetch]);

  // Reset business page when search term changes
  useEffect(() => {
    if (activeTab === 'business') {
      setBusinessPage(1);
    }
  }, [searchTerm, activeTab]);

  // removed unused handleView

  const handleViewBusinessDetails = (business: Business) => {
    setSelectedBusiness(business);
    setBusinessDetailsOpen(true);
  };

  const handleApproveOrReject = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await handleRequest({ type: 'business_verification', requestId, action }).unwrap();
      setCurrentPage(1);
      // Refresh data to get latest status
      await refetch();
      toast({
        title: action === 'approve' ? 'Request Approved' : 'Request Rejected',
        description: action === 'approve'
          ? 'The business request has been approved successfully.'
          : 'The business request has been rejected successfully.',
        variant: 'success',
      });
    } catch (err: any) {
      toast({
        title: action === 'approve' ? 'Approval Failed' : 'Rejection Failed',
        description: err?.data?.message || err?.error || 'An error occurred while processing the request.',
        variant: 'destructive',
      });
    }
  };

  // Pagination component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pageNumbers = new Set<number>();
      pageNumbers.add(1);
      pageNumbers.add(totalPages);
      if (currentPage > 1) pageNumbers.add(currentPage - 1);
      pageNumbers.add(currentPage);
      if (currentPage < totalPages) pageNumbers.add(currentPage + 1);

      const sortedPages = Array.from(pageNumbers)
        .filter(p => p > 0 && p <= totalPages)
        .sort((a, b) => a - b);
      const finalPages: (number | string)[] = [];
      let lastPage = 0;

      for (const page of sortedPages) {
        if (lastPage !== 0 && page > lastPage + 1) {
          finalPages.push('...');
        }
        finalPages.push(page);
        lastPage = page;
      }
      return finalPages;
    };
   
    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => {
              if (typeof page === 'number') {
                setCurrentPage(page);
              }
            }}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === page
              ? 'text-blue-600 bg-blue-50 border border-blue-300'
              : page === '...'
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Extract data from API response
  const requests = requestData?.data || [];
  const itemsPerPage = 10;
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = requests.slice(startIndex, startIndex + itemsPerPage);
  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || role !== 'admin') return <Loading message="Redirecting..." className="min-h-screen" />;
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <ReviewHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          activeTab={activeTab}
          onTabChange={tab => setActiveTab(tab as 'request' | 'business')}
          tabOptions={[
            { value: 'request', label: 'Request' },
            { value: 'business', label: 'Business' },
          ]}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          statusOptions={statusOptions}
          showStatusFilter={activeTab === 'request'}
        />

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {activeTab === 'request' ? 'Business Requests' : 'All Businesses'}
        </h1>

        {activeTab === 'request' ? (
          <>
            {/* Business Request Cards Container */}
            <div className="space-y-6">
              {isRequestLoading ? (
                <Loading message="Loading requests..." size="sm" className="py-12" />
              ) : !requestData?.success || requests.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                    {searchTerm ? `No requests found matching "${searchTerm}"` : 'No requests found'}
                  </div>
                ) : (
                  currentRequests.map((request: any, index: number) => (
                    <BusinessRequestCard
                      key={request._id || request.id}
                      business={request}
                      index={index}
                      onPreview={() => {
                        setSelected(request);
                        setOpen(true);
                      }}
                      onReject={() => handleApproveOrReject(request._id, 'reject')}
                    />
                  ))
              )}
            </div>
            <PaginationComponent />
            {/* Business Request Modal using createPortal */}
            <BusinessRequestModal
              isOpen={open}
              onClose={() => setOpen(false)}
              selected={selected}
              onApprove={async (id: string) => {
                try {
                  await handleApproveOrReject(id, 'approve');
                } catch (err: any) {
                  toast({
                    title: 'Approval Failed',
                    description: err?.data?.message || err?.error || 'An error occurred while approving the request.',
                    variant: 'destructive',
                  });
                }
              }}
              onReject={async (id: string) => {
                try {
                  await handleApproveOrReject(id, 'reject');
                } catch (err: any) {
                  toast({
                    title: 'Rejection Failed',
                    description: err?.data?.message || err?.error || 'An error occurred while rejecting the request.',
                    variant: 'destructive',
                  });
                }
              }}
            />
          </>
        ) : (
          // Tab Business: Grid card view
          <>
            {isBusinessLoading ? (
              <Loading message="Loading businesses..." size="md" className="py-12" />
            ) : !businessData?.data || businessData.data.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No businesses found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {businessData.data.map((business) => (
                    <BusinessCard
                      key={business._id}
                      business={business}
                      onViewDetails={handleViewBusinessDetails}
                    />
                  ))}
                </div>
                {businessData.pagination && businessData.pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <ReviewPagination
                      currentPage={businessData.pagination.currentPage}
                      totalPages={businessData.pagination.totalPages}
                      onPageChange={setBusinessPage}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Business Details Modal */}
      <BusinessDetailsModal
        business={selectedBusiness}
        isOpen={businessDetailsOpen}
        onClose={() => setBusinessDetailsOpen(false)}
      />
    </div>
  );
};

export default BusinessRequestsPage; 