'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/DashboardLayout';
import Button from '../../../components/Button';
import { EmployerService } from '../../../../lib/api';
import { useProtectedRoute } from '../../../../lib/hooks/useProtectedRoute';

interface JobData {
  id: string;
  title: string;
  description: string;
  location: string;
  skills: string[];
  status: 'open' | 'closed' | 'draft';
}

export default function EditJobPage() {
  // Protect this route - only employer can access
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id');
  
  const [job, setJob] = useState<JobData | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [status, setStatus] = useState<'open' | 'closed' | 'draft'>('draft');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
        
        // Convert to expected format
        const formattedJob: JobData = {
          id: jobData.id,
          title: jobData.title,
          description: jobData.description || '',
          location: jobData.location,
          skills: jobData.skills || [],
          status: (jobData.status === 'open' || jobData.status === 'closed' || jobData.status === 'draft') 
            ? jobData.status as 'open' | 'closed' | 'draft'
            : 'draft'
        };
        
        setJob(formattedJob);
        setTitle(formattedJob.title);
        setDescription(formattedJob.description);
        setLocation(formattedJob.location);
        setSkillsInput(formattedJob.skills.join(', '));
        setStatus(formattedJob.status);
      } catch (err: any) {
        console.error('Error fetching job data:', err);
        setError('Failed to load job data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobData();
  }, [jobId, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!title.trim()) {
      setError('Job title is required');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const skillsArray = skillsInput
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      const jobData = {
        title,
        description,
        location,
        skills: skillsArray
      };
      
      if (jobId) {
        // Update existing job
        await EmployerService.updateJob(jobId, jobData);
        setSuccessMessage('Job updated successfully');
      } else {
        // Create new job
        const newJob = await EmployerService.createJob(jobData);
        setSuccessMessage('Job created successfully');
        
        // Redirect to the job listing page after a short delay
        setTimeout(() => {
          router.push('/organization-dashboard/jobs');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error saving job:', err);
      setError('Failed to save job. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: 'open' | 'closed' | 'draft') => {
    if (!jobId) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      await EmployerService.updateJobStatus(jobId, newStatus);
      setStatus(newStatus);
      setSuccessMessage(`Job status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Error updating job status:', err);
      setError('Failed to update job status. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout title={jobId ? 'Edit Job' : 'Create Job'} userRole="employer">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => router.push('/organization-dashboard/jobs')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Jobs
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-6">
            {jobId ? 'Edit Job Posting' : 'Create New Job Posting'}
          </h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
              {successMessage}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex flex-col gap-4 items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading job data...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  id="description"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the responsibilities, qualifications, and benefits..."
                  rows={5}
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                />
              </div>
              
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills
                </label>
                <input
                  type="text"
                  id="skills"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. JavaScript, React, TypeScript (comma separated)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter skills separated by commas
                </p>
              </div>
              
              {jobId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Status
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        status === 'draft' 
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                          : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => handleStatusChange('draft')}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        status === 'open' 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => handleStatusChange('open')}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        status === 'closed' 
                          ? 'bg-gray-700 text-white border border-gray-800' 
                          : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => handleStatusChange('closed')}
                    >
                      Closed
                    </button>
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.push('/organization-dashboard/jobs')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : jobId ? 'Update Job' : 'Create Job'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
