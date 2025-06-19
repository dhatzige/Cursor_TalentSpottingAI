'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

// Import our unified dashboard layout system
import { UnifiedDashboardLayout } from '@/components/dashboard';
import { useProtectedRoute } from '../shared/hooks/useProtectedRoute';

// Import the advanced search component directly
import AdvancedSearch from './components/AdvancedSearch';

export default function SearchPage() {
  // Protect the route for authenticated users only
  const { isAuthorized, loading: authLoading } = useProtectedRoute('employer');
  
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
      // Removing title from the header to prevent duplication
      title="" 
      description=""
      userRole="employer"
      userInfo={{
        name: 'Demo User',
        company: 'TalentSpottingAI Inc.',
      }}
      breadcrumbs={[
        { label: 'Dashboard', href: '/organization-dashboard' },
        { label: 'Advanced Search' }
      ]}
      className="pt-0 mt-0" // Removing padding at the top
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        {authLoading || isLoading ? (
          <div className="animate-pulse flex flex-col space-y-4 w-full p-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ) : (
          <AdvancedSearch isLoading={isLoading} />
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
