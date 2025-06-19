'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import our unified dashboard layout system
import { UnifiedDashboardLayout } from '@/components/dashboard';
import Button from '../shared/ui/Button';
import { useProtectedRoute } from '../shared/hooks/useProtectedRoute';
import PaginatedJobList from './components/PaginatedJobList';

/**
 * JobsPage Component
 * 
 * Handles the display and management of job listings in the organization dashboard
 * Uses the PaginatedJobList component which implements our new pagination and filtering features
 */
export default function JobsPage() {
  // Protect this route - only employer can access
  const { isAuthorized, loading: authLoading } = useProtectedRoute('employer');
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <UnifiedDashboardLayout 
      // Removing title to prevent duplication
      title="" 
      description=""
      userRole="employer"
      userInfo={{
        name: 'Demo User',
        company: 'TalentSpottingAI Inc.',
      }}
      breadcrumbs={[
        { label: 'Dashboard', href: '/organization-dashboard' },
        { label: 'Jobs' }
      ]}
      className="pt-0 mt-0" // Removing padding at the top
      actions={
        <Button
          variant="primary"
          size="md"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          }
          onClick={() => router.push('/organization-dashboard/jobs/create')}
        >
          Create Job
        </Button>
      }
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {authLoading || isLoading ? (
          <div className="animate-pulse flex flex-col space-y-4 w-full p-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ) : (
          <PaginatedJobList initialFilter="all" />
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
