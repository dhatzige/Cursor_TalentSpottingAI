'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export interface ApplicationItem {
  id: string;
  title: string;
  company: string;
  status: 'pending' | 'interview' | 'accepted' | 'rejected';
  timestamp: string;
}

interface ApplicationsCardProps {
  applications: ApplicationItem[];
  isLoading?: boolean;
  error?: string | null;
}

/**
 * ApplicationsCard component for the student dashboard overview
 * Displays recent job applications with status information
 */
export default function ApplicationsCard({ 
  applications, 
  isLoading = false,
  error = null
}: ApplicationsCardProps) {
  // Status badge configuration
  const statusConfig = {
    pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    interview: { text: 'Interview', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    accepted: { text: 'Accepted', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    rejected: { text: 'Rejected', color: 'bg-gray-100 text-gray-800 dark:text-gray-200 dark:bg-gray-800 dark:text-gray-400' },
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white">Recent Applications</h2>
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white">Recent Applications</h2>
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white">Recent Applications</h2>
        <Link 
          href="/student-dashboard/applications"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          View all
        </Link>
      </div>
      
      {applications.length === 0 ? (
        <div className="text-center py-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mx-auto text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">No applications submitted yet.</p>
          <Link 
            href="/student-dashboard/job-search"
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Find jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.slice(0, 3).map((application) => {
            // Parse the timestamp string into a Date object
            const applicationDate = new Date(application.timestamp);
            // Format the timestamp as "X days/hours ago"
            const timeAgo = formatDistanceToNow(applicationDate, { addSuffix: true });
            const status = statusConfig[application.status];
            
            return (
              <div 
                key={application.id}
                className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-slate-700/50 dark:hover:bg-slate-700/50 transition"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 dark:text-white">
                      {application.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {application.company}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Applied {timeAgo}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                      {status.text}
                    </span>
                    
                    <Link
                      href={`/student-dashboard/applications/${application.id}`}
                      className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          
          {applications.length > 3 && (
            <div className="text-center pt-2">
              <Link 
                href="/student-dashboard/applications"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View all {applications.length} applications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
