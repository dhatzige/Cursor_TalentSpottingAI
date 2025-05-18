'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/DashboardLayout';
import { EmployerService } from '../../../../lib/api';
import { useProtectedRoute } from '../../../../lib/hooks/useProtectedRoute';

// Import modular components
import {
  JobEditForm,
  LoadingState,
  NotificationDisplay,
  PageHeader
} from './components';

// Import types
import { JobData, JobFormData, JobStatus } from './components/types';

export default function EditJobPage() {
  // Protect this route - only employer can access
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');
  
  const [job, setJob] = useState<JobData | null>(null);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    location: '',
    skillsInput: '',
    status: 'draft' as JobStatus
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Skip loading if still authenticating or no job ID (new job)
    if (authLoading) return;
    
    const fetchJobData = async () => {
      // Only fetch job data if editing an existing job
      if (!jobId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const jobData = await EmployerService.getJobById(jobId);
        
        // Convert API response to expected format
        const formattedJob: JobData = {
          id: jobData.id,
          title: jobData.title,
          description: jobData.description || '',
          location: jobData.location || '',
          skills: jobData.skills || [],
          status: (jobData.status === 'open' || jobData.status === 'closed' || jobData.status === 'draft') 
            ? jobData.status as JobStatus
            : 'draft'
          // Note: postDate from JobItem can be used if needed but not included in our JobData type
        };
        
        setJob(formattedJob);
        setFormData({
          title: formattedJob.title,
          description: formattedJob.description,
          location: formattedJob.location,
          skillsInput: formattedJob.skills.join(', '),
          status: formattedJob.status
        });
      } catch (err: any) {
        console.error('Error fetching job data:', err);
        setError('Failed to load job data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobData();
  }, [jobId, authLoading]);

  // Handler for form success
  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    
    // If it's a new job, redirect after a short delay
    if (!jobId) {
      setTimeout(() => {
        router.push('/organization-dashboard/jobs');
      }, 1500);
    }
  };
  
  // Handler for form errors
  const handleError = (message: string) => {
    setError(message);
  };
  
  // Handler for canceling the form
  const handleCancel = () => {
    router.push('/organization-dashboard/jobs');
  };

  return (
    <DashboardLayout title={jobId ? 'Edit Job' : 'Create Job'} userRole="employer">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header with back button and title */}
        <PageHeader isEditing={!!jobId} />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Success and error notifications */}
          <NotificationDisplay error={error} successMessage={successMessage} />
          
          {/* Loading state or form */}
          {isLoading ? (
            <LoadingState />
          ) : (
            <JobEditForm
              jobId={jobId}
              initialData={formData}
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
