'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first and last page
      // and pages around current page
      
      // Start with page 1
      pages.push(1);
      
      // Calculate range around current page
      let rangeStart = Math.max(2, currentPage - 1);
      let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed
      if (rangeStart > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add pages in range
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (rangeEnd < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Add last page if not already included
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if only one page
  }

  return (
    <div className="flex items-center justify-center mt-8 space-x-1">
      {/* Previous button */}
      <button
        onClick={() => hasPreviousPage && onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={`px-3 py-2 rounded-md text-sm ${
          hasPreviousPage
            ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
        }`}
        aria-label="Previous page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((pageNum, index) => {
        // Render ellipsis
        if (pageNum < 0) {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          );
        }

        // Render page button
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              currentPage === pageNum
                ? 'bg-slate-800 dark:bg-slate-700 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
            aria-label={`Page ${pageNum}`}
            aria-current={currentPage === pageNum ? 'page' : undefined}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => hasNextPage && onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`px-3 py-2 rounded-md text-sm ${
          hasNextPage
            ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
        }`}
        aria-label="Next page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
