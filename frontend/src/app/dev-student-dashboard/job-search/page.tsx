'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import JobsSearch from '../../student-dashboard/jobs/components/JobsSearch';

/**
 * Job Search page for dev student dashboard
 * Uses the same integrated job search as the authenticated dashboard
 */
export default function DevStudentJobsPage() {
  // Create the job search content
  const jobsContent = (
    <JobsSearch />
  );

  // Mock user info for development
  const userInfo = {
    name: 'Alex Johnson',
    role: 'Student',
  };

  return (
    <UnifiedDashboardLayout children={jobsContent} />
  );
}
