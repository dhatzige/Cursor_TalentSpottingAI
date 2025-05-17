'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import StatCard from '../../dashboard/StatCard';
import ActiveJobs from '../../../app/organization-dashboard/ActiveJobs';
import TopCandidates from '../../../app/organization-dashboard/TopCandidates';
import { JobItem, CandidateItem, ApiOrganizationStats } from '../../../types/dashboard';

interface OverviewTabProps {
  stats: ApiOrganizationStats;
  jobs: JobItem[];
  candidates: CandidateItem[];
  onShowJobManagement: () => void;
  onShowJobForm: () => void;
}

export default function OverviewTab({ 
  stats, 
  jobs, 
  candidates, 
  onShowJobManagement,
  onShowJobForm
}: OverviewTabProps) {
  const router = useRouter();

  return (
    <>
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Active Jobs"
          value={stats.activeJobs}
          label="Currently open positions"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        
        <StatCard 
          title="Total Applicants"
          value={stats.totalApplicants}
          label={`${stats.trends.applicantChange >= 0 ? '+' : ''}${stats.trends.applicantChange}% from last month`}
          trend={stats.trends.applicantChange >= 0 ? 'up' : 'down'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        
        <StatCard 
          title="Positions Filled"
          value={stats.positionsFilled}
          label="Successfully completed hires"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>
      
      {/* Jobs and candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <Card className="relative overflow-hidden">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <CardTitle>Active Job Postings</CardTitle>
              <button 
                onClick={onShowJobForm}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                title="Add New Job"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ActiveJobs jobs={jobs} />
            {jobs.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>No active job postings found.</p>
                <button 
                  onClick={onShowJobForm}
                  className="mt-2 text-blue-600 hover:text-blue-800 underline focus:outline-none"
                >
                  Create your first job posting
                </button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Top Candidates */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <CardTitle>Top Candidates</CardTitle>
              <button 
                onClick={() => router.push('/organization-dashboard/candidates')}
                className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
              >
                View All
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TopCandidates candidates={candidates} />
            {candidates.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>No candidates have applied yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
