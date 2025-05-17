// Reusable job listing component for employer and student dashboards
import Link from 'next/link';
import Button from '../Button';

// Job interface
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postDate: string;
  status?: 'open' | 'closed' | 'draft';
  applicantCount?: number;
  applied?: boolean;
}

interface JobListCardProps {
  title: string;
  jobs: Job[];
  showApply?: boolean;
  showManage?: boolean;
  className?: string;
  emptyMessage?: string;
  maxItems?: number;
  showViewAll?: boolean;
  viewAllLink?: string;
}

export default function JobListCard({
  title,
  jobs,
  showApply = false,
  showManage = false,
  className = '',
  emptyMessage = 'No jobs found',
  maxItems = 5,
  showViewAll = true,
  viewAllLink = '#',
}: JobListCardProps) {
  // Get status-specific styles
  const getStatusStyles = (status: Job['status'] = 'open') => {
    const styles = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    
    return styles[status] || styles.open;
  };
  
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {showViewAll && jobs.length > 0 && (
          <Link 
            href={viewAllLink} 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all
          </Link>
        )}
      </div>
      
      <div className="p-5">
        {jobs.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {jobs.slice(0, maxItems).map((job) => (
              <li key={job.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{job.title}</h4>
                    <div className="mt-1 text-sm text-gray-500">
                      {job.company} • {job.location}
                    </div>
                    <div className="mt-1 flex items-center">
                      <span className="text-xs text-gray-500">Posted {job.postDate}</span>
                      
                      {job.status && (
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusStyles(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      )}
                      
                      {job.applicantCount !== undefined && (
                        <span className="ml-2 text-xs text-gray-500">
                          {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 self-start md:self-center">
                    {showApply && (
                      <Button
                        variant={job.applied ? 'outline' : 'primary'}
                        className={job.applied ? 'cursor-default' : ''}
                        disabled={job.applied}
                      >
                        {job.applied ? 'Applied' : 'Apply'}
                      </Button>
                    )}
                    
                    {showManage && (
                      <Link href={`/organization-dashboard/jobs/${job.id}`}>
                        <Button variant="secondary">Manage</Button>
                      </Link>
                    )}
                    
                    <Link 
                      href={`/jobs/${job.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
