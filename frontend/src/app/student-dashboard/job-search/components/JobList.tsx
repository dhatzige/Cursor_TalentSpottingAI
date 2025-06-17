'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  logoUrl?: string;
  salary?: string;
  jobType?: string[];
  postDate: string;
  description?: string;
  matchScore?: number;
  skills?: string[];
  applied?: boolean;
}

interface JobListProps {
  jobs: Job[];
  isLoading?: boolean;
  error?: string | null;
  onSaveJob?: (jobId: string) => void;
}

/**
 * JobList component for displaying job search results
 */
export default function JobList({ 
  jobs, 
  isLoading = false, 
  error = null,
  onSaveJob
}: JobListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white">No jobs found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
            Try adjusting your search filters or try a different search term to find more job opportunities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => {
        // Parse the post date string into a Date object
        const postDate = new Date(job.postDate);
        // Format the post date as "X days/hours ago"
        const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });
        
        return (
          <div 
            key={job.id}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              {/* Company Logo */}
              <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {job.logoUrl ? (
                  <Image
                    src={job.logoUrl}
                    alt={job.company}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">
                    {job.company.charAt(0)}
                  </span>
                )}
              </div>
              
              {/* Job Details */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white">
                  {job.title}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {job.company} • {job.location}
                </p>
                
                {job.salary && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {job.salary}
                  </p>
                )}
                
                {/* Job Type & Skills */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {job.jobType && job.jobType.map((type) => (
                    <span 
                      key={type}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {type}
                    </span>
                  ))}
                  
                  {job.skills && job.skills.slice(0, 3).map((skill) => (
                    <span 
                      key={skill}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                  
                  {job.skills && job.skills.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
                
                {/* Match Score & Posted Time */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Posted {timeAgo}
                  </div>
                  
                  {job.matchScore !== undefined && (
                    <div className={`text-sm font-medium ${
                      job.matchScore >= 80 
                        ? 'text-green-600 dark:text-green-400' 
                        : job.matchScore >= 60 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {job.matchScore}% match
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href={`/student-dashboard/jobs/${job.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {job.applied ? 'View Application' : 'View Job'}
                  </Link>
                  
                  <div className="flex gap-2">
                    {!job.applied && (
                      <button
                        type="button"
                        onClick={() => onSaveJob && onSaveJob(job.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                        aria-label="Save job"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
