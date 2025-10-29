'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog } from '@headlessui/react';
import { useGetPendingRequestsQuery } from '@/lib/redux/features/api/apiSlice';
import SearchInstructorRequest from './_components/SearchInstructorRequest';
import InstructorRequestCard from './_components/InstructorRequestCard';
import Loading from '@/components/common/Loading';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';


interface InstructorData {
  _id: string;
  name: string;
  email: string;
  profession?: string;
  role?: string;
  phoneNumber?: string;
  dob?: string;
  address?: string;
  experience?: string;
  companies?: string;
  introduce?: string;
  description?: string;
  avatar?: {
    url?: string;
  };
  rating?: number;
  student?: number;
}

const ReviewInstructorPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'requests' | 'instructors'>('requests');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorData | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [instructors, setInstructors] = useState<InstructorData[]>([]);
  const [isInstructorLoading, setIsInstructorLoading] = useState(false);
  const [instructorError, setInstructorError] = useState('');
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
    if (role !== 'admin') {
      // router.replace('/'); // send non-admin to home
    }
  }, [ready, role, router]);


  // API call for instructor verification requests
  const { data: requestData, isLoading: isRequestLoading, refetch } = useGetPendingRequestsQuery({
    type: 'instructor_verification'
  });

  // Ensure requestData is always an array
  const requestArray = Array.isArray(requestData) ? requestData : ((requestData as any)?.data || []);

  // Filter and paginate requests
  const filteredRequests = requestArray.filter((request: any) => {
    const user = request.userId;
    const requestData = request.data;
    const matchesSearch = user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requestData?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requestData?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch
  });

  const requestsPerPage = 6;
  const requestTotalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const requestStartIndex = (currentPage - 1) * requestsPerPage;
  const currentRequests = filteredRequests.slice(requestStartIndex, requestStartIndex + requestsPerPage);

  // Fetch instructors when tab is 'instructors'
  useEffect(() => {
    if (activeTab === 'instructors') {
      setIsInstructorLoading(true);
      setInstructorError('');
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/users/get-instructors`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.instructors)) {
            setInstructors(data.instructors);
          } else {
            setInstructors([]);
            setInstructorError('No data');
          }
        })
        .catch(() => {
          setInstructors([]);
          setInstructorError('Error loading instructors');
        })
        .finally(() => setIsInstructorLoading(false));
    }
  }, [activeTab]);

  // Filter instructors based on search term and category
  const filteredInstructors = instructors.filter((instructor) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return true; // Show all instructors when no search term
    }

    const searchLower = searchTerm.toLowerCase().trim();
    const instructorName = (instructor.name || '').toLowerCase();
    const instructorEmail = (instructor.email || '').toLowerCase();
    const instructorProfession = (instructor.profession || '').toLowerCase();
    const instructorRole = (instructor.role || '').toLowerCase();

    const matchesSearch = instructorName.includes(searchLower) ||
      instructorEmail.includes(searchLower) ||
      instructorProfession.includes(searchLower) ||
      instructorRole.includes(searchLower);

    return matchesSearch
  });

  // Pagination for instructors
  const instructorsPerPage = 6;
  const instructorTotalPages = Math.ceil(filteredInstructors.length / instructorsPerPage);
  const instructorStartIndex = (currentPage - 1) * instructorsPerPage;
  const currentInstructors = filteredInstructors.slice(instructorStartIndex, instructorStartIndex + instructorsPerPage);

  const handleTabChange = (tab: 'requests' | 'instructors') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle instructor verification action
  const handleInstructorAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/request/instructor-verification/${requestId}/action`, {
        method: 'PUT',
        credentials: 'include', // Use HttpOnly cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: action === 'approve' ? 'Request Approved' : 'Request Rejected',
          description: action === 'approve'
            ? 'The instructor request has been approved successfully.'
            : 'The instructor request has been rejected successfully.',
          variant: 'success',
        });
        setCurrentPage(1);
        await refetch();
      } else {
        throw new Error(result.message || 'Failed to process request');
      }
    } catch (err: any) {
      toast({
        title: action === 'approve' ? 'Approval Failed' : 'Rejection Failed',
        description: err?.message || 'An error occurred while processing the request.',
        variant: 'destructive',
      });
    }
  };

  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || role !== 'admin') return <Loading message="Redirecting..." className="min-h-screen" />;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search and Filters */}
        <div className="flex items-center justify-between mb-8 text-black">
          <SearchInstructorRequest
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeTab={activeTab}
            searchPlaceholder="Search instructors requests"
          />
          <div className="flex gap-3">
            <button
              className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl ${activeTab === 'requests'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                }`}
              onClick={() => handleTabChange('requests')}
            >
              Request
            </button>
            <button
              className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl ${activeTab === 'instructors'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                }`}
              onClick={() => handleTabChange('instructors')}
            >
              Instructors
            </button>
          </div>
        </div>
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse The Instructor</h1>
        {/* Tab content */}
        {activeTab === 'requests' ? (
          <>
            {/* Request Cards Container */}
            <div className="space-y-6">
              {isRequestLoading ? (
                <Loading message="Loading requests..." size="sm" className="py-12" />
              ) : (Array.isArray(requestData) ? false : ((requestData as any) && (requestData as any).success === false && (requestData as any).message === 'No pending requests found')) || !currentRequests || currentRequests.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                    {searchTerm ? `No requests found matching "${searchTerm}"` : 'No data'}
                  </div>
                ) : (
                    currentRequests.map((request: any, index: number) => (
                      <InstructorRequestCard
                        key={request._id}
                        request={request}
                        index={index}
                        onPreview={(request) => {
                          setSelectedRequest(request);
                          setIsRequestModalOpen(true);
                        }}
                        onReject={(id) => handleInstructorAction(id, 'reject')}
                      />
                    ))
              )}
            </div>
            {/* Pagination for requests */}
            {requestTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                {Array.from({ length: requestTotalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === page ? 'text-blue-600 bg-blue-50 border border-blue-300' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(requestTotalPages, p + 1))}
                  disabled={currentPage === requestTotalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            {/* Modal for instructor details */}
            <Dialog open={false} onClose={() => { }} className="fixed z-40 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 py-8 backdrop-blur-sm bg-black/20">
                <Dialog.Panel className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-0 relative">
                  {/* selectedRequest && ( // This line was removed as per the new_code, as the state variable was removed. */}
                  <>
                    {/* Header: Avatar, Name, Subtitle */}
                    <div className="flex flex-col items-center pt-8 pb-4 px-8">
                      {/* selectedRequest.userId?.avatar ? ( // This line was removed as per the new_code, as the state variable was removed. */}
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 border-4 border-white shadow">
                        {/* selectedRequest.userId?.name ? selectedRequest.userId.name.charAt(0).toUpperCase() : 'U'} // This line was removed as per the new_code, as the state variable was removed. */}
                      </div>
                      {/* ) : ( // This line was removed as per the new_code, as the state variable was removed. */}
                      {/* <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 border-4 border-white shadow"> */}
                      {/* {selectedRequest.userId?.name ? selectedRequest.userId.name.charAt(0).toUpperCase() : 'U'} */}
                      {/* </div> */}
                      {/* )} */}
                      <div className="mt-4 text-2xl font-bold text-gray-900">{/* selectedRequest.userId?.name || selectedRequest.data?.fullName || 'N/A'} // This line was removed as per the new_code, as the state variable was removed. */}</div>
                      <div className="text-gray-500 text-base mt-1">{/* selectedRequest.userId?.profession || selectedRequest.data?.role || selectedRequest.data?.category || 'Instructor'} // This line was removed as per the new_code, as the state variable was removed. */}</div>
                    </div>
                    {/* 2 columns info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-8 pb-4">
                      <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                        <div><span className="text-xs text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{/* selectedRequest.data?.phone || 'N/A'} // This line was removed as per the new_code, as the state variable was removed. */}</span></div>
                        <div><span className="text-xs text-gray-500">Email Address:</span> <span className="font-medium text-gray-900">{/* selectedRequest.userId?.email || selectedRequest.data?.email || 'N/A'} // This line was removed as per the new_code, as the state variable was removed. */}</span></div>
                        <div><span className="text-xs text-gray-500">Date Born:</span> <span className="font-medium text-gray-900">{/* selectedRequest.data?.dob || 'N/A'} // This line was removed as per the new_code, as the state variable was removed. */}</span></div>
                        <div><span className="text-xs text-gray-500">Address:</span> <span className="font-medium text-gray-900">{/* selectedRequest.data?.address || 'N/A'} // This line was removed as per the new_code, as the state variable was removed. */}</span></div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                        <div><span className="text-xs text-gray-500">Experience:</span> <span className="font-medium text-gray-900">{/* selectedRequest.data?.experience || 'N/A'} // This line was removed as per the new_code, as the state variable was removed. */}</span></div>
                        <div><span className="text-xs text-gray-500">Roles:</span> <span className="font-medium text-gray-900">{/* selectedRequest.data?.role || 'N/A'} // This line was removed as per the new_code, as the state variable was removed. */}</span></div>
                        <div><span className="text-xs text-gray-500">Companies:</span> <span className="font-medium text-gray-900">{/* selectedRequest.data?.companies || selectedRequest.data?.company || 'N/A'} // This line was removed as per the new_code, as the state variable was removed. */}</span></div>
                      </div>
                    </div>
                    {/* About Me */}
                    <div className="px-8 pb-4">
                      <div className="font-semibold text-lg mb-1">About Me</div>
                      <div className="bg-gray-50 rounded-2xl p-4 text-gray-700 text-sm min-h-[60px]">
                        {/* selectedRequest.data?.description || selectedRequest.userId?.introduce || 'N/A'} // This line was removed as per the new_code, as the state variable was removed. */}
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 px-8 py-6 bg-white rounded-b-3xl">
                      <button
                        className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition"
                        onClick={async () => {
                          // if (!selectedRequest) return; // This line was removed as per the new_code, as the state variable was removed.
                          await handleInstructorAction(/* selectedRequest._id */ '', 'reject'); // This line was removed as per the new_code, as the state variable was removed.
                          // setIsModalOpen(false); // This line was removed as per the new_code, as the state variable was removed.
                        }}
                      >
                        Reject
                      </button>
                      <button
                        className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        onClick={async () => {
                          // if (!selectedRequest) return; // This line was removed as per the new_code, as the state variable was removed.
                          await handleInstructorAction(/* selectedRequest._id */ '', 'approve'); // This line was removed as per the new_code, as the state variable was removed.
                          // setIsModalOpen(false); // This line was removed as per the new_code, as the state variable was removed.
                        }}
                      >
                        Approve
                      </button>
                    </div>
                    <button
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                      onClick={() => { }} // This line was removed as per the new_code, as the state variable was removed.
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </>
                  {/* )} */}
                </Dialog.Panel>
              </div>
            </Dialog>
          </>
        ) : (
          <>
            {isInstructorLoading ? (
              <Loading message="Loading instructors..." size="sm" className="py-8" />
            ) : instructorError ? (
              <div className="text-center py-8 text-gray-500">{instructorError}</div>
            ) : currentInstructors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? `No instructors found matching "${searchTerm}"` : 'No data'}
                    </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentInstructors.map((ins) => (
                  <div key={ins._id} className="bg-white rounded-3xl shadow-sm flex flex-col items-center p-6">
                    {ins.avatar?.url ? (
                      <img src={ins.avatar.url} alt={ins.name} className="w-20 h-20 rounded-full object-cover mb-4" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600 mb-4">
                        {ins.name ? ins.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="font-bold text-lg text-gray-900 text-center">{ins.name}</div>
                    <div className="text-gray-500 text-sm mb-2 text-center">{ins.profession || ins.role || 'INSTRUCTOR'}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 font-semibold">{ins.rating ?? 4.5}</span>
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                      <span className="text-gray-500 text-sm">{ins.student ?? 0} Students</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="px-5 py-1.5 rounded-full bg-gray-100 text-blue-600 font-medium text-[15px] hover:bg-blue-50 transition" onClick={() => { setSelectedInstructor(ins); setIsProfileModalOpen(true); }}>View profile</button>
                      <button className="px-5 py-1.5 rounded-full bg-blue-600 text-white font-medium text-[15px] hover:bg-blue-700 transition">Registration file</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Pagination for instructors */}
            {instructorTotalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                {Array.from({ length: instructorTotalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${currentPage === page ? 'text-blue-600 bg-blue-50 border border-blue-300' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(instructorTotalPages, p + 1))}
                  disabled={currentPage === instructorTotalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
        {/* Request Details Modal */}
        {isRequestModalOpen && selectedRequest && (
          <Dialog open={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} className="fixed z-40 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8 backdrop-blur-sm bg-black/20">
              <Dialog.Panel className="bg-white rounded-3xl shadow-xl max-w-4xl w-full p-0 relative">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                  <h3 className="text-2xl font-bold text-gray-900">Instructor Request Details</h3>
                  <button
                    onClick={() => setIsRequestModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Content */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT COLUMN */}
                    <div className="w-full lg:w-[70%] space-y-6">
                      {/* User Info */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">User Information</h4>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-2xl">
                              {selectedRequest.userId?.name ? selectedRequest.userId.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{selectedRequest.userId?.name || selectedRequest.data?.fullName}</div>
                            <div className="text-gray-500">{selectedRequest.userId?.email || selectedRequest.data?.email}</div>
                            <div className="text-sm text-gray-400">User ID: {selectedRequest.userId?._id}</div>
                          </div>
                        </div>
                      </div>
                      {/* Request Details */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Request Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Full Name:</span>
                            <div className="font-medium">{selectedRequest.data?.fullName || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Email:</span>
                            <div className="font-medium">{selectedRequest.data?.email || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Phone Number:</span>
                            <div className="font-medium">{selectedRequest.data?.phoneNumber || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Date of Birth:</span>
                            <div className="font-medium">{selectedRequest.data?.dob || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Address:</span>
                            <div className="font-medium">{selectedRequest.data?.address || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Category:</span>
                            <div className="font-medium">{selectedRequest.data?.category || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Experience:</span>
                            <div className="font-medium">{selectedRequest.data?.experience || 'N/A'} years</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Company:</span>
                            <div className="font-medium">{selectedRequest.data?.company || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                      {/* Description */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Description</h4>
                        <div className="text-gray-700">
                          {selectedRequest.data?.description || 'No description provided.'}
                        </div>
                      </div>
                      {/* Documents */}
                      {selectedRequest.data?.documents && selectedRequest.data.documents.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Documents</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {selectedRequest.data.documents.map((doc: string, index: number) => (
                              <div key={index} className="bg-white rounded-lg p-4 border">
                                <img src={doc} alt={`Document ${index + 1}`} className="w-full h-32 object-cover rounded" />
                                <div className="mt-2 text-sm text-gray-600">Document {index + 1}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* RIGHT SIDEBAR */}
                    <div className="w-full lg:w-[30%] space-y-6">
                      {/* Request Status */}
                      <div className="bg-blue-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-blue-900 mb-4">Request Status</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-blue-600">Status:</span>
                            <div className="font-medium text-blue-900 capitalize">{selectedRequest.status || 'pending'}</div>
                          </div>
                          <div>
                            <span className="text-sm text-blue-600">Request Date:</span>
                            <div className="font-medium text-blue-900">
                              {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-end gap-4 pt-6 border-t mt-6">
                    <button
                      onClick={() => setIsRequestModalOpen(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await handleInstructorAction(selectedRequest._id, 'reject');
                        setIsRequestModalOpen(false);
                      }}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Reject
                    </button>
                    <button
                      onClick={async () => {
                        await handleInstructorAction(selectedRequest._id, 'approve');
                        setIsRequestModalOpen(false);
                      }}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
        {isProfileModalOpen && selectedInstructor && (
          <Dialog open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} className="fixed z-40 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8 backdrop-blur-sm bg-black/20">
              <Dialog.Panel className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-0 relative">
                {/* Header: Avatar, Name, Subtitle */}
                <div className="flex flex-col items-center pt-8 pb-4 px-8">
                  {selectedInstructor.avatar?.url ? (
                    <img src={selectedInstructor.avatar.url} alt={selectedInstructor.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 border-4 border-white shadow">
                      {selectedInstructor.name ? selectedInstructor.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div className="mt-4 text-2xl font-bold text-gray-900">{selectedInstructor.name}</div>
                  <div className="text-gray-500 text-base mt-1">{selectedInstructor.profession || selectedInstructor.role || 'Instructor'}</div>
                </div>
                {/* 2 columns info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-8 pb-4">
                  <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                    <div><span className="text-xs text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{selectedInstructor.phoneNumber || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500">Email Address:</span> <span className="font-medium text-gray-900">{selectedInstructor.email || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500">Date Born:</span> <span className="font-medium text-gray-900">{selectedInstructor.dob || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500">Address:</span> <span className="font-medium text-gray-900">{selectedInstructor.address || 'N/A'}</span></div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                    <div><span className="text-xs text-gray-500">Experience:</span> <span className="font-medium text-gray-900">{selectedInstructor.experience || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500">Roles:</span> <span className="font-medium text-gray-900">{selectedInstructor.role || 'N/A'}</span></div>
                    <div><span className="text-xs text-gray-500">Companies:</span> <span className="font-medium text-gray-900">{selectedInstructor.companies || 'N/A'}</span></div>
                  </div>
                </div>
                {/* About Me */}
                <div className="px-8 pb-4">
                  <div className="font-semibold text-lg mb-1">About Me</div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-gray-700 text-sm min-h-[60px]">
                    {selectedInstructor.introduce || selectedInstructor.description || 'N/A'}
                  </div>
                </div>
                {/* Certificate Images (placeholder) */}
                <div className="px-8 pb-8">
                  <div className="font-semibold text-lg mb-1">Certificate Images</div>
                  <div className="flex gap-4 overflow-x-auto">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-xl font-bold border border-dashed border-gray-300">
                        CERTIFICATE
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                  onClick={() => setIsProfileModalOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ReviewInstructorPage;
