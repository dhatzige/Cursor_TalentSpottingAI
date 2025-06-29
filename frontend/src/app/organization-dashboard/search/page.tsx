'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

// Import our unified dashboard layout system
import { UnifiedDashboardLayout } from '@/components/dashboard';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

// Import the advanced search component directly
import AdvancedSearch from './components/AdvancedSearch';

export default function SearchPage() {
  // Protect the route for authenticated users only
    const { loading: authLoading } = useProtectedRoute(['employer']);
  
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
