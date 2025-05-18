'use client';

import Link from 'next/link';
import Button from '../../../components/Button';

export function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h2 className="text-xl font-medium mb-2">No Applications Yet</h2>
      <p className="text-gray-500 mb-6">
        You haven't applied for any jobs yet. Start by browsing available positions.
      </p>
      <Link href="/student-dashboard">
        <Button>Browse Jobs</Button>
      </Link>
    </div>
  );
}

export default EmptyState;
