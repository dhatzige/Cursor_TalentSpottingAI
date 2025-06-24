'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  postDate: string;
  status?: 'open' | 'closed' | 'draft';
  matchScore?: number;
  applied?: boolean;
}

interface RecommendedJobsCardProps {
  jobs: JobItem[];
  isLoading?: boolean;
  error?: string | null;
}

/**
 * RecommendedJobsCard component for the student dashboard overview
 * Displays recommended jobs with match scores and quick apply options
 */
export default function RecommendedJobsCard({ 
  jobs, 
  isLoading = false,
  error = null
}: RecommendedJobsCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white">Recommended Jobs</h2>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white">Recommended Jobs</h2>
        </div>
        <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white">Recommended Jobs</h2>
        <Link 
          href="/student-dashboard/job-search"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          View all
        </Link>
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center py-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mx-auto text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">No recommended jobs available yet.</p>
          <Link 
            href="/student-dashboard/job-search"
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Explore jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.slice(0, 3).map((job) => {
            // Parse the date - handle both postDate and createdAt fields
            let timeAgo = 'Recently';
            try {
              const dateString = job.postDate || (job as any).createdAt;
              if (dateString) {
                const postDate = new Date(dateString);
                if (!isNaN(postDate.getTime())) {
                  timeAgo = formatDistanceToNow(postDate, { addSuffix: true });
                }
              }
            } catch (error) {
              console.warn('Error parsing job date:', error);
              timeAgo = 'Recently';
            }
            
            return (
              <div 
                key={job.id}
                className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-slate-700/50 dark:hover:bg-slate-700/50 transition"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 dark:text-white">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.company} • {job.location || 'Remote'}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Posted {timeAgo}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    {job.matchScore !== undefined && (
                      <div className="mb-2">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job.matchScore >= 80 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : job.matchScore >= 60 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                                : 'bg-gray-100 text-gray-800 dark:text-gray-200 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {job.matchScore}% match
                        </span>
                      </div>
                    )}
                    
                    {job.applied ? (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Applied
                      </span>
                    ) : (
                      <Link
                        href={`/student-dashboard/jobs/${job.id}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {jobs.length > 3 && (
            <div className="text-center pt-2">
              <Link 
                href="/student-dashboard/job-search"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View all {jobs.length} recommended jobs
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
