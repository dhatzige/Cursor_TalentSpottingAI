'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { UnifiedDashboardLayout } from '@/components/dashboard';

/**
 * Applications page for the student dashboard (dev mode)
 * This version fixes the duplicate heading issue by not using a heading in the page content
 * since UnifiedDashboardLayout already includes the page title as a heading
 */
export default function ApplicationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock user info
  const userInfo = {
    name: 'Alex Johnson',
    role: 'Student',
  };

  // Mock applications data
  type ApplicationStatus = 'pending' | 'interview' | 'accepted' | 'rejected';
  
  interface ApplicationItem {
    id: string;
    title: string;
    company: string;
    status: ApplicationStatus;
    timestamp: string;
  }
  
  const applications: ApplicationItem[] = [
    {
      id: 'app1',
      title: 'Software Engineer Intern',
      company: 'StartupX',
      status: 'pending',
      timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: 'app2',
      title: 'Junior Developer',
      company: 'BigTech Inc.',
      status: 'interview',
      timestamp: new Date(Date.now() - 86400000 * 7).toISOString() // 7 days ago
    },
    {
      id: 'app3',
      title: 'Mobile Developer',
      company: 'AppWorks',
      status: 'rejected',
      timestamp: new Date(Date.now() - 86400000 * 14).toISOString() // 14 days ago
    },
    {
      id: 'app4',
      title: 'Frontend Engineer',
      company: 'WebSolutions',
      status: 'accepted',
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
    },
    {
      id: 'app5',
      title: 'Product Developer',
      company: 'InnovateX',
      status: 'pending',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
    }
  ];

  // Status filters
  const statusFilters = [
    { id: 'all', label: 'All Applications', count: applications.length },
    { id: 'pending', label: 'Pending', count: applications.filter(app => app.status === 'pending').length },
    { id: 'interview', label: 'Interview', count: applications.filter(app => app.status === 'interview').length },
    { id: 'accepted', label: 'Accepted', count: applications.filter(app => app.status === 'accepted').length },
    { id: 'rejected', label: 'Rejected', count: applications.filter(app => app.status === 'rejected').length }
  ];
  
  // Filter applications based on selected status
  const filteredApplications = selectedStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);

  // Function to get status badge styles
  const getStatusBadgeStyle = (status: ApplicationStatus) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'interview':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Create the applications content - NO HEADING HERE to avoid duplication
  const applicationsContent = (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Status filter tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px space-x-6 overflow-x-auto pb-1">
              {statusFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedStatus(filter.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    selectedStatus === filter.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {filter.label} <span className="ml-1 text-gray-400 dark:text-gray-500">({filter.count})</span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Applications list */}
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No applications found for the selected filter.</p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <div key={application.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white">{application.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{application.company}</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Applied on {formatDate(application.timestamp)}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex ${getStatusBadgeStyle(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        View Details
                      </button>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <button className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );

  return <UnifiedDashboardLayout children={applicationsContent} />;
}
