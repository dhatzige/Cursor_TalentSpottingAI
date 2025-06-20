// Reference: Admin_dashboard.jpg
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import DashboardStats from './DashboardStats';
import ActivityFeed from './ActivityFeed';
import { AdminService } from '../../lib/api';

// Define interface for activity items
interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  type?: 'default' | 'success' | 'warning' | 'error';
  entityType?: string;
  entityId?: string;
}
import { useProtectedRoute } from '../../lib/hooks/useProtectedRoute';

export default function AdminDashboardPage() {
  // Protect this route - only admin can access
    const { loading: authLoading } = useProtectedRoute(['admin']);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizations: 0,
    totalStudents: 0,
    totalJobs: 0,
    totalApplications: 0,
  });
  
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip loading data if still authenticating
    if (authLoading) return;
    
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch stats and activities in parallel
        const [dashboardStats, recentActivity] = await Promise.all([
          AdminService.getDashboardStats(),
          AdminService.getRecentActivity(),
        ]);
        
        setStats(dashboardStats);
        
        // Map API response to our ActivityItem interface
        const formattedActivities: ActivityItem[] = recentActivity.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          timestamp: item.timestamp,
          type: item.type as 'default' | 'success' | 'warning' | 'error' | undefined,
          entityType: item.entityType,
          entityId: item.entityId
        }));
        
        setActivities(formattedActivities);
      } catch (err: any) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [authLoading]);

  return (
    <UnifiedDashboardLayout title="Admin Dashboard" userRole="admin">
      <div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col gap-4 items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <DashboardStats stats={stats} />
            
            {/* Recent Activity Section */}
            <ActivityFeed activities={activities} />
          </>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
