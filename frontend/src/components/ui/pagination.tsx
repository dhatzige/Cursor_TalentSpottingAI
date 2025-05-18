import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = ''
}: PaginationProps) {
  const generatePagination = () => {
    // Always show first page, last page, and pages around current page
    const pages = [];
    const delta = 1; // Show one page before and after current page
    
    // Always add page 1
    pages.push(1);
    
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);
    
    // Add ellipsis after page 1 if needed
    if (rangeStart > 2) {
      pages.push(-1); // -1 represents ellipsis
    }
    
    // Add pages in the middle
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis
    }
    
    // Add last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pages = generatePagination();

  if (totalPages <= 1) return null;

  return (
    <nav className={`flex justify-center ${className}`}>
      <ul className="flex items-center space-x-1">
        {/* Previous button */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`
              px-3 py-1 rounded-md text-sm
              ${currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}
            aria-label="Previous page"
          >
            ← Prev
          </button>
        </li>

        {/* Page numbers */}
        {pages.map((page, index) => (
          <li key={index}>
            {page === -1 || page === -2 ? (
              <span className="px-3 py-1 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`
                  px-3 py-1 rounded-md text-sm font-medium
                  ${currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'}
                `}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next button */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`
              px-3 py-1 rounded-md text-sm
              ${currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}
            aria-label="Next page"
          >
            Next →
          </button>
        </li>
      </ul>
    </nav>
  );
}
