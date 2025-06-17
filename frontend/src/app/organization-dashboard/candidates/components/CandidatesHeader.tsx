'use client';

import React from 'react';
import { SavedFilter } from './types';
import SavedSearches from './SavedSearches';

interface CandidatesHeaderProps {
  selectedCandidates: string[];
  savedFilters: SavedFilter[];
  onShowSaveFilterDialog: () => void;
  onCompare: () => void;
  onApplyFilter: (queryParams: string) => void;
}

export default function CandidatesHeader({
  selectedCandidates,
  savedFilters,
  onShowSaveFilterDialog,
  onCompare,
  onApplyFilter
}: CandidatesHeaderProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex justify-between items-center mb-6">
      {/* Saved Filters */}
      <div className="relative">
        <div className="flex items-center">
          <button
            onClick={onShowSaveFilterDialog}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            disabled={false}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Save Current Filter
          </button>
          
          {/* Saved Search dropdown is now handled by the SavedSearches component */}
          <div className="ml-4">
            <SavedSearches onApplySearch={onApplyFilter} />
          </div>
        </div>
      </div>
      
      {/* Selected candidates count and compare button */}
      <div className="space-x-4">
        {selectedCandidates.length > 0 && (
          <button
            onClick={onCompare}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Compare Selected ({selectedCandidates.length})
          </button>
        )}
      </div>
    </div>
  );
}
