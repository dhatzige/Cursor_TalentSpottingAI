import api from '../axios';
import { JobItem, JobPostData, JobsResponse, JobResponse } from './types';
import { MOCK_DATA } from './mock-data';

/**
 * Service for job management operations
 */
export const JobsService = {
  /**
   * Get active jobs for the organization
   */
  getActiveJobs: async (): Promise<JobItem[]> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        const response = await api.get('/api/employer/jobs?status=open');
        return response.data.jobs;
      } catch (error) {
        console.error('Error fetching active jobs:', error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_DATA.jobs.filter(job => job.status === 'open'));
      }, 500);
    });
  },
  
  /**
   * Get all jobs for the organization (regardless of status)
   */
  getAllJobs: async (): Promise<JobItem[]> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        const response = await api.get('/api/employer/jobs');
        return response.data.jobs;
      } catch (error) {
        console.error('Error fetching all jobs:', error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_DATA.jobs);
      }, 500);
    });
  },
  
  /**
   * Get a specific job by ID
   */
  getJobById: async (jobId: string): Promise<JobItem> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        const response = await api.get(`/api/employer/jobs/${jobId}`);
        return response.data.job;
      } catch (error) {
        console.error(`Error fetching job ${jobId}:`, error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const job = MOCK_DATA.jobs.find(j => j.id === jobId);
        if (job) {
          resolve(job);
        } else {
          reject(new Error('Job not found'));
        }
      }, 500);
    });
  },

  /**
   * Create a new job
   */
  createJob: async (jobData: JobPostData): Promise<JobItem> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        const response = await api.post('/api/employer/jobs', jobData);
        return response.data.job;
      } catch (error) {
        console.error('Error creating job:', error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise(resolve => {
      setTimeout(() => {
        const newJob = {
          id: 'job' + (MOCK_DATA.jobs.length + 1),
          title: jobData.title,
          company: 'TechCorp Inc.',
          location: jobData.location,
          description: jobData.description,
          postDate: new Date().toISOString(),
          status: 'open',
          applicantCount: 0,
          skills: jobData.skills || []
        };
        resolve(newJob);
      }, 500);
    });
  },

  /**
   * Update an existing job
   */
  updateJob: async (jobId: string, jobData: JobPostData): Promise<JobItem> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        const response = await api.put(`/api/employer/jobs/${jobId}`, jobData);
        return response.data.job;
      } catch (error) {
        console.error(`Error updating job ${jobId}:`, error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const jobIndex = MOCK_DATA.jobs.findIndex(j => j.id === jobId);
        if (jobIndex !== -1) {
          const updatedJob = {
            ...MOCK_DATA.jobs[jobIndex],
            title: jobData.title,
            location: jobData.location,
            description: jobData.description,
            skills: jobData.skills || []
          };
          resolve(updatedJob);
        } else {
          reject(new Error('Job not found'));
        }
      }, 500);
    });
  },

  /**
   * Update job status
   */
  updateJobStatus: async (jobId: string, status: 'open' | 'closed' | 'draft'): Promise<JobItem> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        const response = await api.patch(`/api/employer/jobs/${jobId}/status`, { status });
        return response.data.job;
      } catch (error) {
        console.error(`Error updating job status ${jobId}:`, error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const jobIndex = MOCK_DATA.jobs.findIndex(j => j.id === jobId);
        if (jobIndex !== -1) {
          const updatedJob = {
            ...MOCK_DATA.jobs[jobIndex],
            status
          };
          resolve(updatedJob);
        } else {
          reject(new Error('Job not found'));
        }
      }, 500);
    });
  },

  /**
   * Delete a job posting
   */
  deleteJob: async (jobId: string): Promise<void> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        await api.delete(`/api/employer/jobs/${jobId}`);
      } catch (error) {
        console.error(`Error deleting job ${jobId}:`, error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
};
