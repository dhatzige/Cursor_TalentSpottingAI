'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import Button from '../../components/Button';
import { EmployerService } from '../../../lib/api';
import { useProtectedRoute } from '../../../lib/hooks/useProtectedRoute';

// Import modular components
import StatusFilter from './components/StatusFilter';
import ApplicationsList from './components/ApplicationsList';
import ApplicationDetails from './components/ApplicationDetails';
import ComparisonView from './components/comparison/ComparisonView';

// Import shared types
import { Application, ApplicationStatus } from '../../../types/application';

// Types
interface Job {
  id: string;
  title: string;
  company: string;
  status: 'open' | 'closed' | 'draft';
}

export default function ApplicationReviewPage() {
  // Protect this route - only employers can access
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const compareParam = searchParams.get('compare');
  const applicationId = searchParams.get('id');
  
  // State
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    // Initialize comparison mode if compare parameter exists
    if (compareParam) {
      setShowComparison(true);
    }
    
    // Skip loading if still authenticating
    if (authLoading) return;
    
    const fetchApplicationsData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Load applications based on different entry points
        if (compareParam) {
          // Handle comparison view with applications from different jobs
          const applicationIds = compareParam.split(',');
          const fetchedApplications = await EmployerService.getApplicationsByIds(applicationIds) as Application[];
          setApplications(fetchedApplications);
          
          if (fetchedApplications.length > 0) {
            // Get the job details for the first application
            const firstJobId = fetchedApplications[0].jobId;
            try {
              const jobDetails = await EmployerService.getJobById(firstJobId);
              setJob({
                id: jobDetails.id,
                title: jobDetails.title,
                company: jobDetails.company,
                // Convert string status to union type
                status: (jobDetails.status === 'open' || jobDetails.status === 'closed' || jobDetails.status === 'draft') 
                  ? jobDetails.status as 'open' | 'closed' | 'draft'
                  : 'open'
              });
            } catch (jobErr) {
              console.warn('Could not fetch job details: ', jobErr);
            }
          }
        } else if (applicationId) {
          // Handle single application view
          try {
            const fetchedApplication = await EmployerService.getApplicationById(applicationId) as Application;
            setApplications([fetchedApplication]);
            setSelectedApplication(fetchedApplication);
            
            // Get the job details
            const jobDetails = await EmployerService.getJobById(fetchedApplication.jobId);
            setJob({
              id: jobDetails.id,
              title: jobDetails.title,
              company: jobDetails.company,
              // Convert string status to union type
              status: (jobDetails.status === 'open' || jobDetails.status === 'closed' || jobDetails.status === 'draft') 
                ? jobDetails.status as 'open' | 'closed' | 'draft'
                : 'open'
            });
          } catch (appErr) {
            console.error('Application not found: ', appErr);
            setError('Application not found');
          }
        } else if (jobId) {
          // Standard job applications view
          const fetchedApplications = await EmployerService.getJobApplications(jobId) as Application[];
          setApplications(fetchedApplications);
          
          // Get the job details
          try {
            const jobDetails = await EmployerService.getJobById(jobId);
            setJob({
              id: jobDetails.id,
              title: jobDetails.title,
              company: jobDetails.company,
              // Convert string status to union type
              status: (jobDetails.status === 'open' || jobDetails.status === 'closed' || jobDetails.status === 'draft') 
                ? jobDetails.status as 'open' | 'closed' | 'draft'
                : 'open'
            });
          } catch (jobErr) {
            console.error('Could not fetch job details: ', jobErr);
            setError('Job not found');
          }
        } else {
          // No parameters - show all applications from first job
          const allJobs = await EmployerService.getAllJobs();
          if (allJobs.length > 0) {
            const firstJob = allJobs[0];
            const fetchedApplications = await EmployerService.getJobApplications(firstJob.id) as Application[];
            setApplications(fetchedApplications);
            setJob({
              id: firstJob.id,
              title: firstJob.title,
              company: firstJob.company,
              // Convert string status to union type
              status: (firstJob.status === 'open' || firstJob.status === 'closed' || firstJob.status === 'draft') 
                ? firstJob.status as 'open' | 'closed' | 'draft'
                : 'open'
            });
          }
        }
      } catch (err: any) {
        console.error('Error fetching applications data:', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplicationsData();
  }, [jobId, authLoading, compareParam, applicationId]);

  // Filter applications based on selected status
  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  // Open application details
  const handleViewApplication = (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      setSelectedApplication(application);
    }
  };

  // Update application status
  const handleUpdateStatus = async (applicationId: string, newStatus: ApplicationStatus, feedback?: string) => {
    if (!applicationId) return;
    
    // In a real implementation, this would call the API
    // For demonstration, we're updating the local state
    
    // Update the application in our local state
    const updatedApplications = applications.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status: newStatus,
          feedback: feedback || app.feedback,
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setApplications(updatedApplications);
    
    // Update selected application if it's the one being modified
    if (selectedApplication && selectedApplication.id === applicationId) {
      setSelectedApplication({
        ...selectedApplication,
        status: newStatus,
        feedback: feedback || selectedApplication.feedback,
        updatedAt: new Date().toISOString()
      });
    }
  };
  
  return (
    <DashboardLayout title="Application Review" userRole="employer">
      {/* Dashboard content */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <button 
              onClick={() => router.push(jobId ? '/organization-dashboard/jobs' : '/organization-dashboard/candidates')}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to {jobId ? "Jobs" : "Candidates"}
            </button>
            <h1 className="text-2xl font-semibold">
              Applications for {job?.title || 'Job Position'}
            </h1>
          </div>
          
          {job && (
            <div className="flex items-center">
              <span className={`px-2 py-1 text-xs font-medium rounded-full mr-2 ${
                job.status === 'open' 
                  ? 'bg-green-100 text-green-800' 
                  : job.status === 'closed' 
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
              <Button 
                variant="outline"
                onClick={() => router.push(`/organization-dashboard/jobs/edit?id=${job.id}`)}
              >
                Edit Job
              </Button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}
        
        {!isLoading && applications.length > 1 && !showComparison && (
          <div className="mb-6">
            <button
              onClick={() => setShowComparison(true)}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              Compare Candidates
            </button>
          </div>
        )}
        
        {showComparison ? (
          <ComparisonView 
            applications={applications}
            jobId={jobId || ''}
            onClose={() => {
              setShowComparison(false);
              // Remove compare parameter from URL
              router.push('/organization-dashboard/applications' + (jobId ? `?jobId=${jobId}` : ''));
            }}
          />
        ) : isLoading ? (
          <div className="flex flex-col gap-4 items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">No Applications Yet</h2>
            <p className="text-gray-500 mb-6">
              This job position hasn't received any applications yet.
            </p>
            <Button 
              onClick={() => router.push('/organization-dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side: Applications list with status filter */}
            <div className="w-full md:w-2/5">
              <StatusFilter 
                selectedStatus={statusFilter}
                onStatusChange={setStatusFilter} 
              />
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <ApplicationsList 
                  applications={filteredApplications}
                  selectedApplicationId={selectedApplication?.id}
                  onSelectApplication={handleViewApplication}
                  isEmployer={true}
                />
              </div>
            </div>
            
            {/* Right side: Application details */}
            <div className="w-full md:w-3/5">
              {selectedApplication ? (
                <ApplicationDetails 
                  application={selectedApplication}
                  onStatusUpdate={handleUpdateStatus}
                  isEmployer={true}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-medium mb-2">Select an Application</h2>
                  <p className="text-gray-500">
                    Choose an application from the list to view details.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
