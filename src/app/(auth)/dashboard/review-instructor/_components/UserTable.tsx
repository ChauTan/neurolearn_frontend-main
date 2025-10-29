'use client'
import React, { useState } from "react";
import ReviewTable from '@/components/review-common/ReviewTable';
import ReviewTableRow from '@/components/review-common/ReviewTableRow';
import { useGetPendingRequestsQuery, useHandleRequestMutation } from '@/lib/redux/features/api/apiSlice';

const headers = [
  { label: 'User', className: 'col-span-3' },
  { label: 'Company Name', className: 'col-span-3' },
  { label: 'Request Date', className: 'col-span-3' },
  { label: 'Approve', className: 'col-span-2' },
  { label: 'Reject', className: 'col-span-1' },
];

const UserTable = () => {
  const { data, isLoading, isError, refetch } = useGetPendingRequestsQuery({ type: 'instructor_verification' });
  const [handleRequest, { isLoading: isActionLoading }] = useHandleRequestMutation();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  return (
    <>
      {actionMessage && <div className="mb-4 text-center text-red-500">{actionMessage}</div>}
      <ReviewTable headers={headers}>
        {isLoading ? (
          <div className="text-center py-8 col-span-12">Loading...</div>
        ) : isError ? (
          <div className="text-center py-8 col-span-12 text-red-500">Error loading requests.</div>
          ) : !data?.success || !data?.data || data.data.length === 0 ? (
          <div className="text-center py-8 col-span-12 text-gray-500">No requests found.</div>
        ) : (
                data.data.map((user: any, idx: number) => (
            <ReviewTableRow key={user._id || user.id} index={idx}>
              {/* User */}
              <div className="col-span-3 flex items-center gap-3">
                <img src={user.avatar || user.avatarUrl || "/assets/images/avatar.png"} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" />
                <div>
                  <div className="font-semibold text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              {/* Company Name */}
              <div className="col-span-3 flex items-center">
                <span className="text-gray-700 font-medium">{user.companyName || user.businessName || 'N/A'}</span>
              </div>
              {/* Request Date */}
              <div className="col-span-3 flex items-center">
                <span className="text-gray-700 font-medium">{user.requestDate || (user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A')}</span>
              </div>
              {/* Approve */}
              <div className="col-span-2 flex items-center justify-center">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                  disabled={isActionLoading}
                  onClick={async () => {
                    setActionMessage(null);
                    try {
                      await handleRequest({ type: 'instructor_verification', requestId: user._id || user.id, action: 'approve' }).unwrap();
                      setActionMessage('Approved successfully!');
                      refetch();
                    } catch (err: any) {
                      setActionMessage('Approval failed!');
                    }
                  }}
                >
                  {isActionLoading ? 'Approving...' : 'Approve'}
                </button>
              </div>
              {/* Reject */}
              <div className="col-span-1 flex items-center justify-center">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                  disabled={isActionLoading}
                  onClick={async () => {
                    setActionMessage(null);
                    try {
                      await handleRequest({ type: 'instructor_verification', requestId: user._id || user.id, action: 'reject' }).unwrap();
                      setActionMessage('Rejected successfully!');
                      refetch();
                    } catch (err: any) {
                      setActionMessage('Rejection failed!');
                    }
                  }}
                >
                  {isActionLoading ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </ReviewTableRow>
          ))
        )}
      </ReviewTable>
    </>
  );
};

export default UserTable; 