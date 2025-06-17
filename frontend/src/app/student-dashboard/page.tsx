// Reference: Student_dashboard.jpg
'use client';

import { useEffect, useState } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import { StudentService } from '../../lib/api';
import { useProtectedRoute } from '../../lib/hooks/useProtectedRoute';

// Import new modular components
import { 
  ProfileSummary, 
  MetricsGrid, 
  RecommendedJobsCard, 
  ApplicationsCard 
} from './components/overview';

// Define interfaces for API responses
interface ApiJobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  postDate: string;
  status: string;
  matchScore?: number;
}

interface ApiApplicationItem {
  id: string;
  title: string;
  company: string;
  status: string;
  timestamp: string;
}

// Component prop types
interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  postDate: string;
  status?: 'open' | 'closed' | 'draft';
  matchScore?: number;
}

interface ApplicationItem {
  id: string;
  title: string;
  company: string;
  status: 'pending' | 'interview' | 'accepted' | 'rejected';
  timestamp: string;
}

interface StudentStats {
  profileCompletion: number;
  applicationsSubmitted: number;
  jobsViewed: number;
}

export default function StudentDashboardPage() {
  // Protect this route - only student can access
  const { loading: authLoading } = useProtectedRoute(['student'], '/login');
  
  const [stats, setStats] = useState<StudentStats>({
    profileCompletion: 0,
    applicationsSubmitted: 0,
    jobsViewed: 0
  });
  
  const [recommendedJobs, setRecommendedJobs] = useState<JobItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip loading data if still authenticating
    if (authLoading) return;
    
    const fetchStudentData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all student data in parallel
        const [dashboardStats, apiJobs, apiApplications] = await Promise.all([
          StudentService.getDashboardStats(),
          StudentService.getRecommendedJobs(),
          StudentService.getApplicationStatus(),
        ]);
        
        setStats(dashboardStats);
        
        // Map API job responses to component format
        const mappedJobs: JobItem[] = apiJobs.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          postDate: job.postDate,
          // Map string status to union type or undefined
          status: (job.status === 'open' || job.status === 'closed' || job.status === 'draft') 
            ? (job.status as 'open' | 'closed' | 'draft') 
            : undefined,
          matchScore: job.matchScore
        }));
        
        // Map API application responses to component format
        const mappedApplications: ApplicationItem[] = apiApplications.map(app => ({
          id: app.id,
          title: app.title,
          company: app.company,
          // Map string status to union type with fallback to 'pending'
          status: (app.status === 'pending' || app.status === 'interview' || 
                 app.status === 'accepted' || app.status === 'rejected') 
            ? (app.status as 'pending' | 'interview' | 'accepted' | 'rejected') 
            : 'pending',
          timestamp: app.timestamp
        }));
        
        setRecommendedJobs(mappedJobs);
        setApplications(mappedApplications);
      } catch (err: any) {
        console.error('Error fetching student dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentData();
  }, [authLoading]);

  // Mock user info - In a real application, this would come from auth context
  const userInfo = {
    name: 'Alex Johnson',
    role: 'Student',
    major: 'Computer Science',
    graduationYear: 2025,
  };

  // Define metrics with icons
  const metrics = [
    {
      id: 'profile-completion',
      title: 'Profile Completion',
      value: `${stats.profileCompletion}%`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      trend: { value: 5, isPositive: true }
    },
    {
      id: 'applications',
      title: 'Applications',
      value: stats.applicationsSubmitted,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      description: 'Total applications submitted'
    },
    {
      id: 'jobs-viewed',
      title: 'Jobs Viewed',
      value: stats.jobsViewed,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      trend: { value: 12, isPositive: true }
    },
    {
      id: 'interviews',
      title: 'Interviews',
      value: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'offers',
      title: 'Offers Received',
      value: 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      )
    }
  ];

  return (
    <UnifiedDashboardLayout 
      // Removing title from the header to prevent duplication
      title="" 
      description=""
      userRole="student"
      userInfo={{
        name: userInfo.name,
        role: userInfo.role,
      }}
      breadcrumbs={[
        { label: 'Dashboard' }
      ]}
      className="pt-0 mt-0" // Removing padding at the top
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col gap-4 items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading dashboard data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Summary */}
            <ProfileSummary
              name={userInfo.name}
              major={userInfo.major}
              graduationYear={userInfo.graduationYear}
              status="seeking"
              profileCompletionPercentage={stats.profileCompletion}
            />
            
            {/* Metrics Grid */}
            <MetricsGrid metrics={metrics} />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recommended Jobs */}
              <RecommendedJobsCard 
                jobs={recommendedJobs} 
                isLoading={false} 
                error={null} 
              />
              
              {/* Applications */}
              <ApplicationsCard 
                applications={applications} 
                isLoading={false} 
                error={null} 
              />
            </div>
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
