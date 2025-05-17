// Reference: Organization_dashboard.jpg
import JobListCard from '../components/dashboard/JobListCard';

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
  // Sort jobs by posting date (newest first)
  const sortedJobs = [...jobs].sort((a, b) => {
    return new Date(b.postDate).getTime() - new Date(a.postDate).getTime();
  });

  return (
    <JobListCard
      title="Active Jobs"
      jobs={sortedJobs}
      showManage={true}
      viewAllLink="/organization-dashboard/jobs"
      emptyMessage="No active jobs. Post a new job to attract talent."
    />
  );
}
