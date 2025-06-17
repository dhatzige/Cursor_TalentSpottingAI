'use client';

import Link from 'next/link';
import StatusBadge from './StatusBadge';
import { ApplicationItem as ApplicationItemType } from './types';

interface ApplicationItemProps {
  application: ApplicationItemType;
}

export function ApplicationItem({ application }: ApplicationItemProps) {
  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Determine action buttons based on application status
  const renderActionButtons = () => {
    switch(application.status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <Link href={`/student-dashboard/jobs/${application.jobId}`}>
              <button className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 dark:hover:bg-slate-600 rounded-md text-sm font-medium transition-colors">
                View Job
              </button>
            </Link>
            <button className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium transition-colors">
              Withdraw
            </button>
          </div>
        );
      case 'interview':
        return (
          <div className="flex gap-2">
            <Link href={`/student-dashboard/jobs/${application.jobId}`}>
              <button className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 dark:hover:bg-slate-600 rounded-md text-sm font-medium transition-colors">
                View Job
              </button>
            </Link>
            <button className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium transition-colors">
              Prepare for Interview
            </button>
          </div>
        );
      case 'accepted':
        return (
          <div className="flex gap-2">
            <Link href={`/student-dashboard/jobs/${application.jobId}`}>
              <button className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 dark:hover:bg-slate-600 rounded-md text-sm font-medium transition-colors">
                View Job
              </button>
            </Link>
            <button className="px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-md text-sm font-medium transition-colors">
              Accept Offer
            </button>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex gap-2">
            <Link href={`/student-dashboard/jobs/${application.jobId}`}>
              <button className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 dark:hover:bg-slate-600 rounded-md text-sm font-medium transition-colors">
                View Job
              </button>
            </Link>
            <button className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium transition-colors">
              Find Similar Jobs
            </button>
          </div>
        );
      default:
        return (
          <Link href={`/student-dashboard/jobs/${application.jobId}`}>
            <button className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700/50 dark:hover:bg-slate-600 rounded-md text-sm font-medium transition-colors">
              View Job
            </button>
          </Link>
        );
    }
  };

  return (
    <div className="p-5 hover:bg-gray-100 dark:hover:bg-slate-700/50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="sm:flex sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={application.status} />
            <span className="text-xs text-gray-500 dark:text-gray-400">ID: #{application.id}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white mb-1">
            {application.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            {application.company} • {application.location}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span className="inline-flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Applied: {formatDate(application.appliedDate)}
            </span>
            {application.lastUpdated !== application.appliedDate && (
              <span className="inline-flex items-center ml-3">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated: {formatDate(application.lastUpdated)}
              </span>
            )}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          {renderActionButtons()}
        </div>
      </div>
      
      {/* Feedback section for accepted/rejected applications */}
      {(application.status === 'accepted' || application.status === 'rejected') && application.feedback && (
        <div className={`mt-4 p-3 rounded-md ${
          application.status === 'accepted' 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30' 
            : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700'
        }`}>
          <h4 className="text-sm font-medium mb-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            Feedback from Employer
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{application.feedback}</p>
        </div>
      )}
        
      {/* Interview section */}
      {application.status === 'interview' && (
        <div className="mt-4 p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Interview Details
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Mock interview details would appear here for interviews in the real app.
          </p>
        </div>
      )}
    </div>
  );
}

export default ApplicationItem;
