// Reference: Organization_dashboard.jpg
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import ActiveJobs from './ActiveJobs';
import TopCandidates from './TopCandidates';
import Jobs from './jobs';
import { EmployerService } from '../../lib/api';
import { useProtectedRoute } from '../../lib/hooks/useProtectedRoute';

// Define interfaces for API responses
interface ApiJobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  postDate: string;
  status: string;
  applicantCount: number;
}

interface ApiCandidateItem {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
}

interface ApiOrganizationStats {
  activeJobs: number;
  totalApplicants: number;
  positionsFilled: number;
  trends: {
    applicantChange: number;
  };
}

// Component prop types
interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  postDate: string;
  status: 'open' | 'closed' | 'draft';
  applicantCount: number;
}

interface CandidateItem {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
}

export default function OrganizationDashboardPage() {
  // Protect this route - only employer can access
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  
  const [stats, setStats] = useState<ApiOrganizationStats>({
    activeJobs: 0,
    totalApplicants: 0,
    positionsFilled: 0,
    trends: {
      applicantChange: 0
    }
  });
  
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for job management view
  const [showJobManagement, setShowJobManagement] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);

  useEffect(() => {
    // Skip loading data if still authenticating
    if (authLoading) return;
    
    const fetchEmployerData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all employer data in parallel
        const [organizationStats, apiJobs, apiCandidates] = await Promise.all([
          EmployerService.getOrganizationStats(),
          EmployerService.getActiveJobs(),
          EmployerService.getTopCandidates(),
        ]);
        
        setStats(organizationStats);
        
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
        
        // No mapping needed for candidates as the types match
        setJobs(mappedJobs);
        setCandidates(apiCandidates);
      } catch (err: any) {
        console.error('Error fetching organization dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployerData();
  }, [authLoading]);

  return (
    <DashboardLayout title="Organization Dashboard" userRole="employer">
      <div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}
        
        {isLoading && !showJobManagement ? (
          <div className="flex flex-col gap-4 items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        ) : showJobManagement ? (
          <Jobs 
            initialJobs={jobs}
            showJobForm={showJobForm} 
            onBack={() => {
              setShowJobManagement(false);
              setShowJobForm(false);
            }}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Organization Dashboard</h1>
              <button 
                onClick={() => setShowJobManagement(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Manage Jobs
              </button>
            </div>
            
            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard 
                title="Active Jobs"
                value={stats.activeJobs}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                }
              />
              
              <StatCard 
                title="Total Applicants"
                value={stats.totalApplicants}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                }
                change={{ value: `${stats.trends.applicantChange}%`, isPositive: stats.trends.applicantChange > 0 }}
              />
              
              <StatCard 
                title="Positions Filled"
                value={stats.positionsFilled}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>
            
            {/* Jobs and candidates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Jobs */}
              <div className="relative">
                <ActiveJobs jobs={jobs} />
                <button 
                  onClick={() => {
                    setShowJobManagement(true);
                    setShowJobForm(true);
                  }}
                  className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                  title="Add New Job"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              {/* Top Candidates */}
              <TopCandidates candidates={candidates} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
