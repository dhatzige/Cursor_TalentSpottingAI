// Reference: University_dashboard.jpg
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import StudentMetrics from './StudentMetrics';
import EmployerPartners from './EmployerPartners';
import StudentPlacement from './StudentPlacement';
import { UniversityService } from '../../lib/api';
import { useProtectedRoute } from '../../lib/hooks/useProtectedRoute';

// Define interfaces for API responses
interface UniversityMetrics {
  totalStudents: number;
  activeStudents: number;
  placementRate: number;
  averageSalary: string;
}

interface EmployerPartner {
  id: string;
  name: string;
  industry: string;
  hiringStatus: 'active' | 'inactive';
  openPositions: number;
  studentsHired: number;
}

interface PlacementData {
  degree: string;
  students: number;
  placed: number;
  averageSalary: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export default function UniversityDashboardPage() {
  // Protect this route - only university can access
    const { loading: authLoading } = useProtectedRoute(['university']);
  
  const [metrics, setMetrics] = useState<UniversityMetrics>({
    totalStudents: 0,
    activeStudents: 0,
    placementRate: 0,
    averageSalary: '$0'
  });
  
  const [employers, setEmployers] = useState<EmployerPartner[]>([]);
  const [placements, setPlacements] = useState<PlacementData[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip loading data if still authenticating
    if (authLoading) return;
    
    const fetchUniversityData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all university data in parallel
        const [universityMetrics, employerPartners, studentPlacements] = await Promise.all([
          UniversityService.getUniversityStats(),
          UniversityService.getEmployerPartners(),
          UniversityService.getStudentPlacement(),
        ]);
        
        setMetrics(universityMetrics);
        setEmployers(employerPartners);
        setPlacements(studentPlacements);
      } catch (err: any) {
        console.error('Error fetching university dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUniversityData();
  }, [authLoading]);

  return (
    <UnifiedDashboardLayout title="" userRole="university" breadcrumbs={[{ label: 'Dashboard' }]}>
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
          <div className="space-y-6">
            <StudentMetrics metrics={metrics} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmployerPartners employers={employers} />
              <StudentPlacement placements={placements} />
            </div>
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
