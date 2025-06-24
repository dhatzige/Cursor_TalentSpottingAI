import api from './axios';
import { STUDENT_MOCK_DATA } from './student/mock-data';
import axios from 'axios';

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
 * Create authenticated axios instance with Clerk token
 */
const createAuthenticatedRequest = async (getToken: () => Promise<string | null>) => {
  const token = await getToken();
  const isDev = process.env.NODE_ENV === 'development';
  
  // Check if we're in dev bypass mode (from URL params)
  const urlParams = new URLSearchParams(window.location.search);
  const devBypass = urlParams.get('dev_bypass') === 'true';
  
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(isDev && devBypass && { 'x-dev-bypass': 'true' }),
    },
  });
};

/**
 * Student service for handling student-specific API calls
 */
const isDev = process.env.NODE_ENV === 'development';

export const StudentService = {
  /**
   * Get student dashboard statistics
   */
  getDashboardStats: async (getToken: () => Promise<string | null>): Promise<StudentStats> => {
    try {
      const token = await getToken();
      console.log('🔑 Token available:', !!token);
      
      const axios = await createAuthenticatedRequest(getToken);
      console.log('📡 Making API call to /student/dashboard/stats');
      
      const response = await axios.get<StatsResponse>('/student/dashboard/stats');
      
      // If we get real data (not mock), return it
      const stats = response.data.stats;
      console.log('📊 Dashboard stats received:', stats);
      
      // Check if this is real data vs mock data
      if (stats.profileCompletion !== 72) {
        console.log('✅ Using REAL profile data from API');
      } else {
        console.log('⚠️ Received data that looks like mock data');
      }
      
      return stats;
    } catch (err: any) {
      // Capture error in Sentry with full context
      const errorContext = {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        url: err.config?.url,
        code: err.code,
        name: err.name,
        endpoint: '/api/student/dashboard/stats'
      };
      
      console.error('❌ API Error details:', errorContext);
      
      // Send to Sentry for tracking
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.captureException(err, {
          tags: {
            component: 'StudentService',
            method: 'getDashboardStats',
            api_endpoint: '/api/student/dashboard/stats'
          },
          extra: errorContext
        });
      }).catch(sentryErr => {
        console.warn('Failed to send error to Sentry:', sentryErr);
      });
      
      if (isDev) {
        console.warn('[StudentService] Using mock stats due to API error:', err.message);
        return { ...STUDENT_MOCK_DATA.stats };
      }
      throw err;
    }
  },
  
  /**
   * Get recommended jobs for student
   */
  getRecommendedJobs: async (getToken: () => Promise<string | null>): Promise<JobItem[]> => {
    try {
      const axios = await createAuthenticatedRequest(getToken);
      const response = await axios.get<JobsResponse>('/student/recommended-jobs');
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
  getApplicationStatus: async (getToken: () => Promise<string | null>): Promise<ApplicationItem[]> => {
    try {
      const axios = await createAuthenticatedRequest(getToken);
      const response = await axios.get<ApplicationsResponse>('/student/applications');
      return response.data.applications;
    } catch (err) {
      console.error('[StudentService] Error fetching applications:', err);
      throw err;
    }
  },
  
  /**
   * Apply for a job with resume and cover letter
   * @param jobId - ID of the job to apply for
   * @param applicationData - FormData containing resume file and other application data
   */
  applyForJob: async (jobId: string, applicationData: FormData, getToken: () => Promise<string | null>): Promise<{ message: string; applicationId: string }> => {
    const token = await getToken();
    const axios = await createAuthenticatedRequest(getToken);
    const response = await axios.post(`/student/jobs/${jobId}/apply`, applicationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` }),
      }
    });
    return response.data;
  },
  
  /**
   * Get application details
   * @param applicationId - ID of the application to get
   */
  getApplicationDetails: async (applicationId: string, getToken: () => Promise<string | null>) => {
    const axios = await createAuthenticatedRequest(getToken);
    const response = await axios.get(`/student/applications/${applicationId}`);
    return response.data;
  },
  
  /**
   * Update application status (for testing purposes, normally done by employers)
   */
  updateApplicationStatus: async (applicationId: string, status: string, getToken: () => Promise<string | null>) => {
    const axios = await createAuthenticatedRequest(getToken);
    const response = await axios.patch(`/student/applications/${applicationId}`, { status });
    return response.data;
  },

  /**
   * Get student profile data
   */
  getProfile: async (getToken: () => Promise<string | null>): Promise<any> => {
    try {
      const axios = await createAuthenticatedRequest(getToken);
      const response = await axios.get('/student/profile');
      return response.data;
    } catch (err) {
      console.error('[StudentService] Error fetching profile:', err);
      throw err;
    }
  },

  /** Upload profile photo */
  uploadPhoto: async (file: File, getToken: () => Promise<string | null>): Promise<string> => {
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const token = await getToken();
      const axios = await createAuthenticatedRequest(getToken);
      const res = await axios.post<{ url: string }>('/student/settings/photo', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        }
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
  uploadResume: async (file: File, getToken: () => Promise<string | null>): Promise<string> => {
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const token = await getToken();
      const axios = await createAuthenticatedRequest(getToken);
      const res = await axios.post<{ url: string }>('/student/settings/resume', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        }
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
  getPlan: async (getToken: () => Promise<string | null>): Promise<any> => {
    try {
      const axios = await createAuthenticatedRequest(getToken);
      const res = await axios.get('/student/settings/plan');
      return res.data;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StudentService] Mock get plan', err);
        return { id: 'free', name: 'Free', price: 'Free', features: [] };
      }
      throw err;
    }
  },

  upgradePlan: async (planId: string, getToken: () => Promise<string | null>): Promise<void> => {
    try {
      const axios = await createAuthenticatedRequest(getToken);
      await axios.post('/student/settings/plan', { planId });
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[StudentService] Mock upgrade plan', err);
        return;
      }
      throw err;
    }
  },

  deleteAccount: async (getToken: () => Promise<string | null>): Promise<void> => {
    try {
      const axios = await createAuthenticatedRequest(getToken);
      await axios.delete('/student/settings');
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
