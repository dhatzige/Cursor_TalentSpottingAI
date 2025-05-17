import api from './axios';

interface DashboardStats {
  totalUsers: number;
  totalOrganizations: number;
  totalStudents: number;
  totalJobs: number;
  totalApplications: number;
}

interface StatsResponse {
  stats: DashboardStats;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  entityType?: string;
  entityId?: string;
}

interface ActivityResponse {
  activities: ActivityItem[];
}

/**
 * Admin service for handling admin-specific API calls
 */
export const AdminService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<StatsResponse>('/admin/dashboard/stats');
    return response.data.stats;
  },
  
  /**
   * Get recent activity
   */
  getRecentActivity: async (): Promise<ActivityItem[]> => {
    const response = await api.get<ActivityResponse>('/admin/dashboard/activity');
    return response.data.activities;
  }
};

export default AdminService;
