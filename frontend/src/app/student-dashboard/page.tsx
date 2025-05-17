// Reference: Student_dashboard.jpg
'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import RecommendedJobs from './RecommendedJobs';
import ApplicationStatus from './ApplicationStatus';
import StatCard from '../components/dashboard/StatCard';
import { StudentService } from '../../lib/api';
import { useProtectedRoute } from '../../lib/hooks/useProtectedRoute';

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

  return (
    <DashboardLayout title="Student Dashboard" userRole="student">
      <div>
        <h1 className="text-2xl font-semibold mb-6">Student Dashboard</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col gap-4 items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                title="Profile Completion"
                value={`${stats.profileCompletion}%`}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                }
              />
              
              <StatCard
                title="Applications"
                value={stats.applicationsSubmitted}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                }
              />
              
              <StatCard
                title="Jobs Viewed"
                value={stats.jobsViewed}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
            </div>
            
            {/* Recommended Jobs */}
            <RecommendedJobs jobs={recommendedJobs} />
            
            {/* Application Status */}
            <ApplicationStatus applications={applications} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
