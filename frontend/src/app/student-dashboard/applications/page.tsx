'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import { StudentService } from '@/lib/api';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';
import { useAuth } from '@clerk/nextjs';

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
  const { getToken } = useAuth();
  
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
        // Fetch real applications from the API
        const apiApplications = await StudentService.getApplicationStatus(getToken);
        
        // Map API response to component format
        const mappedApplications: ApplicationItemType[] = apiApplications.map(app => ({
          id: app.id,
          jobId: app.jobId || app.id,
          title: app.title,
          company: app.company,
          location: app.location || 'Location not specified',
          status: (app.status === 'pending' || app.status === 'reviewing' || 
                 app.status === 'interview' || app.status === 'accepted' || app.status === 'rejected') 
            ? app.status as ApplicationItemType['status'] 
            : 'pending',
          appliedDate: app.timestamp,
          lastUpdated: app.timestamp,
          feedback: app.feedback
        }));
        
        setApplications(mappedApplications);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications. Please try again later.');
        // Don't show mock data - show empty state instead
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [authLoading, getToken]);

  // Filter applications based on selected status
  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  return (
    <UnifiedDashboardLayout>
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
