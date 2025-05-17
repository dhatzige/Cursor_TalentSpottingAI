// Reference: Student_dashboard.jpg
import JobListCard from '../components/dashboard/JobListCard';

interface RecommendedJobsProps {
  jobs: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    postDate: string;
    status?: 'open' | 'closed' | 'draft';
    matchScore?: number;
  }>;
}

export default function RecommendedJobs({ jobs }: RecommendedJobsProps) {
  // Sort jobs by match score if available
  const sortedJobs = [...jobs].sort((a, b) => {
    if (a.matchScore !== undefined && b.matchScore !== undefined) {
      return b.matchScore - a.matchScore;
    }
    return 0;
  });

  return (
    <JobListCard
      title="Recommended Jobs"
      jobs={sortedJobs}
      showApply={true}
      viewAllLink="/student-dashboard/recommended-jobs"
      emptyMessage="No recommended jobs yet. Complete your profile to get personalized recommendations."
    />
  );
}
