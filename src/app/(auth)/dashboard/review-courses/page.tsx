'use client'
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal } from 'lucide-react';
import { CommonPagination } from '@/components/common/ui';
import { useGetCoursesQuery } from '@/lib/redux/features/course/courseApi';
import { Course } from '@/types/course';
import Image from 'next/image';
import { useHandleRequestMutation } from '@/lib/redux/features/api/apiSlice';
import { useGetPendingCourseRequestsQuery } from '@/lib/redux/features/request/requestApi';
import CourseDetail from '@/components/course-detail/CourseDetail';
import CourseContent from '@/components/course-detail/CourseContent';
import PublisherCard from '@/components/course-detail/PublisherCard';
import OverView from '@/components/course-detail/OverView';
import InstructorInfo from '@/components/common/ui/InstuctorInfo';
// Removed unused StatusBadge import
import { useToast } from '@/hooks/use-toast';
import SearchCourseRequest from './_components/SearchCourseRequest';
import CourseRequestCard from './_components/CourseRequestCard';
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

// Modal Component using createPortal
const CoursePreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedRequest: any;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}> = ({ isOpen, onClose, selectedRequest, onApprove, onReject }) => {
  if (!isOpen || !selectedRequest) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-[9999] p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-900">Course Preview: {selectedRequest.data?.course?.name || selectedRequest.courseId?.name || 'N/A'}</h3>
        </div>
        {/* Course Preview Content using course-detail components */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-[70%] space-y-10">
              {/* Course Thumbnail */}
              <div className="w-full">
                <Image
                  src={selectedRequest.data?.course?.thumbnail?.url || selectedRequest.courseId?.thumbnail?.url || '/assets/business/book.svg'}
                  alt={selectedRequest.data?.course?.name || selectedRequest.courseId?.name || 'Course thumbnail'}
                  width={1200}
                  height={480}
                  className="w-full h-64 object-cover rounded-4xl"
                />
              </div>
              {/* Instructor Info */}
              <InstructorInfo
                courseName={selectedRequest.data?.course?.name || selectedRequest.courseId?.name || 'N/A'}
                instructor={selectedRequest.userId}
              />
              {/* Description Section */}
              <div>
                <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
                <div className="text-gray-700 text-base leading-relaxed space-y-4 mb-6">
                  <p>{selectedRequest.data?.course?.description || selectedRequest.courseId?.description || 'No description provided by instructor.'}</p>
                  <a href="#" className="inline-block text-blue-600 font-medium hover:underline">
                    View all &gt;
                  </a>
                </div>
              </div>
              {/* Course Detail */}
              <CourseDetail
                course={{
                  ...(selectedRequest.data?.course || selectedRequest.courseId || {}),
                  sections: selectedRequest.data?.sections || selectedRequest.courseId?.sections || []
                }}
              />
              {/* Course Content */}
              <CourseContent
                sections={(selectedRequest.data?.sections || selectedRequest.courseId?.sections || []).map((section: any) => ({
                  ...section,
                  lessons: (section.lessons || []).map((lesson: any) => ({
                    ...lesson,
                    videoUrl: lesson.videoUrl || null,
                    videoLength: lesson.videoLength || null,
                    isFree: lesson.isFree || false
                  }))
                }))}
              />
            </div>
            {/* RIGHT SIDEBAR */}
            <div className="w-full lg:w-[30%] space-y-15">
              <PublisherCard
                author={selectedRequest.userId}
                updatedAt={selectedRequest.data?.course?.updatedAt ? new Date(selectedRequest.data.course.updatedAt) : (selectedRequest.courseId?.updatedAt ? new Date(selectedRequest.courseId.updatedAt) : undefined)}
              />
              <OverView
                title={selectedRequest.data?.course?.name || selectedRequest.courseId?.name || 'N/A'}
                overview={selectedRequest.data?.course?.overview || selectedRequest.data?.course?.description || selectedRequest.courseId?.description || 'N/A'}
              />
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t mt-10">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await onReject(selectedRequest._id || selectedRequest.id);
                } catch (err: any) {
                  // Error handling will be done in parent component
                }
              }}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={async () => {
                try {
                  await onApprove(selectedRequest._id || selectedRequest.id);
                } catch (err: any) {
                  // Error handling will be done in parent component
                }
              }}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
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

