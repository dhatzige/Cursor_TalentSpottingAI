'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSafeSearchParams } from '@/lib/hooks/useSafeSearchParams';
import DashboardLayout from '../../components/DashboardLayout';
import { EmployerService } from '../../../lib/api';
import { useProtectedRoute } from '../../../lib/hooks/useProtectedRoute';

// Import modular components
import {
  StatusFilter,
  ApplicationsHeader,
  ErrorDisplay,
  ComparisonControl,
  ApplicationsContent,
  LoadingState,
  ComparisonView
} from './components';

// Import shared types
import { Application, ApplicationStatus } from '../../../types/application';

// Types
interface Job {
  id: string;
  title: string;
  company: string;
  status: 'open' | 'closed' | 'draft';
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export default function ApplicationReviewPage() {
  // Protect this route - only employers can access
    const { loading: authLoading } = useProtectedRoute(['employer']);
  
  const router = useRouter();
  const searchParams = useSafeSearchParams();
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
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the API
      const updatedApplication = await EmployerService.updateApplicationStatus(applicationId, newStatus);
      
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
      
      // Show success notification
      alert(`Application status updated to ${newStatus}`);
    } catch (error: any) {
      console.error('Error updating application status:', error);
      setError(`Failed to update application status: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add note to application
  const handleAddNote = async (applicationId: string, content: string) => {
    if (!applicationId || !content) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the API
      await EmployerService.addApplicationNote(applicationId, content);
      
      // Optimistically update the UI with the new note
      if (selectedApplication && selectedApplication.id === applicationId) {
        const newNote: Note = {
          id: new Date().toISOString(), // Temporary unique ID
          content,
          createdAt: new Date().toISOString(),
          createdBy: 'Me' // Placeholder for current user
        };

        setSelectedApplication({
          ...selectedApplication,
          notes: [...(selectedApplication.notes || []), newNote]
        });
      }
      
      // Show success notification
      alert('Note added successfully');
    } catch (error: any) {
      console.error('Error adding application note:', error);
      setError(`Failed to add note: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Close the details view
  const handleCloseDetails = () => {
    setSelectedApplication(null);
    // Update the URL without the application ID
    if (jobId) {
      router.push(`/organization-dashboard/applications?jobId=${jobId}`);
    } else {
      router.push('/organization-dashboard/applications');
    }
  };
  
  return (
    <DashboardLayout title="Application Review" userRole="employer">
      {isLoading && !applications.length ? (
        <LoadingState />
      ) : showComparison ? (
        <ComparisonView 
          applications={applications}
          jobId={jobId || ''}
          onClose={() => {
            setShowComparison(false);
            // Remove compare parameter from URL
            router.push('/organization-dashboard/applications' + (jobId ? `?jobId=${jobId}` : ''));
          }}
        />
      ) : (
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header */}
          <ApplicationsHeader 
            job={job} 
            applicationCount={applications.length} 
            error={error} 
          />
          
          {/* Status filter */}
          <div className="mb-6">
            <StatusFilter 
              selectedStatus={statusFilter} 
              onStatusChange={setStatusFilter} 
            />
          </div>
          
          {/* Error display */}
          <ErrorDisplay error={error} />
          
          {/* Comparison control */}
          <ComparisonControl 
            applications={applications} 
            jobId={jobId} 
            onCompareStart={() => setShowComparison(true)} 
          />
          
          {/* Applications content */}
          <ApplicationsContent 
            applications={filteredApplications}
            selectedApplication={selectedApplication}
            onSelectApplication={handleViewApplication}
            onStatusUpdate={handleUpdateStatus}
            onAddNote={handleAddNote}
            onCloseDetails={handleCloseDetails}
            job={job}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
