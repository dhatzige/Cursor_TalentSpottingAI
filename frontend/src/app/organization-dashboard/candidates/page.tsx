'use client';

import { useRouter } from 'next/navigation';
import { UnifiedDashboardLayout } from '../../../components/dashboard';
import { useProtectedRoute } from '../../../lib/hooks/useProtectedRoute';
import PaginatedCandidatesList from './components/PaginatedCandidatesList';

export default function CandidatesPage() {
  // Protect this route - only employer can access
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  const router = useRouter();

  return (
    <UnifiedDashboardLayout
      // Removing title to prevent duplication
      title=""
      description=""
      userRole="employer"
      userInfo={{
        name: 'Demo User',
        company: 'TalentSpottingAI Inc.',
      }}
      breadcrumbs={[
        { label: 'Dashboard', href: '/organization-dashboard' },
        { label: 'Candidates' }
      ]}
      className="pt-0 mt-0" // Removing padding at the top
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">All Candidates</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage and review all applicants for your job postings</p>
          </div>
          
          <div className="space-x-4">
            <button
              onClick={() => router.push('/organization-dashboard/applications')}
              className="bg-gray-50 dark:bg-slate-800/50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              View All Applications
            </button>
          </div>
        </div>
        
        {/* Only render if authentication check is complete */}
        {!authLoading && <PaginatedCandidatesList />}
      </div>
    </UnifiedDashboardLayout>
  );
}
