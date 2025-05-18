'use client';

import { useState, useEffect } from 'react';
import { EmployerService } from '../../lib/api';
import { JobForm, JobTable, JobsHeader, LoadingState } from './jobs-components';

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

interface JobsProps {
  initialJobs?: JobItem[];
  showJobForm: boolean;
  onBack: () => void;
}

export default function Jobs({ initialJobs, showJobForm: initialShowForm, onBack }: JobsProps) {
  const [jobs, setJobs] = useState<JobItem[]>(initialJobs || []);
  const [isLoading, setIsLoading] = useState(!initialJobs);
  const [error, setError] = useState<string | null>(null);
  
  const [showJobForm, setShowJobForm] = useState(initialShowForm);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const fetchJobs = async () => {
    if (initialJobs) {
      setJobs(initialJobs);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const jobsData = await EmployerService.getAllJobs();
      setJobs(jobsData);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchJobs();
  }, []);
  
  const handleCreateJob = () => {
    setSelectedJob(null);
    setIsEditMode(false);
    setShowJobForm(true);
  };
  
  const handleEditJob = (job: JobItem) => {
    setSelectedJob(job);
    setIsEditMode(true);
    setShowJobForm(true);
  };
  
  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) {
      return;
    }
    
    try {
      await EmployerService.deleteJob(jobId);
      // Remove the deleted job from the state
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (err: any) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job. Please try again.');
    }
  };
  
  const handleJobFormSubmit = async (jobData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isEditMode && selectedJob) {
        await EmployerService.updateJob(selectedJob.id, jobData);
      } else {
        await EmployerService.createJob(jobData);
      }
      
      // Refresh the job list
      const updatedJobs = await EmployerService.getAllJobs();
      setJobs(updatedJobs);
      
      // Close the form
      setShowJobForm(false);
    } catch (err: any) {
      console.error('Error submitting job:', err);
      setError(err?.response?.data?.message || 'Failed to submit job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelForm = () => {
    setShowJobForm(false);
  };
  
  const handleChangeStatus = async (jobId: string, newStatus: 'open' | 'closed' | 'draft') => {
    try {
      await EmployerService.updateJobStatus(jobId, newStatus);
      // Update the job status in the state
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
    } catch (err: any) {
      console.error('Error updating job status:', err);
      alert('Failed to update job status. Please try again.');
    }
  };
  
  return (
    <div className="space-y-6">
      <JobsHeader 
        showJobForm={showJobForm}
        onBack={onBack}
        onCreateJob={handleCreateJob}
      />
      
      {error && !showJobForm && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      {isLoading && !showJobForm ? (
        <LoadingState />
      ) : showJobForm ? (
        <JobForm 
          job={selectedJob}
          isEditMode={isEditMode}
          isLoading={isLoading}
          error={error}
          onSubmit={handleJobFormSubmit}
          onCancel={handleCancelForm}
        />
      ) : (
        <JobTable 
          jobs={jobs}
          onEditJob={handleEditJob}
          onDeleteJob={handleDeleteJob}
          onChangeStatus={handleChangeStatus}
        />
      )}
    </div>
  );
}
