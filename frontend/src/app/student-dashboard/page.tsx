// Reference: Student_dashboard.jpg
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import { StudentService } from '../../lib/api/student.service';
import { useProtectedRoute } from '../../lib/hooks/useProtectedRoute';
import { useUser, useAuth } from '@clerk/nextjs';

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
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  timestamp: string;
}

interface StudentStats {
  profileCompletion: number;
  applicationsSubmitted: number;
  jobsViewed: number;
  interviews?: number;
  offersReceived?: number;
}

export default function StudentDashboardPage() {
  // Protect this route - only student can access
      const { user } = useUser();
  const { getToken } = useAuth();
  const { loading: authLoading } = useProtectedRoute(['student']);
  
  const [stats, setStats] = useState<StudentStats>({
    profileCompletion: 0,
    applicationsSubmitted: 0,
    jobsViewed: 0
  });
  
  const [recommendedJobs, setRecommendedJobs] = useState<JobItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  
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
        const [dashboardStats, apiJobs, apiApplications, profileData] = await Promise.all([
          StudentService.getDashboardStats(getToken),
          StudentService.getRecommendedJobs(getToken),
          StudentService.getApplicationStatus(getToken),
          StudentService.getProfile(getToken),
        ]);
        
        setStats(dashboardStats);
        if (profileData?.user) {
          setUserProfile(profileData.user);
        }
        
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
            ? (app.status as 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected') 
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
  }, [authLoading, getToken]);



  

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
      )
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
      )
    },
    {
      id: 'interviews',
      title: 'Interviews',
      value: stats.interviews || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'offers',
      title: 'Offers Received',
      value: stats.offersReceived || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      )
    }
  ];

  return (
    <UnifiedDashboardLayout>
      <div className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Fix Role Issue - Show when user has no role in Clerk */}
        {!user?.unsafeMetadata?.role && (
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                  Authentication Issue Detected
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Your account is missing role information. Click the button to fix this issue.
                </p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/fix-user-role', { method: 'POST' });
                    if (response.ok) {
                      window.location.reload();
                    } else {
                      alert('Failed to fix role. Please try again.');
                    }
                  } catch (error) {
                    alert('Error fixing role. Please try again.');
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Fix Authentication
              </button>
            </div>
          </div>
        )}

        {/* Real Profile Setup - Show when user has mock data */}
        {stats.profileCompletion === 72 && (
          <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                  You're seeing demo data
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Create your real profile to see your actual data and get personalized job recommendations.
                </p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/quick-setup', { method: 'POST' });
                    if (response.ok) {
                      window.location.reload();
                    } else {
                      alert('Failed to create profile. Please try again.');
                    }
                  } catch (error) {
                    alert('Error creating profile. Please try again.');
                  }
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Real Profile
              </button>
            </div>
          </div>
        )}

        {/* Profile Completion Encouragement - Show when profile is incomplete but real */}
        {stats.profileCompletion < 100 && stats.profileCompletion !== 72 && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Complete Your Profile ({stats.profileCompletion}%)
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {stats.profileCompletion < 50 
                    ? "Add more details to your profile to get better job recommendations."
                    : stats.profileCompletion < 80
                    ? "You're almost there! Complete your profile to unlock all features."
                    : "Great job! Just a few more details to reach 100% completion."
                  }
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/student-dashboard/profile'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Complete Profile
              </button>
            </div>
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
              name={userProfile?.studentProfile ? 
                `${userProfile.studentProfile.firstName} ${userProfile.studentProfile.lastName}` : 
                user?.fullName || 'Student'}
              major={userProfile?.studentProfile?.studyField ? 
                userProfile.studentProfile.studyField.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 
                'Computer Science'}
              graduationYear={userProfile?.studentProfile?.graduationYear || new Date().getFullYear() + 1}
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
