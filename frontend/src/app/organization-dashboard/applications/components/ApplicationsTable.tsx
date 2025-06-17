'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Application } from '@/types/application';
import StatusBadge from './StatusBadge';

interface ApplicationsTableProps {
  applications: Application[];
  selectedApplications: string[];
  onApplicationSelect: (id: string) => void;
}

export default function ApplicationsTable({
  applications,
  selectedApplications,
  onApplicationSelect,
}: ApplicationsTableProps) {
  const router = useRouter();

  // Helper function to get the color class based on score
  const getScoreColorClass = (score: number | undefined): string => {
    if (score === undefined) return 'bg-gray-300';
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                disabled 
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Candidate
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job Position
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applied
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
          {applications.map(application => (
            <tr key={application.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={selectedApplications.includes(application.id)}
                  onChange={() => onApplicationSelect(application.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      {typeof application.studentName === 'string' && application.studentName.trim() ? application.studentName.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'N/A'}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{application.studentName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{application.candidateEmail}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">{application.jobTitle}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={application.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div 
                    className={`h-2.5 rounded-full w-${Math.max(1, Math.round((application.matchScore || 0) / 10))} ${getScoreColorClass(application.matchScore)}`}
                  ></div>
                  <span className="ml-2 text-sm text-gray-600">
                    {application.matchScore !== undefined ? `${application.matchScore}%` : 'N/A'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(application.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  onClick={() => router.push(`/organization-dashboard/applications?id=${application.id}`)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
