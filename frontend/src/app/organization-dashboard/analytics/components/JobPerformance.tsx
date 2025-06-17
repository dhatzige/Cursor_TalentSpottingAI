'use client';

import { JobPerformanceData } from './types';

interface JobPerformanceProps {
  jobs: JobPerformanceData[];
}

export default function JobPerformance({ jobs }: JobPerformanceProps) {
  // Sort jobs by conversion rate (highest first)
  const sortedJobs = [...jobs].sort((a, b) => b.conversionRate - a.conversionRate);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job Title
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applications
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Interviews
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hired
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conv. Rate
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time to Hire
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-50 dark:bg-slate-800/50 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedJobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{job.title}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">{job.applications}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">{job.interviews}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">{job.hired}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  job.conversionRate >= 5 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800/50' : 
                  job.conversionRate >= 2 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50' : 
                  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
                }`}>
                  {job.conversionRate}%
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <div className="text-sm text-gray-900">{job.timeToHire} days</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
