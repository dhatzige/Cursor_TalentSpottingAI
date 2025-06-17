'use client';

import { useState, useEffect } from 'react';
import { Candidate } from './useCandidateFilters';

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function usePagination(
  filteredCandidates: Candidate[],
  pageSize: number = 10
) {
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize,
    totalResults: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  // Current page of candidates
  const [currentPageCandidates, setCurrentPageCandidates] = useState<Candidate[]>([]);
  
  // Update pagination and current page candidates
  useEffect(() => {
    const totalResults = filteredCandidates.length;
    const totalPages = Math.ceil(totalResults / pageSize);

    // Ensure current page is within bounds
    let currentPage = pagination.page;
    if (totalPages === 0) {
      currentPage = 1; // Always keep at least page 1 even when there are no results
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    // Build the next pagination snapshot
    const nextPagination: PaginationInfo = {
      page: currentPage,
      pageSize,
      totalResults,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };

    // Only update state if something actually changed to avoid an infinite loop
    setPagination((prev) => {
      const isSame =
        prev.page === nextPagination.page &&
        prev.pageSize === nextPagination.pageSize &&
        prev.totalResults === nextPagination.totalResults &&
        prev.totalPages === nextPagination.totalPages &&
        prev.hasNextPage === nextPagination.hasNextPage &&
        prev.hasPreviousPage === nextPagination.hasPreviousPage;

      return isSame ? prev : nextPagination;
    });

    // Calculate slice indices for the current page
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setCurrentPageCandidates(filteredCandidates.slice(startIndex, endIndex));
  }, [filteredCandidates, pagination.page, pageSize]);
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };
  
  // Reset to first page
  const resetToFirstPage = () => {
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  
  return {
    pagination,
    currentPageCandidates,
    handlePageChange,
    resetToFirstPage
  };
}
