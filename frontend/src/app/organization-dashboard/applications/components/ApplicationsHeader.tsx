'use client';

import Button from '../../../components/Button';
import { useRouter } from 'next/navigation';

interface ApplicationsHeaderProps {
  job: {
    id: string;
    title: string;
    company: string;
    status: 'open' | 'closed' | 'draft';
  } | null;
  applicationCount: number;
  error: string | null;
}

export function ApplicationsHeader({ job, applicationCount, error }: ApplicationsHeaderProps) {
  const router = useRouter();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {job ? `Applications for ${job.title}` : 'Job Applications'}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {applicationCount} {applicationCount === 1 ? 'candidate' : 'candidates'} applied
        </p>
        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>
      
      {job && (
        <Button 
          variant="secondary"
          onClick={() => router.push('/organization-dashboard/jobs')}
        >
          Back to Jobs
        </Button>
      )}
    </div>
  );
}

export default ApplicationsHeader;
