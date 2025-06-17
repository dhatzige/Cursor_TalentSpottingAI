'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CandidateTableRow from './CandidateTableRow';
import CandidateSkillBadges from './CandidateSkillBadges';
import MatchScoreBadge from './MatchScoreBadge';

interface Candidate {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
  applicationId: string;
}

interface CandidateTableProps {
  candidates: Candidate[];
  selectedCandidates: string[];
  onSelect: (candidateId: string) => void;
}

export default function CandidateTable({
  candidates,
  selectedCandidates,
  onSelect
}: CandidateTableProps) {
  const router = useRouter();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <input 
                type="checkbox" 
                className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                disabled 
              />
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Candidate
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Match
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Skills
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-gray-700">
          {candidates.map(candidate => (
            <tr key={candidate.id} className="hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
                  checked={selectedCandidates.includes(candidate.id)}
                  onChange={() => onSelect(candidate.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{candidate.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{candidate.role}</div>
                    {candidate.university && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">{candidate.university}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <MatchScoreBadge score={candidate.matchScore} />
              </td>
              <td className="px-6 py-4">
                <CandidateSkillBadges skills={candidate.skills} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  onClick={() => router.push(`/organization-dashboard/applications?id=${candidate.applicationId}`)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
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
