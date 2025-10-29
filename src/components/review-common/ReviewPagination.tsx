import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReviewPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ReviewPagination: React.FC<ReviewPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
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
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
              onPageChange(page);
            }
          }}
          disabled={page === '...'}
          className={`px-3 py-2 text-sm font-medium rounded-lg ${
            currentPage === page
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
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ReviewPagination; 