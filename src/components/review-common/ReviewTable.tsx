import React from 'react';

interface ReviewTableProps {
  headers: { label: string; className?: string }[];
  children: React.ReactNode;
  className?: string;
}

const ReviewTable: React.FC<ReviewTableProps> = ({ headers, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
        {headers.map((header, index) => (
          <div key={index} className={`text-sm font-semibold text-gray-600 uppercase tracking-wide ${header.className || ''}`}>
            {header.label}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-50">
        {children}
      </div>
    </div>
  );
};

export default ReviewTable; 