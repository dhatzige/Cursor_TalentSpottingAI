'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';
import Button from '../../components/Button';
import { StudentService } from '../../../lib/api';
import { useProtectedRoute } from '../../../lib/hooks/useProtectedRoute';

interface ApplicationItem {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  status: 'pending' | 'interview' | 'accepted' | 'rejected';
  appliedDate: string;
  lastUpdated: string;
  feedback?: string;
}

export default function ApplicationsPage() {
  // Protect this route - only students can access
  const { loading: authLoading } = useProtectedRoute(['student'], '/login');
  
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Skip loading if still authenticating
    if (authLoading) return;
    
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In the future, we'll update the StudentService to include getAllApplications
        // For now, we're using mocked data
        
        // Mock data for demonstration
        const mockApplications: ApplicationItem[] = [
          {
            id: '1',
            jobId: 'job1',
            title: 'Frontend Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            status: 'pending',
            appliedDate: '2025-05-10T12:00:00Z',
            lastUpdated: '2025-05-10T12:00:00Z'
          },
          {
            id: '2',
            jobId: 'job2',
            title: 'UX Designer',
            company: 'Creative Solutions',
            location: 'Remote',
            status: 'interview',
            appliedDate: '2025-05-05T09:30:00Z',
            lastUpdated: '2025-05-12T14:20:00Z'
          },
          {
            id: '3',
            jobId: 'job3',
            title: 'Data Analyst Intern',
            company: 'DataDrive Analytics',
            location: 'Boston, MA',
            status: 'accepted',
            appliedDate: '2025-04-28T15:45:00Z',
            lastUpdated: '2025-05-15T10:15:00Z',
            feedback: 'We were impressed with your analytical skills and previous project experience.'
          },
          {
            id: '4',
            jobId: 'job4',
            title: 'Mobile App Developer',
            company: 'AppWorks',
            location: 'Austin, TX',
            status: 'rejected',
            appliedDate: '2025-04-15T08:20:00Z',
            lastUpdated: '2025-05-01T11:30:00Z',
            feedback: 'Thank you for your interest. We have decided to move forward with candidates who have more experience with Flutter development.'
          }
        ];
        
        setApplications(mockApplications);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError('Failed to load your applications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [authLoading]);

  // Filter applications based on selected status
  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  // Status badge component
  const StatusBadge = ({ status }: { status: ApplicationItem['status'] }) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      interview: { color: 'bg-blue-100 text-blue-800', label: 'Interview Stage' },
      accepted: { color: 'bg-green-100 text-green-800', label: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Not Selected' }
    };
    
    const config = statusConfig[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <DashboardLayout title="My Applications" userRole="student">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Applications</h1>
          
          <Link href="/student-dashboard">
            <Button variant="outline">
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col gap-4 items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">No Applications Yet</h2>
            <p className="text-gray-500 mb-6">
              You haven't applied for any jobs yet. Start by browsing available positions.
            </p>
            <Link href="/student-dashboard">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Filter Controls */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterStatus === 'all' 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All Applications
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterStatus === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800 font-medium' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('interview')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterStatus === 'interview' 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Interview
              </button>
              <button
                onClick={() => setFilterStatus('accepted')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterStatus === 'accepted' 
                    ? 'bg-green-100 text-green-800 font-medium' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Accepted
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterStatus === 'rejected' 
                    ? 'bg-red-100 text-red-800 font-medium' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Not Selected
              </button>
            </div>
            
            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.length === 0 ? (
                <div className="bg-white p-4 rounded-lg text-center text-gray-500">
                  No applications match the selected filter.
                </div>
              ) : (
                filteredApplications.map(application => (
                  <div key={application.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="sm:flex sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {application.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-1">
                            {application.company} • {application.location}
                          </p>
                          <div className="mb-2">
                            <StatusBadge status={application.status} />
                          </div>
                          <p className="text-sm text-gray-500">
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                            {application.lastUpdated !== application.appliedDate && (
                              <span> • Updated: {new Date(application.lastUpdated).toLocaleDateString()}</span>
                            )}
                          </p>
                        </div>
                        
                        <div className="mt-4 sm:mt-0">
                          <Link href={`/job-application?id=${application.jobId}`}>
                            <Button variant="outline" className="text-sm px-4 py-2">
                              View Job
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      {/* Feedback section for accepted/rejected applications */}
                      {(application.status === 'accepted' || application.status === 'rejected') && application.feedback && (
                        <div className={`mt-4 p-3 rounded-md ${
                          application.status === 'accepted' ? 'bg-green-50' : 'bg-gray-50'
                        }`}>
                          <h4 className="text-sm font-medium mb-1">Feedback from Employer</h4>
                          <p className="text-sm">{application.feedback}</p>
                        </div>
                      )}
                      
                      {/* Interview section */}
                      {application.status === 'interview' && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                          <h4 className="text-sm font-medium mb-1">Interview Status</h4>
                          <p className="text-sm">Your application is being reviewed for an interview. Check your email for further instructions.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
