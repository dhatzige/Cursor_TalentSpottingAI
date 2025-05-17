'use client';

import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/DashboardLayout';
import { useProtectedRoute } from '../../../../lib/hooks/useProtectedRoute';

export default function CreateJobPage() {
  // Protect this route - only employer can access
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  
  const router = useRouter();

  // Reuse the same form component from edit page
  if (!authLoading) {
    // Redirect to the edit page without an ID to create a new job
    router.push('/organization-dashboard/jobs/edit');
    return null;
  }

  return (
    <DashboardLayout title="Create Job" userRole="employer">
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
