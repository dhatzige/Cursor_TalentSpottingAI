'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';

/**
 * Student Dashboard No-Auth Version
 * 
 * This is a version of the student dashboard that doesn't require authentication,
 * useful for development and testing purposes.
 */
export default function StudentDashboardNoAuth() {
  // Mock user info for development
  const userInfo = {
    name: 'Test Student',
    role: 'Student',
  };

  // Dashboard content
  const content = (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 dark:text-white mb-4">Development Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This is a non-authenticated version of the student dashboard for development purposes.
          It provides access to all dashboard pages without requiring login.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <Link 
            href="/student-dashboard/profile" 
            className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
          >
            <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and manage your student profile
            </p>
          </Link>
          
          <Link 
            href="/student-dashboard/applications" 
            className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors"
          >
            <h3 className="font-medium text-green-700 dark:text-green-300 mb-2">Applications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your job applications
            </p>
          </Link>
          
          <Link 
            href="/student-dashboard/jobs" 
            className="block p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors"
          >
            <h3 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Find Jobs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Search and apply for job opportunities
            </p>
          </Link>
          
          <Link 
            href="/student-dashboard/settings" 
            className="block p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-800/30 transition-colors"
          >
            <h3 className="font-medium text-orange-700 dark:text-orange-300 mb-2">Settings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your account preferences
            </p>
          </Link>
        </div>
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Development Mode</h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                This is a development version of the dashboard. For the authenticated version, 
                go to <Link href="/student-dashboard" className="underline font-medium">Student Dashboard</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Define layout props with children included
  const layoutProps = {
    title: "Student Dashboard (Dev Mode)",
    userRole: "student" as const,
    userInfo,
    breadcrumbs: [
      { label: 'Student Dashboard (No Auth)' }
    ],
    children: content
  };

  return <UnifiedDashboardLayout {...layoutProps} />;
}
