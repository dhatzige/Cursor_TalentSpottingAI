'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import Jobs from './jobs';
import { useProtectedRoute } from '../../lib/hooks/useProtectedRoute';
import { useDashboardData } from '../../hooks/useDashboardData';

// Tab components
import OverviewTab from '../components/dashboard/tabs/OverviewTab';
import JobsTab from '../components/dashboard/tabs/JobsTab';
import CandidatesTab from '../components/dashboard/tabs/CandidatesTab';
import AnalyticsTab from '../components/dashboard/tabs/AnalyticsTab';

export default function OrganizationDashboardPage() {
  // Protect this route - only employer can access
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  const router = useRouter();
  
  // Active tab state for the dashboard
  const [activeTab, setActiveTab] = useState('overview');
    
  // State for job management view
  const [showJobManagement, setShowJobManagement] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);

  // Fetch dashboard data using custom hook
  const { data, isLoading, error, refetch } = useDashboardData(authLoading);

  // Handler for showing job form
  const handleShowJobForm = () => {
    setShowJobManagement(true);
    setShowJobForm(true);
  };

  return (
    <DashboardLayout title="Organization Dashboard" userRole="employer">
      <div className="p-6 max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col gap-4 items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        ) : (
          showJobManagement ? (
            <Jobs 
              initialJobs={data?.jobs || []}
              showJobForm={showJobForm} 
              onBack={() => {
                setShowJobManagement(false);
                setShowJobForm(false);
                // Refresh data when returning from job management
                refetch();
              }}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Organization Dashboard</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage your organization's recruiting activities</p>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => router.push('/organization-dashboard/candidates')}
                    className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    View Candidates
                  </button>
                  <button 
                    onClick={() => setShowJobManagement(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Manage Jobs
                  </button>
                </div>
              </div>
              
              {/* Tab navigation */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'overview'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'jobs'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    Jobs
                  </button>
                  <button
                    onClick={() => setActiveTab('candidates')}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'candidates'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    Candidates
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'analytics'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
                  >
                    Analytics
                  </button>
                </nav>
              </div>
              
              {/* Tab content */}
              <div className="mt-4">
                {activeTab === 'overview' && data && (
                  <OverviewTab 
                    stats={data.stats} 
                    jobs={data.jobs} 
                    candidates={data.candidates}
                    onShowJobManagement={() => setShowJobManagement(true)}
                    onShowJobForm={handleShowJobForm}
                  />
                )}
                
                {activeTab === 'jobs' && (
                  <JobsTab />
                )}
                
                {activeTab === 'candidates' && (
                  <CandidatesTab />
                )}
                
                {activeTab === 'analytics' && (
                  <AnalyticsTab />
                )}
              </div>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
