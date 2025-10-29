'use client';

import React from 'react';
import { CheckCircle, Users } from 'lucide-react';

interface EmployeeAddedNotificationProps {
  employeeName: string;
  isVisible: boolean;
  onClose: () => void;
}

const EmployeeAddedNotification: React.FC<EmployeeAddedNotificationProps> = ({
  employeeName,
  isVisible,
  onClose
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right-2">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <CheckCircle className="h-6 w-6 text-green-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-blue-500" />
            <p className="text-sm font-medium text-gray-900">Employee Added to Group Chat</p>
          </div>
          <p className="text-sm text-gray-600">
            {employeeName} has been successfully added to the business group chat.
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="sr-only">Close</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EmployeeAddedNotification; 