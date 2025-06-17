'use client';

import { SearchCriteria } from './types';

interface SearchHistoryProps {
  searches: SearchCriteria[];
  onApply: (index: number) => void;
}

export default function SearchHistory({ searches, onApply }: SearchHistoryProps) {
  if (searches.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
        <div className="text-center py-6 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2">No recent search history.</p>
          <p className="mt-1 text-sm">Your recent searches will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
      
      <div className="space-y-3">
        {searches.map((search, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex-1 pr-4">
              <div className="text-sm">
                <span className="font-medium">Query:</span> {search.query || 'None'}
              </div>
              
              <div className="mt-1 flex flex-wrap gap-1">
                {search.skills.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="inline-flex text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                    {skill}
                  </span>
                ))}
                {search.skills.length > 3 && (
                  <span className="text-xs text-gray-500">+{search.skills.length - 3} more</span>
                )}
              </div>
              
              {search.locations.length > 0 && (
                <div className="mt-1 text-xs text-gray-600">
                  <span className="font-medium">Location:</span> {search.locations.join(', ')}
                </div>
              )}
              
              {search.education.length > 0 && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Education:</span> {search.education.join(', ')}
                </div>
              )}
              
              <div className="text-xs text-gray-600">
                <span className="font-medium">Experience:</span> {search.experience.min}-{search.experience.max} years
              </div>
              
              <div className="text-xs text-gray-600">
                <span className="font-medium">Match:</span> {search.matchScore.min}%-{search.matchScore.max}%
              </div>
            </div>
            
            <button
              onClick={() => onApply(index)}
              className="text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
