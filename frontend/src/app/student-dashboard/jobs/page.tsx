'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import JobsSearch from './components/JobsSearch';
import { useUser } from '@clerk/nextjs';

/**
 * Student dashboard job search page
 * Integrates job search functionality within the dashboard layout
 */
export default function StudentJobsPage() {
  const { user } = useUser();
  
  // Create the job search content
  const jobsContent = (
    <JobsSearch />
  );

  // Check if we're in development environment
  const isDev = process.env.NODE_ENV === 'development';

  // Return the layout with consistent styling
  return (
    <UnifiedDashboardLayout children={jobsContent} />
  );
}
