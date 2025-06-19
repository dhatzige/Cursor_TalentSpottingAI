// University Students List Page
// Displays list of students in a data grid
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import DataGrid from '@/app/organization-dashboard/shared/ui/DataGrid';
import { UniversityService } from '@/lib/api';

interface Student {
  id: string;
  name: string;
  degree: string;
  graduationYear: number;
  status: 'active' | 'inactive';
  gpa: number;
}

export default function UniversityStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await UniversityService.getStudents();
        setStudents(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load students. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Student, sortable: true },
    { header: 'Degree', accessor: 'degree' as keyof Student, sortable: true },
    { header: 'Graduation Year', accessor: 'graduationYear' as keyof Student, sortable: true, align: 'center' as const },
    { header: 'GPA', accessor: (row: Student) => row.gpa.toFixed(2), sortable: true, align: 'center' as const },
    { header: 'Status', accessor: (row: Student) => row.status.charAt(0).toUpperCase() + row.status.slice(1) }
  ];

  return (
    <UnifiedDashboardLayout
      title=""
      userRole="university"
      breadcrumbs={[{ label: 'Students' }]}
    >
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <DataGrid<Student>
          data={students}
          columns={columns}
          keyField="id"
          loading={loading}
          emptyState={<p className="py-4 text-center text-gray-500 dark:text-gray-400">No students found.</p>}
        />
      </div>
    </UnifiedDashboardLayout>
  );
}
