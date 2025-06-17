'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SavedSearch, JobSearchQuery } from '@/types/jobs';
import { getSavedSearches, deleteSavedSearch } from '@/lib/services/jobs-service';

interface SavedSearchesProps {
  onApplySearch: (query: JobSearchQuery) => void;
}

export default function SavedSearches({ onApplySearch }: SavedSearchesProps) {
  const router = useRouter();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchSavedSearches = async () => {
      setLoading(true);
      try {
        const searches = await getSavedSearches();
        setSavedSearches(searches);
      } catch (err) {
        console.error('Error fetching saved searches:', err);
        setError('Failed to load saved searches');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedSearches();
  }, []);

  const handleDeleteSearch = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent applying the search when clicking delete
    
    try {
      await deleteSavedSearch(id);
      // Update local state to remove the deleted search
      setSavedSearches(prev => prev.filter(search => search.id !== id));
    } catch (err) {
      console.error('Error deleting saved search:', err);
      setError('Failed to delete saved search');
    }
  };

  const handleApplySearch = (search: SavedSearch) => {
    onApplySearch(search.query);
    setIsOpen(false);
  };

  // Format date to human-readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!savedSearches.length && !loading) {
    return null; // Don't show component if no saved searches
  }

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        Saved Searches {savedSearches.length > 0 && `(${savedSearches.length})`}
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow-lg z-10 border border-gray-200">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-block h-5 w-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mr-2"></div>
              Loading saved searches...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              {error}
            </div>
          ) : (
            <ul className="py-2">
              {savedSearches.map(search => (
                <li 
                  key={search.id}
                  onClick={() => handleApplySearch(search)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700/50 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{search.name}</p>
                      <p className="text-xs text-gray-500">Last used: {formatDate(search.lastUsed)}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSearch(search.id, e)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Delete saved search"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
