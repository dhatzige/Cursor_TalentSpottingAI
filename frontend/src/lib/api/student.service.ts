import api from './axios';
import { STUDENT_MOCK_DATA } from './student/mock-data';

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
const isDev = process.env.NODE_ENV === 'development';

export const StudentService = {
  /**
   * Get student dashboard statistics
   */
  getDashboardStats: async (): Promise<StudentStats> => {
    try {
      const response = await api.get<StatsResponse>('/student/dashboard/stats');
      return response.data.stats;
    } catch (err) {
      if (isDev) {
        console.warn('[StudentService] Using mock stats due to API error:', err);
        return { ...STUDENT_MOCK_DATA.stats };
      }
      throw err;
    }
  },
  
  /**
   * Get recommended jobs for student
   */
  getRecommendedJobs: async (): Promise<JobItem[]> => {
    try {
      const response = await api.get<JobsResponse>('/student/recommended-jobs');
      return response.data.jobs;
    } catch (err) {
      if (isDev) {
        console.warn('[StudentService] Using mock jobs due to API error:', err);
        return STUDENT_MOCK_DATA.jobs.map((j) => ({ ...j }));
      }
      throw err;
    }
  },
  
  /**
   * Get student's applications status
   */
  getApplicationStatus: async (): Promise<ApplicationItem[]> => {
    try {
      const response = await api.get<ApplicationsResponse>('/student/applications');
      return response.data.applications;
    } catch (err) {
      if (isDev) {
        console.warn('[StudentService] Using mock applications due to API error:', err);
        return STUDENT_MOCK_DATA.applications.map((a) => ({ ...a }));
      }
      throw err;
    }
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
  },

  /** Upload profile photo */
  uploadPhoto: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const res = await api.post<{ url: string }>('/student/settings/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.url;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StudentService] Mock photo upload', err);
        return '/images/mock-student-photo.png';
      }
      throw err;
    }
  },

  /** Upload resume file */
  uploadResume: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await api.post<{ url: string }>('/student/settings/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.url;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StudentService] Mock resume upload', err);
        return '/resume/mock-student-resume.pdf';
      }
      throw err;
    }
  },

  /** Manage subscription plan */
  getPlan: async (): Promise<any> => {
    try {
      const res = await api.get('/student/settings/plan');
      return res.data;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StudentService] Mock get plan', err);
        return { id: 'free', name: 'Free', price: 'Free', features: [] };
      }
      throw err;
    }
  },

  upgradePlan: async (planId: string): Promise<void> => {
    try {
      await api.post('/student/settings/plan', { planId });
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StudentService] Mock upgrade plan', err);
        return;
      }
      throw err;
    }
  },

  deleteAccount: async (): Promise<void> => {
    try {
      await api.delete('/student/settings');
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StudentService] Mock delete', err);
        return;
      }
      throw err;
    }
  }
};

export default StudentService;
