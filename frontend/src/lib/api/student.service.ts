import api from './axios';

interface StudentStats {
  profileCompletion: number;
  applicationsSubmitted: number;
  jobsViewed: number;
}

interface StatsResponse {
  stats: StudentStats;
}

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  postDate: string;
  status?: string;
  matchScore?: number;
  applied?: boolean;
}

interface JobsResponse {
  jobs: JobItem[];
}

interface ApplicationItem {
  id: string;
  title: string;
  company: string;
  status: string;
  timestamp: string;
}

interface ApplicationsResponse {
  applications: ApplicationItem[];
}

/**
 * Student service for handling student-specific API calls
 */
export const StudentService = {
  /**
   * Get student dashboard statistics
   */
  getDashboardStats: async (): Promise<StudentStats> => {
    const response = await api.get<StatsResponse>('/student/dashboard/stats');
    return response.data.stats;
  },
  
  /**
   * Get recommended jobs for student
   */
  getRecommendedJobs: async (): Promise<JobItem[]> => {
    const response = await api.get<JobsResponse>('/student/recommended-jobs');
    return response.data.jobs;
  },
  
  /**
   * Get student's applications status
   */
  getApplicationStatus: async (): Promise<ApplicationItem[]> => {
    const response = await api.get<ApplicationsResponse>('/student/applications');
    return response.data.applications;
  },
  
  /**
   * Apply for a job with resume and cover letter
   * @param jobId - ID of the job to apply for
   * @param applicationData - FormData containing resume file and other application data
   */
  applyForJob: async (jobId: string, applicationData: FormData): Promise<{ message: string; applicationId: string }> => {
    const response = await api.post(`/student/jobs/${jobId}/apply`, applicationData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  /**
   * Get application details
   * @param applicationId - ID of the application to get
   */
  getApplicationDetails: async (applicationId: string) => {
    const response = await api.get(`/student/applications/${applicationId}`);
    return response.data;
  },
  
  /**
   * Update application status (for testing purposes, normally done by employers)
   */
  updateApplicationStatus: async (applicationId: string, status: string) => {
    const response = await api.patch(`/student/applications/${applicationId}`, { status });
    return response.data;
  }
};

export default StudentService;
