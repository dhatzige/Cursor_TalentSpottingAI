'use client';

import React, { useState } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import JobsSearch from './components/JobsSearch';
import { useAuth } from '@/lib/hooks/useAuth';

/**
 * Student dashboard job search page
 * Integrates job search functionality within the dashboard layout
 */
export default function StudentJobsPage() {
  const { user } = useAuth();
  
  // Create the job search content
  const jobsContent = (
    <JobsSearch />
  );

  // Check if we're in development environment
  const isDev = process.env.NODE_ENV === 'development';

  // Return the layout with consistent styling
  return (
    <UnifiedDashboardLayout
      // Removing title to prevent duplication
      title="" 
      description=""
      userRole="student"
      userInfo={{
        name: user?.name || 'Student',
        role: 'Student',
      }}
      breadcrumbs={[
        // If in development, link to the no-auth version
        { label: 'Dashboard', href: isDev ? '/student-dashboard-noauth' : '/student-dashboard' },
        { label: 'Find Jobs' }
      ]}
      className="pt-0 mt-0" // Removing padding at the top
      children={jobsContent} // Explicitly set children prop to fix TypeScript error
    >
      {jobsContent}
    </UnifiedDashboardLayout>
  );
}
