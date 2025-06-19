// University Placements Page – detailed placement report
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import StudentPlacement from '../StudentPlacement';
import { UniversityService } from '@/lib/api';

interface PlacementData {
  degree: string;
  students: number;
  placed: number;
  averageSalary: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export default function UniversityPlacementsPage() {
  const [placements, setPlacements] = useState<PlacementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const data = await UniversityService.getStudentPlacement();
        setPlacements(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load placement data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, []);

  return (
    <UnifiedDashboardLayout
      title=""
      userRole="university"
      breadcrumbs={[{ label: 'Placements' }]}
    >
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <StudentPlacement placements={placements} />
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
