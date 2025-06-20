'use client';

export const dynamic = 'force-dynamic';

import React, { ReactNode } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

export default function ProfilePage() {
  // Protect this route - only students can access
    const { loading: authLoading } = useProtectedRoute(['student']);
  
  // Mock user info - In a real application, this would come from auth context
  const userInfo = {
    name: 'Alex Johnson',
    role: 'Student',
  };

  // Define the content that will go inside the layout
  const content = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 dark:text-white">My Profile</h1>
        
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
          Edit Profile
        </button>
      </div>
      
      {/* Profile Information Card */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="flex-grow space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-white">Alex Johnson</h2>
              <p className="text-gray-600 dark:text-gray-400">Computer Science Student</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                <p className="mt-1 text-gray-900 dark:text-gray-100 dark:text-white">alex.johnson@university.edu</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                <p className="mt-1 text-gray-900 dark:text-gray-100 dark:text-white">(555) 123-4567</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">University</h3>
                <p className="mt-1 text-gray-900 dark:text-gray-100 dark:text-white">University of Technology</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Year</h3>
                <p className="mt-1 text-gray-900 dark:text-gray-100 dark:text-white">Senior (4th Year)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Education Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white mb-4">Education</h2>
        <div className="border-l-2 border-blue-500 pl-4 space-y-6">
          <div>
            <div className="flex justify-between">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white">University of Technology</h3>
              <span className="text-gray-500 dark:text-gray-400">2022 - Present</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Bachelor of Science in Computer Science</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">GPA: 3.8/4.0</p>
          </div>
          <div>
            <div className="flex justify-between">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white">City Community College</h3>
              <span className="text-gray-500 dark:text-gray-400">2020 - 2022</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">Associate's Degree in Computer Science</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">GPA: 3.9/4.0</p>
          </div>
        </div>
      </div>
      
      {/* Skills Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'React', 'Node.js', 'TypeScript', 'HTML/CSS', 'Python', 'Data Analysis', 'UI/UX Design', 'Git', 'Problem Solving'].map(skill => (
            <span key={skill} className="px-3 py-1 bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-200 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      {/* Resume Section */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white">Resume</h2>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors">
            Upload New
          </button>
        </div>
        <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md mr-3">
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 dark:text-gray-100 dark:text-white font-medium">Alex_Johnson_Resume.pdf</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded on May 15, 2025</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Check if we're in development environment
  const isDev = process.env.NODE_ENV === 'development';
  
  // Return the layout with content as children
  return (
    <UnifiedDashboardLayout
      // Removing title to prevent duplication
      title="" 
      description=""
      userRole="student"
      userInfo={userInfo}
      breadcrumbs={[
        // If in development, link to the no-auth version
        { label: 'Dashboard', href: isDev ? '/student-dashboard-noauth' : '/student-dashboard' },
        { label: 'Profile' }
      ]}
      className="pt-0 mt-0" // Removing padding at the top
      children={content} // Explicitly set children prop to fix TypeScript error
    >
      {content}
    </UnifiedDashboardLayout>
  );
}
