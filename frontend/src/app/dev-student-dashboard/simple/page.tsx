'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';

/**
 * Simple fallback dashboard to test rendering
 */
export default function SimpleDevDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-white mb-6">
          Student Dashboard (Simple Version)
        </h1>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-2xl font-bold">
              A
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 dark:text-white">Alex Johnson</h2>
              <p className="text-gray-600 dark:text-gray-300">Computer Science • Class of 2025</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
              <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Profile Completion</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">65% complete</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-4">Dashboard Navigation</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <Link href="/dev-student-dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Dashboard Home
                </Link>
              </li>
              <li>
                <Link href="/dev-student-dashboard/applications" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Applications
                </Link>
              </li>
              <li>
                <Link href="/dev-student-dashboard/job-search" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href="/dev-student-dashboard/profile" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/dev-student-dashboard/settings" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-4">Recent Applications</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Software Engineer Intern</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">StartupX</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  Pending
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Junior Developer</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">BigTech Inc.</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  Interview
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
