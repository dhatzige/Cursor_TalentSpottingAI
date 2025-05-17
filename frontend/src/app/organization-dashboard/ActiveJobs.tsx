import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '../../components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface ActiveJobsProps {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    postDate: string;
    status: 'open' | 'closed' | 'draft';
    applicantCount: number;
  }>;
}

export default function ActiveJobs({ jobs }: ActiveJobsProps) {
  // Sort jobs by posting date (newest first) and limit to 5 most recent jobs
  const sortedJobs = [...jobs]
    .sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-hidden">
      {sortedJobs.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {sortedJobs.map((job) => (
            <li key={job.id} className="p-4 hover:bg-gray-50 transition-colors">
              <Link href={`/organization-dashboard/jobs/${job.id}`} className="block">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{job.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                    <span className="text-xs text-blue-600 font-medium">{job.applicantCount} applicants</span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                  <span>Posted {formatDistanceToNow(new Date(job.postDate))} ago</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-6 text-center text-gray-500">
          <p>No active jobs. Post a new job to attract talent.</p>
        </div>
      )}
      
      {sortedJobs.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Link 
            href="/organization-dashboard/jobs" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all jobs →
          </Link>
        </div>
      )}
    </div>
  );
}
