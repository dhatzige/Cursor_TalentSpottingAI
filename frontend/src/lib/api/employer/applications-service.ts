import api from '../axios';
import { ApplicationItem, ApplicationResponse, ApplicationsResponse } from './types';
import { MOCK_DATA } from './mock-data';

/**
 * Service for application management operations
 */
export const ApplicationsService = {
  /**
   * Get job applications
   */
  getJobApplications: async (jobId: string): Promise<ApplicationItem[]> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        const response = await api.get(`/api/employer/jobs/${jobId}/applications`);
        return response.data.applications;
      } catch (error) {
        console.error(`Error fetching applications for job ${jobId}:`, error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_DATA.applications.filter(app => app.jobId === jobId));
      }, 500);
    });
  },

  /**
   * Get application by ID
   */
  getApplicationById: async (applicationId: string): Promise<ApplicationItem> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        const response = await api.get(`/api/employer/applications/${applicationId}`);
        return response.data.application;
      } catch (error) {
        console.error(`Error fetching application ${applicationId}:`, error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const application = MOCK_DATA.applications.find(app => app.id === applicationId);
        if (application) {
          resolve(application);
        } else {
          reject(new Error('Application not found'));
        }
      }, 500);
    });
  },

  /**
   * Get applications by IDs (for comparison)
   */
  getApplicationsByIds: async (applicationIds: string[]): Promise<ApplicationItem[]> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        // This would require a batch endpoint in the real API
        const response = await api.post('/api/employer/applications/batch', { ids: applicationIds });
        return response.data.applications;
      } catch (error) {
        console.error('Error fetching multiple applications:', error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise(resolve => {
      setTimeout(() => {
        const applications = MOCK_DATA.applications.filter(app => 
          applicationIds.includes(app.id)
        );
        resolve(applications);
      }, 500);
    });
  },

  /**
   * Update application status
   */
  updateApplicationStatus: async (applicationId: string, status: string): Promise<ApplicationItem> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        const response = await api.patch(`/api/employer/applications/${applicationId}/status`, { status });
        return response.data.application;
      } catch (error) {
        console.error(`Error updating application status ${applicationId}:`, error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const appIndex = MOCK_DATA.applications.findIndex(app => app.id === applicationId);
        if (appIndex !== -1) {
          const updatedApp = {
            ...MOCK_DATA.applications[appIndex],
            status,
            updatedAt: new Date().toISOString()
          };
          resolve(updatedApp);
        } else {
          reject(new Error('Application not found'));
        }
      }, 500);
    });
  },

  /**
   * Add note to application
   */
  addApplicationNote: async (applicationId: string, content: string): Promise<{ success: boolean }> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        await api.post(`/api/employer/applications/${applicationId}/notes`, { content });
        return { success: true };
      } catch (error) {
        console.error(`Error adding note to application ${applicationId}:`, error);
        throw error;
      }
    }

    // Mock implementation for development
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};
