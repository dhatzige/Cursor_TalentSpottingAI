'use client';

import React, { useState } from 'react';

interface SavedFilter {
  id: string;
  name: string;
  minMatchScore?: number;
  skills?: string[];
  university?: string;
  createdAt: string;
  lastUsed: string;
}

interface FilterToolbarProps {
  savedFilters: SavedFilter[];
  selectedCount: number;
  onShowSaveFilter: () => void;
  onApplyFilter: (filter: SavedFilter) => void;
  onDeleteFilter: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  onCompare: () => void;
  formatDate: (dateString: string) => string;
}

export default function FilterToolbar({
  savedFilters,
  selectedCount,
  onShowSaveFilter,
  onApplyFilter,
  onDeleteFilter,
  onCompare,
  formatDate
}: FilterToolbarProps) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      {/* Saved Filters */}
      <div className="relative">
        <div className="flex items-center">
          <button
            onClick={onShowSaveFilter}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Save Current Filter
          </button>
          
          {savedFilters.length > 0 && (
            <div className="relative ml-4">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors"
                onClick={toggleFilterDropdown}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Saved Filters ({savedFilters.length})
              </button>
              
              {showFilterDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                  <div className="py-1">
                    {savedFilters.map(filter => (
                      <div 
                        key={filter.id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-start transition-colors"
                        onClick={() => onApplyFilter(filter)}
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{filter.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {filter.minMatchScore && <span className="mr-2">Match: ≥{filter.minMatchScore}%</span>}
                            {filter.skills && filter.skills.length > 0 && <span className="mr-2">Skills: {filter.skills.length}</span>}
                            <span>Used: {formatDate(filter.lastUsed)}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => onDeleteFilter(filter.id, e)}
                          className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Selected candidates count and compare button */}
      <div className="space-x-4">
        {selectedCount > 0 && (
          <button
            onClick={onCompare}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
          >
            Compare Selected ({selectedCount})
          </button>
        )}
      </div>
    </div>
  );
}
