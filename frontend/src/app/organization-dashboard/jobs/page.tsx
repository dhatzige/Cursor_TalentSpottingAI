'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import Button from '../../components/Button';
import { EmployerService } from '../../../lib/api';
import { useProtectedRoute } from '../../../lib/hooks/useProtectedRoute';

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  postDate: string;
  status: string;
  applicantCount: number;
  skills?: string[];
}

export default function JobsPage() {
  // Protect this route - only employer can access
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'closed' | 'draft'>('all');

  useEffect(() => {
    // Skip loading if still authenticating
    if (authLoading) return;
    
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedJobs = await EmployerService.getAllJobs();
        setJobs(fetchedJobs);
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [authLoading]);

  // Filter jobs based on status
  const filteredJobs = activeFilter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === activeFilter);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <DashboardLayout title="Jobs Management" userRole="employer">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <button 
              onClick={() => router.push('/organization-dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-semibold">Jobs Management</h1>
            <p className="text-gray-600">Create and manage job postings for your organization</p>
          </div>
          
          <Button
            onClick={() => router.push('/organization-dashboard/jobs/create')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Job
          </Button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}
        
        {/* Job Status Filter */}
        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${activeFilter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeFilter === 'open' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveFilter('open')}
          >
            Open
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeFilter === 'closed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveFilter('closed')}
          >
            Closed
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeFilter === 'draft' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveFilter('draft')}
          >
            Draft
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col gap-4 items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">
              {activeFilter === 'all' 
                ? 'No jobs found' 
                : `No ${activeFilter} jobs found`}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeFilter === 'all' 
                ? 'Get started by creating your first job posting.' 
                : `You don't have any ${activeFilter} jobs at the moment.`}
            </p>
            {activeFilter === 'all' && (
              <Button
                onClick={() => router.push('/organization-dashboard/jobs/create')}
              >
                Create First Job
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicants
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(job.postDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.status === 'open' 
                          ? 'bg-green-100 text-green-800' 
                          : job.status === 'closed' 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.applicantCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => router.push(`/organization-dashboard/applications?jobId=${job.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Applicants
                        </button>
                        <button 
                          onClick={() => router.push(`/organization-dashboard/jobs/edit?id=${job.id}`)}
                          className="text-gray-600 hover:text-gray-900 ml-2"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
