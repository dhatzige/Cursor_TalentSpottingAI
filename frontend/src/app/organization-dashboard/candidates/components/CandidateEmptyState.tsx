'use client';

import React from 'react';

interface CandidateEmptyStateProps {
  onResetFilters: () => void;
  // Allow either prop name for flexibility
  onReset?: () => void;
}

export default function CandidateEmptyState({ onResetFilters, onReset }: CandidateEmptyStateProps) {
  // Use either callback - onResetFilters takes precedence if both are provided
  const handleReset = () => {
    if (onResetFilters) {
      onResetFilters();
    } else if (onReset) {
      onReset();
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No candidates match your filters</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Try adjusting your filter criteria to see more results.
      </p>
      <button
        onClick={handleReset}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
      >
        Reset All Filters
      </button>
    </div>
  );
}
