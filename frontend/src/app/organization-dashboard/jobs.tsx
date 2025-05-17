'use client';

import { useState, useEffect } from 'react';
import { EmployerService } from '../../lib/api';

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
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Active
          </span>
        );
      case 'closed':
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            Closed
          </span>
        );
      case 'draft':
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            Draft
          </span>
        );
      default:
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };
  
  const JobFormComponent = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Job' : 'Post a New Job'}</h2>
        <button
          onClick={handleCancelForm}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const jobData = {
          title: formData.get('title') as string,
          description: formData.get('description') as string,
          location: formData.get('location') as string,
          skills: ((formData.get('skills') as string) || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        };
        handleJobFormSubmit(jobData);
      }} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title*
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={selectedJob?.title || ''}
            required
            placeholder="e.g., Senior Software Engineer"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Job Description*
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
            defaultValue={selectedJob?.description || ''}
            required
            placeholder="Describe the job responsibilities, requirements, and benefits..."
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location*
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={selectedJob?.location || ''}
            required
            placeholder="e.g., Remote, New York, NY, Hybrid - London"
          />
        </div>
        
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Required Skills (comma-separated)
          </label>
          <input
            id="skills"
            name="skills"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={(selectedJob?.skills || []).join(', ')}
            placeholder="e.g., JavaScript, Python, Project Management"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancelForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditMode ? 'Updating...' : 'Posting...'}
              </span>
            ) : (
              <>{isEditMode ? 'Update Job' : 'Post Job'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-3 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold">Manage Job Postings</h1>
        </div>
        {!showJobForm && (
          <button 
            onClick={handleCreateJob}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Job Posting
            </span>
          </button>
        )}
      </div>
      
      {error && !showJobForm && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      {isLoading && !showJobForm ? (
        <div className="flex flex-col gap-4 items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading job postings...</p>
        </div>
      ) : showJobForm ? (
        <JobFormComponent />
      ) : (
        <>
          {jobs.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">No Job Postings</h3>
              <p className="text-gray-600 mb-4">You haven't created any job postings yet.</p>
              <button 
                onClick={handleCreateJob}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Your First Job Posting
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      Posted
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
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{job.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {job.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(job.postDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(job.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900">
                          {job.applicantCount} applicants
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <div className="relative group">
                            <button className="text-gray-500 hover:text-gray-700">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                              {job.status !== 'open' && (
                                <button
                                  onClick={() => handleChangeStatus(job.id, 'open')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Mark as Active
                                </button>
                              )}
                              {job.status !== 'closed' && (
                                <button
                                  onClick={() => handleChangeStatus(job.id, 'closed')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Mark as Closed
                                </button>
                              )}
                              {job.status !== 'draft' && (
                                <button
                                  onClick={() => handleChangeStatus(job.id, 'draft')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Mark as Draft
                                </button>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleEditJob(job)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit job"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete job"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
