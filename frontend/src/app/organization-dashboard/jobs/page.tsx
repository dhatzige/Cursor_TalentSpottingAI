'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import our unified dashboard layout system
import { UnifiedDashboardLayout } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';
import PaginatedJobList from './components/PaginatedJobList';

/**
 * JobsPage Component
 * 
 * Handles the display and management of job listings in the organization dashboard
 * Uses the PaginatedJobList component which implements our new pagination and filtering features
 */
export default function JobsPage() {
  // Protect this route - only employer can access
    const { loading: authLoading } = useProtectedRoute(['employer']);
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
    <UnifiedDashboardLayout>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Listings</h1>
          <Button
            onClick={() => router.push('/organization-dashboard/jobs/create')}
          >
            Create Job
          </Button>
        </div>
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
