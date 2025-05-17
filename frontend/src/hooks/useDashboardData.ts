import { useState, useEffect } from 'react';
import { EmployerService } from '../lib/api';
import { 
  ApiOrganizationStats, 
  ApiJobItem, 
  ApiCandidateItem, 
  JobItem, 
  DashboardData 
} from '../types/dashboard';

export function useDashboardData(skipLoading = false): {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(!skipLoading);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all employer data in parallel
      const [organizationStats, apiJobs, apiCandidates] = await Promise.all([
        EmployerService.getOrganizationStats(),
        EmployerService.getActiveJobs(),
        EmployerService.getTopCandidates(),
      ]);
      
      // Map API job responses to component format
      const mappedJobs: JobItem[] = apiJobs.map((job: ApiJobItem) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        postDate: job.postDate,
        // Map string status to union type or default to 'open'
        status: (job.status === 'open' || job.status === 'closed' || job.status === 'draft') 
          ? (job.status as 'open' | 'closed' | 'draft') 
          : 'open',
        applicantCount: job.applicantCount
      }));
      
      setData({
        stats: organizationStats,
        jobs: mappedJobs,
        candidates: apiCandidates,
      });
    } catch (err: any) {
      console.error('Error fetching organization dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!skipLoading) {
      fetchData();
    }
  }, [skipLoading]);

  return { data, isLoading, error, refetch: fetchData };
}
