'use client';

import React from 'react';

interface Props {
    page: number;
    totalPages: number;
    isFetching?: boolean;
    onPageChange: (page: number) => void;
}

const CommonPagination: React.FC<Props> = ({ page, totalPages, isFetching, onPageChange }) => {
    // Ẩn pagination khi có ít hơn 6 items (totalPages <= 1)
    if (totalPages <= 1) {
        return null;
    }

    const handleChangePage = (newPage: number) => {
        if (newPage !== page) {
            onPageChange(newPage);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const start = Math.max(1, page - 2);
        const end = Math.min(totalPages, page + 2);

        if (start > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => handleChangePage(1)}
                    className={`w-10 h-10 rounded-full ${page === 1
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--primary-hover)/10]'} shadow transition`}
                >
                    1
                </button>
            );
            if (start > 2) {
                pages.push(<span key="start-ellipsis" className="text-gray-400 px-1">...</span>);
            }
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handleChangePage(i)}
                    className={`w-10 h-10 rounded-full ${i === page
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--primary-hover)/10]'} shadow transition`}
                >
                    {i}
                </button>
            );
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push(<span key="end-ellipsis" className="text-gray-400 px-1">...</span>);
            }

            pages.push(
                <button
                    key={totalPages}
                    onClick={() => handleChangePage(totalPages)}
                    className={`w-10 h-10 rounded-full ${page === totalPages
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--primary-hover)/10]'} shadow transition`}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex flex-col items-center mt-10 space-y-3">
            {isFetching && <div className="text-gray-500">Loading page {page}...</div>}

            <div className="flex justify-center items-center gap-2 flex-wrap">
                <button
                    onClick={() => handleChangePage(page - 1)}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-full bg-[var(--secondary)] shadow hover:bg-[var(--primary-hover)/10] disabled:opacity-50 transition"
                >
                    &larr;
                </button>

                {renderPageNumbers()}

                <button
                    onClick={() => handleChangePage(page + 1)}
                    disabled={page === totalPages}
                    className="w-10 h-10 rounded-full bg-[var(--secondary)] shadow hover:bg-[var(--primary-hover)/10] disabled:opacity-50 transition"
                >
                    &rarr;
                </button>
            </div>
        </div>
    );
};

export default CommonPagination;
