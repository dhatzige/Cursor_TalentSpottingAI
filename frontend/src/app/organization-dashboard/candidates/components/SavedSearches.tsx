import React, { useState, useEffect } from 'react';

interface SavedSearch {
  id: string;
  name: string;
  queryParams: string;
  createdAt: string;
  lastUsed: string;
}

interface SavedSearchesProps {
  onApplySearch: (queryParams: string) => void;
}

export default function SavedSearches({ onApplySearch }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');

  // Load saved searches from localStorage on component mount
  useEffect(() => {
    const storedSearches = localStorage.getItem('talentSpotting_candidateSavedSearches');
    if (storedSearches) {
      try {
        const parsedSearches = JSON.parse(storedSearches);
        setSavedSearches(parsedSearches);
      } catch (err) {
        console.error('Error parsing saved searches:', err);
      }
    }
  }, []);

  // Save a new search
  const handleSaveSearch = () => {
    if (!newSearchName.trim()) return;

    // Get current query params
    const urlParams = new URLSearchParams(window.location.search);
    const queryParams = urlParams.toString();

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: newSearchName.trim(),
      queryParams,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };

    const updatedSearches = [...savedSearches, newSearch];
    
    // Update state and save to localStorage
    setSavedSearches(updatedSearches);
    localStorage.setItem('talentSpotting_candidateSavedSearches', JSON.stringify(updatedSearches));
    
    // Reset form
    setNewSearchName('');
    setShowSaveDialog(false);
  };

  // Apply a saved search
  const handleApplySearch = (search: SavedSearch) => {
    // Update last used timestamp
    const updatedSearches = savedSearches.map(s => 
      s.id === search.id 
        ? { ...s, lastUsed: new Date().toISOString() } 
        : s
    );
    
    setSavedSearches(updatedSearches);
    localStorage.setItem('talentSpotting_candidateSavedSearches', JSON.stringify(updatedSearches));
    
    // Apply the search
    onApplySearch(search.queryParams);
    setIsDropdownOpen(false);
  };

  // Delete a saved search
  const handleDeleteSearch = (e: React.MouseEvent, searchId: string) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    
    const updatedSearches = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updatedSearches);
    localStorage.setItem('talentSpotting_candidateSavedSearches', JSON.stringify(updatedSearches));
  };

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
          onClick={() => setShowSaveDialog(true)}
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
                  onClick={() => handleApplySearch(search)}
                >
                  <div>
                    <div className="font-medium text-gray-900">{search.name}</div>
                    <div className="text-xs text-gray-500">
                      Last used: {formatDate(search.lastUsed)}
                    </div>
                  </div>
                  <button
                    onClick={(e: React.MouseEvent) => handleDeleteSearch(e, search.id)}
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
      
      {/* Save dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Save Current Search</h3>
            <input
              type="text"
              placeholder="Enter a name for this search"
              value={newSearchName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSearchName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-md border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSearch}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                disabled={!newSearchName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
