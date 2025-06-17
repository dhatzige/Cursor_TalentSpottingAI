'use client';

import React from 'react';
import StatusFilter from './StatusFilter';
import { ApplicationStatus } from '../../../../types/application';

interface ApplicationsFilterBarProps {
  selectedStatus: ApplicationStatus | 'all';
  onStatusChange: (status: ApplicationStatus | 'all') => void;
  selectedJobId: string | null;
  jobOptions: { id: string; title: string }[];
  onJobChange: (jobId: string | null) => void;
  onReset: () => void;
}

export default function ApplicationsFilterBar({
  selectedStatus,
  onStatusChange,
  selectedJobId,
  jobOptions,
  onJobChange,
  onReset
}: ApplicationsFilterBarProps) {
  const hasFilters = selectedStatus !== 'all' || selectedJobId !== null;
  
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Status filter */}
        <div className="w-full md:w-auto">
          <StatusFilter 
            selectedStatus={selectedStatus} 
            onStatusChange={onStatusChange} 
          />
        </div>
        
        {/* Job filter */}
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Filter by Job
          </label>
          <select 
            value={selectedJobId || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onJobChange(e.target.value || null)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Jobs</option>
            {jobOptions.map(job => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
        
        {/* Reset filters button */}
        {hasFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
