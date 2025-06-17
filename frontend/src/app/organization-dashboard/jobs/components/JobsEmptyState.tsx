'use client';

import { useRouter } from 'next/navigation';
import Button from '../../shared/ui/Button';
import Card from '../../shared/ui/Card';

interface JobsEmptyStateProps {
  activeFilter: 'all' | 'open' | 'closed' | 'draft';
}

export default function JobsEmptyState({ activeFilter }: JobsEmptyStateProps) {
  const router = useRouter();
  
  return (
    <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
        {activeFilter === 'all' 
          ? 'No jobs found' 
          : `No ${activeFilter} jobs found`}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {activeFilter === 'all' 
          ? 'Get started by creating your first job posting.' 
          : `You don't have any ${activeFilter} jobs at the moment.`}
      </p>
      {activeFilter === 'all' && (
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push('/organization-dashboard/jobs/create')}
          icon={(
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
        >
          Create First Job
        </Button>
      )}
    </Card>
  );
}
