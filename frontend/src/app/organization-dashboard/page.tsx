'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UnifiedDashboardLayout } from '@/components/dashboard';
import StatCard from '../components/dashboard/StatCard';
import { useProtectedRoute } from '../../lib/hooks/useProtectedRoute';

// Define interfaces for organizational data
interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  status: 'active' | 'draft' | 'closed';
  applicantsCount: number;
  postedDate: string;
}

interface CandidateItem {
  id: string;
  name: string;
  position: string;
  matchScore: number;
  status: 'new' | 'reviewing' | 'interview' | 'offer' | 'rejected';
  appliedDate: string;
}

interface OrganizationStats {
  activeJobPostings: number;
  totalApplicants: number;
  viewsThisMonth: number;
}

export default function OrganizationDashboardPage() {
  // Protect this route - only employers can access
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  const router = useRouter();
  
  const [stats, setStats] = useState<OrganizationStats>({
    activeJobPostings: 0,
    totalApplicants: 0,
    viewsThisMonth: 0
  });
  
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [topCandidates, setTopCandidates] = useState<CandidateItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip loading data if still authenticating
    if (authLoading) return;
    
    const fetchOrganizationData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Mock data for demonstration
        // In a real application, this would be API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          activeJobPostings: 12,
          totalApplicants: 87,
          viewsThisMonth: 342
        });
        
        setJobPostings([
          {
            id: 'job1',
            title: 'Senior Software Engineer',
            department: 'Engineering',
            location: 'Remote',
            status: 'active',
            applicantsCount: 24,
            postedDate: '2025-05-01'
          },
          {
            id: 'job2',
            title: 'Product Marketing Manager',
            department: 'Marketing',
            location: 'New York, NY',
            status: 'active',
            applicantsCount: 18,
            postedDate: '2025-05-05'
          },
          {
            id: 'job3',
            title: 'UX Designer',
            department: 'Design',
            location: 'Hybrid - SF',
            status: 'active',
            applicantsCount: 31,
            postedDate: '2025-05-10'
          },
          {
            id: 'job4',
            title: 'Data Scientist',
            department: 'Data',
            location: 'Boston, MA',
            status: 'draft',
            applicantsCount: 0,
            postedDate: '-'
          }
        ]);
        
        setTopCandidates([
          {
            id: 'cand1',
            name: 'Alex Johnson',
            position: 'Senior Software Engineer',
            matchScore: 92,
            status: 'new',
            appliedDate: '2025-05-15'
          },
          {
            id: 'cand2',
            name: 'Sarah Williams',
            position: 'UX Designer',
            matchScore: 88,
            status: 'reviewing',
            appliedDate: '2025-05-12'
          },
          {
            id: 'cand3',
            name: 'Michael Chen',
            position: 'Product Marketing Manager',
            matchScore: 85,
            status: 'interview',
            appliedDate: '2025-05-08'
          }
        ]);
        
      } catch (err: any) {
        console.error('Error loading organization dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrganizationData();
  }, [authLoading]);

  return (
    <UnifiedDashboardLayout
      title=""
      userRole="employer"
      breadcrumbs={[{ label: 'Dashboard' }]}
      userInfo={{
        name: 'Demo User',
        company: 'TalentSpottingAI Inc.',
      }}
      
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
        
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
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                title="Active Job Postings"
                value={stats.activeJobPostings}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                }
              />
              
              <StatCard
                title="Total Applicants"
                value={stats.totalApplicants}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                }
              />
              
              <StatCard
                title="Profile Views (Monthly)"
                value={stats.viewsThisMonth}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
            </div>
            
            {/* Job Postings */}
            <section className="bg-gray-50 dark:bg-slate-800/50 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Job Postings</h2>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800">
                  Create New Job
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-slate-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-50 dark:bg-slate-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                    {jobPostings.map(job => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{job.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{job.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={
                            `px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${job.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-700/50 dark:text-green-200' : 
                              job.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/50 dark:text-yellow-200' : 
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`
                          }>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.applicantsCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.postedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">Edit</button>
                          <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            
            {/* Top Candidates */}
            <section className="bg-gray-50 dark:bg-slate-800/50 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Top Candidates</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {topCandidates.map(candidate => (
                  <div key={candidate.id} className="p-6 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mr-4">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{candidate.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{candidate.position}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="mr-6">
                        <div className="flex items-center">
                          <div className="mr-2 text-sm font-medium text-gray-500 dark:text-gray-400">Match Score:</div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{candidate.matchScore}%</span>
                            <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${candidate.matchScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Applied: {candidate.appliedDate}</div>
                      </div>
                      
                      <div>
                        <span className={
                          `px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${candidate.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-700/50 dark:text-blue-200' : 
                            candidate.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/50 dark:text-yellow-200' : 
                            candidate.status === 'interview' ? 'bg-green-100 text-green-800 dark:bg-green-700/50 dark:text-green-200' : 
                            candidate.status === 'offer' ? 'bg-purple-100 text-purple-800 dark:bg-purple-700/50 dark:text-purple-200' : 
                            'bg-red-100 text-red-800 dark:bg-red-700/50 dark:text-red-200'}`
                        }>
                          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        </span>
                      </div>
                      
                      <button className="ml-6 px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:hover:bg-slate-600/70 text-gray-800 dark:text-gray-200 text-sm font-medium rounded transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-right">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  View All Candidates →
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </UnifiedDashboardLayout>
  );
}
