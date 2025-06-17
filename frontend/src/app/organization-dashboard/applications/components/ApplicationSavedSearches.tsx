'use client';

import React, { useState } from 'react';
import { SavedApplicationSearch } from './ApplicationsTypes';

interface ApplicationSavedSearchesProps {
  savedSearches: SavedApplicationSearch[];
  onApplySearch: (search: SavedApplicationSearch) => void;
  onDeleteSearch: (id: string) => void;
  onShowSaveDialog: () => void;
}

export default function ApplicationSavedSearches({
  savedSearches,
  onApplySearch,
  onDeleteSearch,
  onShowSaveDialog
}: ApplicationSavedSearchesProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="relative">
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Saved Searches {savedSearches.length > 0 && `(${savedSearches.length})`}
        </button>
        
        <button
          type="button"
          onClick={onShowSaveDialog}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Save Current Search
        </button>
      </div>
      
      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-gray-50 dark:bg-slate-800/50 rounded-md shadow-lg z-50 border border-gray-200">
          <div className="py-1">
            {savedSearches.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No saved searches yet
              </div>
            ) : (
              savedSearches.map((search) => (
                <div 
                  key={search.id}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700/50 cursor-pointer flex justify-between items-start"
                  onClick={() => {
                    onApplySearch(search);
                    setIsDropdownOpen(false);
                  }}
                >
                  <div>
                    <div className="font-medium text-gray-900">{search.name}</div>
                    <div className="text-xs text-gray-500">
                      {search.status && <span className="mr-2">Status: {search.status}</span>}
                      <span>Last used: {formatDate(search.lastUsed)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSearch(search.id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
