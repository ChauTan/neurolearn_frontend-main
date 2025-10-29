import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface WithdrawData {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  amount: number;
  status: string;
  requestedAt: string;
  reason?: string;
  adminNote?: string;
  approvedAt?: string;
  transactionId?: string;
}

interface WithdrawResponse {
  success: boolean;
  data: {
    withdraws: WithdrawData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

interface TransactionHistoryProps {
  refreshKey?: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ refreshKey }) => {
  const [withdraws, setWithdraws] = useState<WithdrawData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWithdrawHistory();
  }, [currentPage, statusFilter, refreshKey]);

  useEffect(() => {
    if (refreshKey !== undefined) {
      setCurrentPage(1);
    }
  }, [refreshKey]);

  const fetchWithdrawHistory = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/withdraw/my-requests?${params}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch withdraw history');
      }

      const data: WithdrawResponse = await response.json();

      if (data.success) {
        setWithdraws(data.data.withdraws);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        setWithdraws([]);
      }
    } catch (error) {
      console.error('Error fetching withdraw history:', error);
      setWithdraws([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-orange-500';
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleViewDetails = (withdraw: WithdrawData) => {
    setSelectedWithdraw(withdraw);
    setShowModal(true);
  };

  return (
    <section className="mt-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold leading-none text-stone-950">Withdraw History</h2>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mt-3">
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-neutral-500 pb-3 border-b border-zinc-300">
            <div className="col-span-3">Transaction Note</div>
            <div className="col-span-2 text-center">Bank Name</div>
            <div className="col-span-2 text-center">Amount</div>
            <div className="col-span-2 text-center">Date</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-1 text-center">Details</div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : withdraws.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No withdrawal requests found</div>
          ) : (
            <div className="space-y-0 mt-2">
                  {withdraws.map((withdraw, index) => (
                    <div key={withdraw._id}>
                  <div className="grid grid-cols-12 gap-4 items-center w-full text-sm py-4">
                    <div className="col-span-3 font-semibold text-stone-950">
                      {withdraw.reason || 'No reason provided'}
                    </div>
                    <div className="col-span-2 font-semibold text-stone-950 text-center">
                      {withdraw.bankName}
                    </div>
                    <div className="col-span-2 font-semibold text-stone-950 text-center">
                      {formatAmount(withdraw.amount)}
                    </div>
                    <div className="col-span-2 font-semibold text-stone-950 text-center">
                      {formatDate(withdraw.requestedAt)}
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <span className={`inline-block py-2 px-4 font-medium text-white text-center rounded-full text-xs min-w-[80px] ${getStatusColor(withdraw.status)}`}>
                        {withdraw.status}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleViewDetails(withdraw)}
                        className="p-1 rounded-full hover:bg-blue-50 transition-colors group"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
                      </button>
                    </div>
                  </div>
                  {index < withdraws.length - 1 && (
                    <hr className="border-t border-zinc-200" />
                  )}
                </div>
              ))}
                </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedWithdraw && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-8 backdrop-blur-sm bg-black/20">
            <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => {
                  setShowModal(false);
                  setSelectedWithdraw(null);
                }}
                aria-label="Close"
              >
                ×
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Withdrawal Details</h2>

              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Amount</div>
                    <div className="text-2xl font-bold text-blue-600">{formatAmount(selectedWithdraw.amount)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Status</div>
                    <span className={`inline-block py-2 px-4 font-medium text-white text-center rounded-full text-sm ${getStatusColor(selectedWithdraw.status)}`}>
                      {selectedWithdraw.status}
                    </span>
                  </div>
                </div>

                {/* Bank Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-gray-500 text-sm mb-2">Bank Information</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div><span className="text-gray-500">Bank:</span> <span className="font-medium">{selectedWithdraw.bankName}</span></div>
                    <div><span className="text-gray-500">Account Name:</span> <span className="font-medium">{selectedWithdraw.bankAccountName}</span></div>
                    <div><span className="text-gray-500">Account Number:</span> <span className="font-medium">{selectedWithdraw.bankAccountNumber}</span></div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Requested Date</div>
                    <div className="font-medium">{formatDate(selectedWithdraw.requestedAt)}</div>
                  </div>
                  {selectedWithdraw.approvedAt && (
                    <div>
                      <div className="text-gray-500 text-sm mb-1">Approved Date</div>
                      <div className="font-medium">{formatDate(selectedWithdraw.approvedAt)}</div>
                    </div>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <div className="text-gray-500 text-sm mb-1">Reason</div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {selectedWithdraw.reason || 'No reason provided'}
                  </div>
                </div>

                {/* Admin Note */}
                {selectedWithdraw.adminNote && (
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Admin Note</div>
                    <div className="bg-blue-50 rounded-lg p-3 text-blue-800">
                      {selectedWithdraw.adminNote}
                    </div>
                  </div>
                )}

                {/* Transaction ID */}
                {selectedWithdraw.transactionId && (
                  <div>
                    <div className="text-gray-500 text-sm mb-1">Transaction ID</div>
                    <div className="font-mono text-sm bg-gray-100 rounded-lg p-2">
                      {selectedWithdraw.transactionId}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};