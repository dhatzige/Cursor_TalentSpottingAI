import api from './axios';

interface OrganizationStats {
  activeJobs: number;
  totalApplicants: number;
  positionsFilled: number;
  trends: {
    applicantChange: number;
  };
}

interface StatsResponse {
  stats: OrganizationStats;
}

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

interface JobsResponse {
  jobs: JobItem[];
}

interface JobResponse {
  job: JobItem;
}

interface JobPostData {
  title: string;
  description: string;
  location: string;
  skills?: string[];
}

interface CandidateItem {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
}

interface CandidatesResponse {
  candidates: CandidateItem[];
}

interface ApplicationResponse {
  applications: {
    id: string;
    studentName: string;
    status: string;
    appliedDate: string;
    resumeUrl?: string;
  }[];
}

/**
 * Employer service for handling employer/organization-specific API calls
 */
export const EmployerService = {
  /**
   * Get organization dashboard statistics
   */
  getOrganizationStats: async (): Promise<OrganizationStats> => {
    const response = await api.get<StatsResponse>('/employer/dashboard/stats');
    return response.data.stats;
  },
  
  /**
   * Get active jobs for the organization
   */
  getActiveJobs: async (): Promise<JobItem[]> => {
    const response = await api.get<JobsResponse>('/employer/jobs/active');
    return response.data.jobs;
  },
  
  /**
   * Get all jobs for the organization (regardless of status)
   */
  getAllJobs: async (): Promise<JobItem[]> => {
    const response = await api.get<JobsResponse>('/employer/jobs');
    return response.data.jobs;
  },
  
  /**
   * Get a specific job by ID
   */
  getJobById: async (jobId: string): Promise<JobItem> => {
    const response = await api.get<JobResponse>(`/employer/jobs/${jobId}`);
    return response.data.job;
  },
  
  /**
   * Get top candidates for the organization
   */
  getTopCandidates: async (): Promise<CandidateItem[]> => {
    const response = await api.get<CandidatesResponse>('/employer/candidates/top');
    return response.data.candidates;
  },
  
  /**
   * Create a new job
   */
  createJob: async (jobData: JobPostData): Promise<JobItem> => {
    const response = await api.post<JobResponse>('/employer/jobs', jobData);
    return response.data.job;
  },
  
  /**
   * Update an existing job
   */
  updateJob: async (jobId: string, jobData: JobPostData): Promise<JobItem> => {
    const response = await api.put<JobResponse>(`/employer/jobs/${jobId}`, jobData);
    return response.data.job;
  },
  
  /**
   * Update job status
   */
  updateJobStatus: async (jobId: string, status: 'open' | 'closed' | 'draft'): Promise<JobItem> => {
    const response = await api.patch<JobResponse>(`/employer/jobs/${jobId}/status`, { status });
    return response.data.job;
  },
  
  /**
   * Delete a job posting
   */
  deleteJob: async (jobId: string): Promise<void> => {
    await api.delete(`/employer/jobs/${jobId}`);
  },
  
  /**
   * Get job applications
   */
  getJobApplications: async (jobId: string) => {
    const response = await api.get<ApplicationResponse>(`/employer/jobs/${jobId}/applications`);
    return response.data.applications;
  }
};

export default EmployerService;
