'use client';

import { useState } from 'react';

interface SavedSearch {
  id: string;
  name: string;
  criteria: any;
}

interface SavedSearchesProps {
  searches: SavedSearch[];
  onApply: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SavedSearches({ searches, onApply, onDelete }: SavedSearchesProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (searches.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Saved Searches</h3>
        <div className="text-center py-6 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="mt-2">You haven't saved any searches yet.</p>
          <p className="mt-1 text-sm">Your saved searches will appear here for quick access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Saved Searches</h3>
      
      <div className="space-y-3">
        {searches.map((search) => (
          <div 
            key={search.id} 
            className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div>
              <h4 className="font-medium text-gray-900">{search.name}</h4>
              <p className="text-xs text-gray-500">
                Created: {formatDate(search.criteria.createdAt)}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {search.criteria.skills && search.criteria.skills.slice(0, 3).map((skill: string, idx: number) => (
                  <span key={idx} className="inline-flex text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                    {skill}
                  </span>
                ))}
                {search.criteria.skills && search.criteria.skills.length > 3 && (
                  <span className="text-xs text-gray-500">+{search.criteria.skills.length - 3} more</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {confirmDeleteId === search.id ? (
                <>
                  <button
                    onClick={() => {
                      onDelete(search.id);
                      setConfirmDeleteId(null);
                    }}
                    className="text-xs text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 dark:hover:bg-slate-600/70 px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onApply(search.id)}
                    className="text-xs text-blue-700 hover:text-blue-800"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(search.id)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
