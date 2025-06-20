'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import { StudentService } from '@/lib/api';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

// Import modular components
import {
  FilterControls,
  ApplicationItem,
  LoadingState,
  EmptyState,
  NoMatchingApplications,
  ErrorDisplay,
  StatusBadge
} from './components';

// Import types separately to avoid naming conflicts
import type { ApplicationItemType } from './components';

export default function ApplicationsPage() {
  // Protect this route - only students can access
    const { loading: authLoading } = useProtectedRoute(['student']);
  
  const [applications, setApplications] = useState<ApplicationItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Skip loading if still authenticating
    if (authLoading) return;
    
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In the future, we'll update the StudentService to include getAllApplications
        // For now, we're using mocked data
        
        // Mock data for demonstration
        const mockApplications: ApplicationItemType[] = [
          {
            id: '1',
            jobId: 'job1',
            title: 'Frontend Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            status: 'pending',
            appliedDate: '2025-05-10T12:00:00Z',
            lastUpdated: '2025-05-10T12:00:00Z'
          },
          {
            id: '2',
            jobId: 'job2',
            title: 'UX Designer',
            company: 'Creative Solutions',
            location: 'Remote',
            status: 'interview',
            appliedDate: '2025-05-05T09:30:00Z',
            lastUpdated: '2025-05-12T14:20:00Z'
          },
          {
            id: '3',
            jobId: 'job3',
            title: 'Data Analyst Intern',
            company: 'DataDrive Analytics',
            location: 'Boston, MA',
            status: 'accepted',
            appliedDate: '2025-04-28T15:45:00Z',
            lastUpdated: '2025-05-15T10:15:00Z',
            feedback: 'We were impressed with your analytical skills and previous project experience.'
          },
          {
            id: '4',
            jobId: 'job4',
            title: 'Mobile App Developer',
            company: 'AppWorks',
            location: 'Austin, TX',
            status: 'rejected',
            appliedDate: '2025-04-15T08:20:00Z',
            lastUpdated: '2025-05-01T11:30:00Z',
            feedback: 'Thank you for your interest. We have decided to move forward with candidates who have more experience with Flutter development.'
          }
        ];
        
        setApplications(mockApplications);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [authLoading]);

  // Filter applications based on selected status
  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  // Mock user info - In a real application, this would come from auth context
  const userInfo = {
    name: 'Alex Johnson',
    role: 'Student',
  };

  // Check if we're in development environment
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <UnifiedDashboardLayout 
      // Removing title to prevent duplication
      title="" 
      description=""
      userRole="student"
      userInfo={userInfo}
      breadcrumbs={[
        // If in development, link to the no-auth version
        { label: 'Dashboard', href: isDev ? '/student-dashboard-noauth' : '/student-dashboard' },
        { label: 'Applications' }
      ]}
      className="pt-0 mt-0" // Removing padding at the top
    >
      <div className="space-y-6">
        <div className="flex justify-end items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {applications.length} total applications
          </div>
        </div>
        
        {/* Display error if any */}
        {error && <ErrorDisplay error={error} />}
        
        {isLoading ? (
          <LoadingState />
        ) : applications.length === 0 ? (
          <div className="rounded-lg shadow-md p-8 bg-gray-50 dark:bg-slate-800/50">
            <EmptyState />
          </div>
        ) : (
          <>
            {/* Filter Controls */}
            <div className="rounded-lg shadow-md p-4 bg-gray-50 dark:bg-slate-800/50">
              <FilterControls
                activeFilter={filterStatus}
                onFilterChange={setFilterStatus}
              />
            </div>
            
            {/* Applications Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['pending', 'reviewing', 'interview', 'accepted', 'rejected'].map(status => {
                const count = applications.filter(app => app.status === status).length;
                return (
                  <div 
                    key={status}
                    className={`bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow-md p-4 ${filterStatus === status ? 'ring-2 ring-blue-500' : ''} cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800/70 transition-colors`}
                    onClick={() => setFilterStatus(status)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <StatusBadge status={status as any} />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Total</p>
                      </div>
                      <span className="text-2xl font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Applications List */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow-md overflow-hidden">
              {filteredApplications.length === 0 ? (
                <div className="p-8">
                  <NoMatchingApplications />
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredApplications.map(application => (
                    <div key={application.id} className="hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                      <ApplicationItem
                        application={application}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
