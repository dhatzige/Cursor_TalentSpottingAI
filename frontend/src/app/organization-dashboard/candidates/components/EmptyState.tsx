import React from 'react';
import { useRouter } from 'next/navigation';

export default function EmptyState() {
  const router = useRouter();
  
  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 p-8 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-2">No candidates yet</h3>
      <p className="text-gray-500 mb-4">
        No one has applied to your job postings yet. Check back later or create more job listings.
      </p>
      <button
        onClick={() => router.push('/organization-dashboard/jobs')}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Create Job Posting
      </button>
    </div>
  );
}
