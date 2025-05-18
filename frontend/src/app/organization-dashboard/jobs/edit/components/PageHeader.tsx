'use client';

import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  isEditing: boolean;
}

export function PageHeader({ isEditing }: PageHeaderProps) {
  const router = useRouter();
  
  return (
    <div className="mb-6">
      <button 
        onClick={() => router.push('/organization-dashboard/jobs')}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Jobs
      </button>
      <h1 className="text-2xl font-semibold mt-4">
        {isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}
      </h1>
    </div>
  );
}

export default PageHeader;
