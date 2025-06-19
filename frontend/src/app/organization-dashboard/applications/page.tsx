'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSafeSearchParams } from '@/lib/hooks/useSafeSearchParams';
import { UnifiedDashboardLayout } from '../../../components/dashboard';
import { EmployerService } from '../../../lib/api';
import { useProtectedRoute } from '../../../lib/hooks/useProtectedRoute';

// Import modular components
import {
  ApplicationsHeader,
  ErrorDisplay,
  ComparisonControl,
  ApplicationDetails,
  LoadingState,
  ComparisonView
} from './components';
import PaginatedApplicationsList from './components/PaginatedApplicationsList';

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
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  
  const router = useRouter();
  const searchParams = useSafeSearchParams();
  const jobId = searchParams.get('jobId');
  const compareParam = searchParams.get('compare');
  const applicationId = searchParams.get('id');
  
  // State
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    // Initialize comparison mode if compare parameter exists
    if (compareParam) {
      setShowComparison(true);
    }
    
    // Skip loading if still authenticating
    if (authLoading) return;
    
    // Only load job data independently if we have an applicationId (for application details) or compareParam
    const fetchJobData = async () => {
      if (!applicationId && !compareParam) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        if (applicationId) {
          // Handle single application view
          try {
            const fetchedApplication = await EmployerService.getApplicationById(applicationId) as Application;
            setSelectedApplication(fetchedApplication);
            
            // Get the job details
            const jobDetails = await EmployerService.getJobById(fetchedApplication.jobId);
            setJob({
              id: jobDetails.id,
              title: jobDetails.title,
              company: jobDetails.company,
              status: (jobDetails.status === 'open' || jobDetails.status === 'closed' || jobDetails.status === 'draft') 
                ? jobDetails.status as 'open' | 'closed' | 'draft'
                : 'open'
            });
          } catch (appErr) {
            console.error('Application not found: ', appErr);
            setError('Application not found');
          }
        } else if (compareParam) {
          // Handle comparison view with applications from different jobs
          const applicationIds = compareParam.split(',');
          const fetchedApplications = await EmployerService.getApplicationsByIds(applicationIds) as Application[];
          
          if (fetchedApplications.length > 0) {
            // Get the job details for the first application
            const firstJobId = fetchedApplications[0].jobId;
            try {
              const jobDetails = await EmployerService.getJobById(firstJobId);
              setJob({
                id: jobDetails.id,
                title: jobDetails.title,
                company: jobDetails.company,
                status: (jobDetails.status === 'open' || jobDetails.status === 'closed' || jobDetails.status === 'draft') 
                  ? jobDetails.status as 'open' | 'closed' | 'draft'
                  : 'open'
              });
            } catch (jobErr) {
              console.warn('Could not fetch job details: ', jobErr);
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching application data:', err);
        setError('Failed to load application data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobData();
  }, [authLoading, compareParam, applicationId]);

  // Update application status handler for the ApplicationDetails component
  const handleUpdateStatus = async (applicationId: string, newStatus: ApplicationStatus, feedback?: string) => {
    if (!applicationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the API
      await EmployerService.updateApplicationStatus(applicationId, newStatus);
      
      // Update selected application if it's the one we just updated
      if (selectedApplication && selectedApplication.id === applicationId) {
        setSelectedApplication({
          ...selectedApplication,
          status: newStatus,
          feedback: feedback || selectedApplication.feedback,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.error('Error updating application status:', err);
      setError('Failed to update application status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a note to an application
  const handleAddNote = async (applicationId: string, noteContent: string) => {
    if (!applicationId || !noteContent.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the API
      const response = await EmployerService.addApplicationNote(applicationId, noteContent);
      
      // Handle the response which could be a success message or a Note object
      if (response && typeof response === 'object' && 'id' in response && 'content' in response && 'createdAt' in response && 'createdBy' in response) {
        // It's a valid Note object with all required properties
        const newNote = response as Note;
        
        // Update the selected application if it matches
        if (selectedApplication && selectedApplication.id === applicationId) {
          setSelectedApplication({
            ...selectedApplication,
            notes: [...(selectedApplication.notes || []), newNote]
          });
        }
      }
    } catch (err: any) {
      console.error('Error adding note:', err);
      setError('Failed to add note. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Close application details
  const handleCloseApplication = () => {
    setSelectedApplication(null);
    
    // Reset URL params if viewing a single application
    if (applicationId) {
      router.push(`/organization-dashboard/applications${jobId ? `?jobId=${jobId}` : ''}`);
    }
  };

  // Toggle comparison view
  const handleToggleComparison = () => {
    setShowComparison(!showComparison);
    
    // Reset URL if coming out of comparison view
    if (showComparison && compareParam) {
      router.push(`/organization-dashboard/applications${jobId ? `?jobId=${jobId}` : ''}`);
    }
  };

  // Add to comparison
  const handleAddToComparison = (applicationId: string) => {
    router.push(`/organization-dashboard/applications?compare=${applicationId}`);
  };

  // Handle viewing an application's details
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    
    // Update URL to include application ID for deep linking
    if (jobId) {
      router.push(`/organization-dashboard/applications?jobId=${jobId}&id=${application.id}`);
    } else {
      router.push(`/organization-dashboard/applications?id=${application.id}`);
    }
  };

  // Render appropriate content based on context
  const renderContent = () => {
    if (authLoading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorDisplay error={error} />;
    }
    
    if (showComparison && compareParam) {
      // In a real implementation, we would fetch applications by ids here
      // For now, we'll pass an empty array as we need to update the component later
      return (
        <ComparisonView 
          applications={[]}
          jobId={jobId || ''}
          onClose={handleToggleComparison}
        />
      );
    }
    
    return (
      <div className="space-y-6">
        {job && (
          <ApplicationsHeader 
            job={job}
            applicationCount={0} // Will be updated from PaginatedApplicationsList
            error={null}
          />
        )}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Applications list with pagination */}
          <div className={`${selectedApplication ? 'lg:w-1/2' : 'w-full'}`}>
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <ComparisonControl 
                  applications={[]} // We'll use the paginated applications list instead
                  jobId={jobId || ''} 
                  onCompareStart={handleToggleComparison} 
                />
              </div>
              
              <div className="p-4">
                <PaginatedApplicationsList 
                  initialJobId={jobId || undefined}
                  onSelectApplication={handleViewApplication}
                />
              </div>
            </div>
          </div>
          
          {/* Application details */}
          {selectedApplication && (
            <div className="lg:w-1/2">
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow-md overflow-hidden h-full">
                <ApplicationDetails 
                  application={selectedApplication}
                  onClose={handleCloseApplication}
                  onStatusUpdate={handleUpdateStatus}
                  onAddNote={handleAddNote}
                  isEmployer={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <UnifiedDashboardLayout
      // Removing title to prevent duplication
      title=""
      description=""
      userRole="employer"
      userInfo={{
        name: 'Demo User',
        company: 'TalentSpottingAI Inc.',
      }}
      breadcrumbs={[
        { label: 'Dashboard', href: '/organization-dashboard' },
        { label: 'Applications' }
      ]}
      className="pt-0 mt-0" // Removing padding at the top
    >
      {renderContent()}
    </UnifiedDashboardLayout>
  );
}
