'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Trash2, ChevronDown, ChevronUp, DollarSign, CreditCard, Calendar, User } from 'lucide-react';
import { StatusBadge } from '@/components/review-common';

interface WithdrawalRequestCardProps {
  withdrawal: any;
  onPreview: (withdrawal: any) => void;
  onReject: (id: string) => void;
  index: number;
}

export default function WithdrawalRequestCard({ withdrawal, onPreview, onReject, index }: WithdrawalRequestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
      {/* Main Row */}
      <div className="grid grid-cols-12 gap-8 px-8 py-8 items-start hover:bg-gray-50 transition-colors">
        {/* User Info */}
        <div className="col-span-3 flex items-center gap-4">
          {withdrawal.user?.avatar?.url ? (
            <Image
              src={withdrawal.user.avatar.url}
              alt="user avatar"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
              {(withdrawal.user?.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <div className="font-semibold text-gray-900 text-base leading-6">{withdrawal.user?.name || 'N/A'}</div>
            <div className="text-sm text-gray-500">{withdrawal.user?.email || 'N/A'}</div>
            <div className="text-xs text-blue-600 font-medium">User</div>
          </div>
        </div>

        {/* Amount & Bank Info */}
        <div className="col-span-4 flex items-center">
          <div className="space-y-2">
            <div className="font-semibold text-gray-900 text-base">{formatCurrency(withdrawal.amount)}</div>
            <div className="text-sm text-gray-500 line-clamp-1">{withdrawal.bankName || 'N/A'}</div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2 font-medium"
            >
              {isExpanded ? 'Show less' : 'Show more'}
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Request Date */}
        <div className="col-span-2 flex items-center">
          <span className="text-gray-700 font-medium text-sm">
            {withdrawal.requestedAt ? formatDate(withdrawal.requestedAt) : 'N/A'}
          </span>
        </div>

        {/* Status */}
        <div className="col-span-1 flex items-center justify-center">
          <StatusBadge status={withdrawal.status || 'pending'} />
        </div>

        {/* Action */}
        <div className="col-span-2 flex items-center justify-center gap-3">
          <button
            className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors shadow-sm"
            onClick={() => onPreview(withdrawal)}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors shadow-sm"
            onClick={() => onReject(withdrawal._id || withdrawal.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-8 pb-8 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {/* User Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">User Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Name: {withdrawal.user?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Email:</span>
                  <span>{withdrawal.user?.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">User ID:</span>
                  <span className="font-mono text-xs">{withdrawal.user?._id || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Bank Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span>Bank: {withdrawal.bankName || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Account Number:</span>
                  <span className="font-mono">{withdrawal.bankAccountNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Account Name:</span>
                  <span>{withdrawal.bankAccountName || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Request Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  <span>Amount: {formatCurrency(withdrawal.amount)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span>Requested: {withdrawal.requestedAt ? formatDate(withdrawal.requestedAt) : 'N/A'}</span>
                </div>
                {withdrawal.reason && (
                  <div className="space-y-1">
                    <span className="text-gray-500">Reason:</span>
                    <div className="text-gray-700 bg-gray-100 p-2 rounded text-xs">
                      {withdrawal.reason}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Request Meta Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 text-base">Withdrawal Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Request Type</div>
                <div className="font-semibold text-lg">Withdrawal</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Status</div>
                <div className={`font-semibold text-lg capitalize ${
                  withdrawal.status === 'approved' ? 'text-green-600' : 
                  withdrawal.status === 'rejected' ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {withdrawal.status || 'Pending'}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Amount</div>
                <div className="font-semibold text-lg">{formatCurrency(withdrawal.amount)}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Bank</div>
                <div className="font-semibold text-lg">{withdrawal.bankName || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
