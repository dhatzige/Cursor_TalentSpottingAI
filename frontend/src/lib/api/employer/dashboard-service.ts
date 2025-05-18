import api from '../axios';
import { OrganizationStats, CandidateItem } from './types';
import { MOCK_DATA } from './mock-data';

/**
 * Service for employer dashboard operations
 */
export const DashboardService = {
  /**
   * Get organization dashboard statistics
   */
  getOrganizationStats: async (): Promise<OrganizationStats> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        const response = await api.get('/api/employer/stats');
        return response.data.stats;
      } catch (error) {
        console.error('Error fetching organization stats:', error);
        throw error;
      }
    }

    // Mock API response
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_DATA.stats);
      }, 500);
    });
  },
  
  /**
   * Get top candidates for the organization
   */
  getTopCandidates: async (): Promise<CandidateItem[]> => {
    // Use real API in production
    if (process.env.NODE_ENV !== 'development') {
      try {
        const response = await api.get('/api/employer/candidates/top');
        return response.data.candidates;
      } catch (error) {
        console.error('Error fetching top candidates:', error);
        throw error;
      }
    }

    // Mock implementation
    const mockCandidates = MOCK_DATA.candidates
      .slice(0, 4)
      .map(c => ({
        id: c.id,
        name: c.name,
        role: c.role || 'Candidate',
        matchScore: c.matchScore,
        university: c.university || 'University',
        skills: c.skills || [],
        applicationId: c.applicationId || `app-${c.id}`
      }));

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockCandidates);
      }, 500);
    });
  }
};