const CourseManagementSystem: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  type TabType = 'request' | 'courses';
  const [activeTab, setActiveTab] = useState<TabType>('request');
  const [authorNames, setAuthorNames] = useState<{ [id: string]: string }>({});
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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


  // API call
  const { data, isLoading, isError } = useGetCoursesQuery();
  const courses: Course[] = data?.courses || [];

  // API call for course approval requests - using the new detailed endpoint
  const { data: requestData, isLoading: isRequestLoading, refetch } = useGetPendingCourseRequestsQuery({
    type: 'course_approval',
  });
  const [handleRequest] = useHandleRequestMutation();

  // Refetch when status changes
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Ensure requestData is always an array
  const requestArray = Array.isArray(requestData) ? requestData : ((requestData as any)?.data || []);

  // Filter requests by search term
  const filteredRequests = requestArray.filter((req: any) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return true; // Show all requests when no search term
    }

    // Use the new data structure with fallbacks to old structure
    const courseName = req.data?.course?.name || req.courseId?.name || '';
    const instructorName = req.userId?.name || '';
    const instructorEmail = req.userId?.email || '';
    const courseDescription = req.data?.course?.description || req.courseId?.description || '';
    const courseSubTitle = req.data?.course?.subTitle || req.courseId?.subTitle || '';

    const searchLower = searchTerm.toLowerCase().trim();
    const matchesSearch = courseName.toLowerCase().includes(searchLower) ||
      instructorName.toLowerCase().includes(searchLower) ||
      instructorEmail.toLowerCase().includes(searchLower) ||
      courseDescription.toLowerCase().includes(searchLower) ||
      courseSubTitle.toLowerCase().includes(searchLower);

    return matchesSearch;
  });

  // Filter and map data for courses
  const filteredCourses = courses.filter(course => {
    // Handle search - if searchTerm is empty, always match
    if (!searchTerm || searchTerm.trim() === '') {
      return true; // Show all courses when no search term
    }

    const searchLower = searchTerm.toLowerCase().trim();

    // Safely extract course properties
    const courseName = (course?.name || '').toLowerCase();
    const publisherName = (course?.publisher?.name || '').toLowerCase();
    const courseDescription = (course?.description || '').toLowerCase();
    const courseOverview = (course?.overview || '').toLowerCase();
    const courseSubtitle = (course?.subTitle || '').toLowerCase();

    // Handle tags - they can be string[] or undefined
    const courseTags = Array.isArray(course?.tags)
      ? course.tags.join(' ').toLowerCase()
      : '';

    // Handle category - can be string or object
    const categoryName = typeof course?.category === 'object' && course?.category
      ? (course.category.title || '').toLowerCase()
      : typeof course?.category === 'string'
        ? course.category.toLowerCase()
        : '';

    // Search in multiple fields
    const matchesSearch = courseName.includes(searchLower) ||
      publisherName.includes(searchLower) ||
      courseDescription.includes(searchLower) ||
      courseOverview.includes(searchLower) ||
      courseSubtitle.includes(searchLower) ||
      courseTags.includes(searchLower) ||
      categoryName.includes(searchLower);

    // Fallback: try partial matching for short search terms
    const partialMatch = searchLower.length >= 3 && (
      courseName.indexOf(searchLower) !== -1 ||
      publisherName.indexOf(searchLower) !== -1 ||
      courseTags.indexOf(searchLower) !== -1
    );

    const finalMatch = matchesSearch || partialMatch;
    const matchesCategory = true;

    return finalMatch && matchesCategory;
  });

  const requestItemsPerPage = 6;
  const coursesItemsPerPage = 6;
  const itemsPerPage = activeTab === 'request' ? requestItemsPerPage : coursesItemsPerPage;

  // Calculate pagination based on active tab
  const totalItems = activeTab === 'request' ? filteredRequests.length : filteredCourses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Get current items based on active tab
  const currentRequests = activeTab === 'request'
    ? filteredRequests.slice(startIndex, startIndex + itemsPerPage)
    : [];
  const currentCourses = activeTab === 'courses'
    ? filteredCourses.slice(startIndex, startIndex + itemsPerPage)
    : [];

  useEffect(() => {
    const ids = currentCourses
      .map(course => course.publisher?._id || course.publisher?.name || (course as any).authorId?._id || (course as any).authorId?.name)
      .filter(Boolean);
    const idsToFetch = ids.filter(id => !(id in authorNames));
    if (idsToFetch.length === 0) return;
    Promise.all(
      idsToFetch.map(id =>
        fetch(`/api/users/${id}`)
          .then(res => res.json())
          .then(data => ({ id, name: data.name || 'N/A' }))
          .catch(() => ({ id, name: 'N/A' }))
      )
    ).then(results => {
      setAuthorNames(prev => {
        const updated = { ...prev };
        results.forEach(({ id, name }) => {
          updated[id] = name;
        });
        return updated;
      });
    });
  }, [currentCourses, authorNames]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleApproveOrReject = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await handleRequest({ type: 'course_approval', requestId, action }).unwrap();
      setCurrentPage(1);
      await refetch();
      toast({
        title: action === 'approve' ? 'Course Approved' : 'Request Rejected',
        description: `${action === 'approve' ? 'The course request has been approved.' : 'The course request has been rejected successfully.'}`,
        variant: 'success',
      });
    } catch (err: any) {
      toast({
        title: action === 'approve' ? 'Approval Failed' : 'Rejection Failed',
        description: err?.data?.message || err?.error || 'An error occurred while approving/rejecting the request.',
        variant: 'destructive',
      });
    }
  };

  // Pagination component
  const PaginationComponent = () => {
    return (
      <CommonPagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    );
  };
  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || role !== 'admin') return <Loading message="Redirecting..." className="min-h-screen" />;
  if (isLoading) return <Loading message="Loading courses..." className="min-h-screen" />;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading courses.</div>;

  // If no courses found in active tab
  if (activeTab === 'courses' && filteredCourses.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header with Search and Filters */}
          <div className="flex items-center justify-between mb-8">
            <SearchCourseRequest
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activeTab={activeTab}
            />
            <div className="flex gap-3">
              <button
                className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl ${(activeTab as TabType) === 'request'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                  }`}
                onClick={() => handleTabChange('request')}
              >
                Request
              </button>
              <button
                className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl ${activeTab === 'courses'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                  }`}
                onClick={() => handleTabChange('courses')}
              >
                Courses
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse The Course</h1>
          <div className="text-center py-16 bg-white rounded-xl shadow-sm mt-8">
            <h3 className="mt-2 text-lg font-semibold text-gray-800">No Courses Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? (
                <>
                  No courses found matching{ }
                  <span className="font-medium text-black">&quot{searchTerm}&quot</span>. Try adjusting your search.
                </>
              ) : (
                'There are no courses to display.'
              )}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 text-xs text-gray-400">
                <p>Debug: Total courses available: {courses.length}</p>
                <p>Search term: &quot;{searchTerm}&quot;</p>
                <p>Active tab: {activeTab}</p>
                {courses.length > 0 && (
                  <div className="mt-2">
                    <p>Sample course names:</p>
                    <ul className="text-left max-w-md mx-auto">
                      {courses.slice(0, 3).map((course, i) => (
                        <li key={i} className="truncate">- {course.name}</li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setSearchTerm(courses[0]?.name?.substring(0, 5) || '')}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded"
                    >
                      Test Search with &#39;{courses[0]?.name?.substring(0, 5)}&#39;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Search and Filters */}
        <div className="flex items-center justify-between mb-8">
          <SearchCourseRequest
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeTab={activeTab}
          />
          <div className="flex gap-3">
            <button
              className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl ${activeTab === 'request'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                }`}
              onClick={() => handleTabChange('request')}
            >
              Request
            </button>
            <button
              className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all hover:shadow-xl ${activeTab === 'courses'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                }`}
              onClick={() => handleTabChange('courses')}
            >
              Courses
            </button>
          </div>
        </div>
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-10">Browse The Course</h1>
        {/* Tab content */}
        {activeTab === 'request' ? (
          <>
            {/* Request Cards Container */}
            <div className="space-y-6">
              {isRequestLoading ? (
                <Loading message="Loading requests..." size="sm" className="py-12" />
              ) : !requestData?.success || !currentRequests || currentRequests.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                    {searchTerm ? `No requests found matching "${searchTerm}"` : 'No requests found'}
                  </div>
                ) : (
                    currentRequests.map((req: any, index: number) => (
                      <CourseRequestCard
                        key={req._id || req.id}
                        request={req}
                        index={index}
                        onPreview={(request) => {
                          setSelectedRequest(request);
                          setIsModalOpen(true);
                        }}
                        onReject={async (id) => {
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
                  ))
              )}
            </div>
          </>
        ) : (
          // Grid card view for Courses tab
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourses.map((course) => {
                const authorId = course.publisher?._id || (course as any).authorId?._id;
                const authorName = course.publisher?.name || (course as any).authorId?.name || (authorId ? authorNames[authorId] || '...' : 'N/A');
                return (
                  <div key={course._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-blue-100 p-0 flex flex-col">
                    {/* Banner Image */}
                    <div className="relative">
                      <Image
                        src={typeof course.thumbnail === 'string' ? course.thumbnail : (course.thumbnail?.url || '/assets/business/book.svg')}
                        alt="Course Banner"
                        width={1280}
                        height={320}
                        className="w-full h-32 object-cover rounded-t-2xl border-b-2 border-blue-100"
                      />
                      {/* More button */}
                      <button className="absolute top-3 right-3 bg-white rounded-full p-1 shadow hover:bg-gray-100">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      {/* Category */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-4 h-4 flex items-center justify-center">
                          <Image src="/assets/icons/blue-book.svg" alt="icon" width={16} height={16} />
                        </span>
                        <span className="text-xs text-blue-600 font-medium">
                          {Array.isArray(course.tags)
                            ? course.tags.join(', ')
                            : (typeof course.tags === 'string' ? course.tags : '')}
                        </span>
                      </div>
                      {/* Title */}
                      <div className="font-bold text-base text-gray-900 mb-3 leading-tight line-clamp-2 min-h-[36px]">{course.name}</div>
                      {/* Tag */}
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">Tags: </span>
                        <span className="text-xs text-gray-700">
                          {Array.isArray(course.tags)
                            ? course.tags.join(', ')
                            : (typeof course.tags === 'string' ? course.tags : '')}
                        </span>
                      </div>
                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                        {/* People */}
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">People</div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-800 font-semibold">
                              {authorName}
                            </span>
                          </div>
                        </div>
                        {/* Creation Date */}
                        <div className="items-end text-right flex flex-col justify-end">
                          <div className="text-xs text-gray-500 mb-0.5">Creation Date</div>
                          <div className="text-xs text-gray-800 font-semibold">{course.createdAt ? new Date(course.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</div>
                        </div>
                        {/* Sale */}
                        <div>
                          <div className="text-xs text-gray-500 mb-0.5">Sale</div>
                          <div className="flex flex-col items-start">
                            <span className="text-xs text-gray-400 line-through">{course.estimatedPrice ? course.estimatedPrice.toLocaleString('vi-VN') + ' VND' : 'N/A'}</span>
                            <span className="text-lg text-blue-600 font-bold leading-tight">{course.price ? course.price.toLocaleString('vi-VN') + ' VND' : 'N/A'}</span>
                          </div>
                        </div>
                        {/* Status */}
                        <div className="flex flex-col items-end justify-end text-right">
                          <div className="text-xs text-gray-500 mb-0.5 pr-11">Status</div>
                          <button className="px-4 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors cursor-default min-w-[80px] text-center ml-0">
                            {course.isPublished ? 'Published' : 'Pending'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        )}
        {/* Pagination */}
        <PaginationComponent />
      </div>

      {/* Preview Modal using createPortal */}
      <CoursePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRequest={selectedRequest}
        onApprove={async (id: string) => {
          try {
            await handleApproveOrReject(id, 'approve');
          } catch (err: any) {
            toast({
              title: 'Approval Failed',
              description: err?.data?.message || err?.error || 'An error occurred while approving the course.',
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
    </div>
  );
};

export default CourseManagementSystem;