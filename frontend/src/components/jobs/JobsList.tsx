'use client';

import React from 'react';
import { Job } from '@/lib/data/mockJobs';
import JobCard from './JobCard';

interface JobsListProps {
  isFiltering: boolean;
  displayedJobs: Job[];
  resetFilters: () => void;
}

export default function JobsList({ isFiltering, displayedJobs, resetFilters }: JobsListProps) {
  return (
    <div className="space-y-6">
      {isFiltering ? (
        <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mr-3"></div>
          <p className="text-gray-300">Filtering jobs...</p>
        </div>
      ) : displayedJobs.length > 0 ? (
        displayedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))
      ) : (
        <div className="bg-[#131b39]/50 p-12 rounded-lg border border-gray-800 text-center">
          <div className="text-5xl mb-4">🔎</div>
          <h3 className="text-xl font-bold mb-2">No matching jobs found</h3>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <button 
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors inline-block"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
