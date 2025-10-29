import React from 'react';

interface ReviewTableRowProps {
  children: React.ReactNode;
  index: number;
  className?: string;
}

const ReviewTableRow: React.FC<ReviewTableRowProps> = ({ children, index, className = '' }) => {
  return (
    <div className={`grid grid-cols-12 gap-4 px-6 py-6 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} ${className}`}>
      {children}
    </div>
  );
};

export default ReviewTableRow; 