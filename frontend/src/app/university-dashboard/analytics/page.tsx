'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import StudentMetrics from '../StudentMetrics';
import StudentPlacement from '../StudentPlacement';
import { UniversityService } from '@/lib/api';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

interface UniversityMetrics {
  totalStudents: number;
  activeStudents: number;
  placementRate: number;
  averageSalary: string;
}

interface PlacementData {
  degree: string;
  students: number;
  placed: number;
  averageSalary: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export default function UniversityAnalyticsPage() {
    const { loading: authLoading } = useProtectedRoute(['university']);

  const [metrics, setMetrics] = useState<UniversityMetrics | null>(null);
  const [placements, setPlacements] = useState<PlacementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [stats, placementData] = await Promise.all([
          UniversityService.getUniversityStats(),
          UniversityService.getStudentPlacement(),
        ]);
        setMetrics(stats);
        setPlacements(placementData);
      } catch (err) {
        console.error('Error fetching analytics data', err);
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authLoading]);

  return (
    <UnifiedDashboardLayout
      title=""
      userRole="university"
      breadcrumbs={[{ label: 'Analytics' }]}
    >
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-4 items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {metrics && <StudentMetrics metrics={metrics} />}
          <StudentPlacement placements={placements} />
        </div>
      )}
    </UnifiedDashboardLayout>
  );
}
