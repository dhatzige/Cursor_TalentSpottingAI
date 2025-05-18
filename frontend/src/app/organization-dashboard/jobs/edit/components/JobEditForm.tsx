'use client';

import { useState } from 'react';
import Button from '../../../../components/Button';
import { EmployerService } from '../../../../../lib/api';
import { JobFormData, JobPostRequest, JobStatus } from './types';
import JobStatusControl from './JobStatusControl';

interface JobEditFormProps {
  jobId: string | null;
  initialData: JobFormData;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export function JobEditForm({ 
  jobId, 
  initialData, 
  onSuccess, 
  onError, 
  onCancel 
}: JobEditFormProps) {
  // Form state
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [location, setLocation] = useState(initialData.location);
  const [skillsInput, setSkillsInput] = useState(initialData.skillsInput);
  const [status, setStatus] = useState<JobStatus>(initialData.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!title.trim()) {
      onError('Job title is required');
      return;
    }
    
    setIsSaving(true);
    
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
        onSuccess('Job updated successfully');
      } else {
        // Create new job
        await EmployerService.createJob(jobData);
        onSuccess('Job created successfully');
      }
    } catch (err: any) {
      console.error('Error saving job:', err);
      onError('Failed to save job. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: JobStatus) => {
    if (!jobId) return;
    
    setIsSaving(true);
    
    try {
      await EmployerService.updateJobStatus(jobId, newStatus);
      setStatus(newStatus);
      onSuccess(`Job status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Error updating job status:', err);
      onError('Failed to update job status. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
        <JobStatusControl 
          currentStatus={status} 
          onStatusChange={handleStatusChange} 
        />
      )}
      
      <div className="pt-4 flex justify-end space-x-3">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
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
  );
}


export default JobEditForm;
