// University Employers Page – shows full list of employer partners
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import DataGrid, { Column } from '@/app/organization-dashboard/shared/ui/DataGrid';
import { UniversityService } from '@/lib/api';

interface Employer {
  id: string;
  name: string;
  industry: string;
  hiringStatus: 'active' | 'inactive';
  openPositions: number;
  studentsHired: number;
}

export default function UniversityEmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const data = await UniversityService.getEmployerPartners();
        setEmployers(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load employers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployers();
  }, []);

  const columns: Column<Employer>[] = [
    { header: 'Name', accessor: 'name' as keyof Employer, sortable: true },
    { header: 'Industry', accessor: 'industry' as keyof Employer, sortable: true },
    { header: 'Hiring', accessor: (row: Employer) => row.hiringStatus === 'active' ? 'Active' : 'Inactive', sortable: true },
    { header: 'Open Positions', accessor: 'openPositions' as keyof Employer, sortable: true, align: 'center' as const },
    { header: 'Students Hired', accessor: 'studentsHired' as keyof Employer, sortable: true, align: 'center' as const }
  ];

  return (
    <UnifiedDashboardLayout
      title=""
      userRole="university"
      breadcrumbs={[{ label: 'Employers' }]}
    >
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <DataGrid<Employer>
          data={employers}
          columns={columns}
          keyField="id"
          loading={loading}
          emptyState={<p className="py-4 text-center text-gray-500 dark:text-gray-400">No employer partners found.</p>}
        />
      </div>
    </UnifiedDashboardLayout>
  );
}
