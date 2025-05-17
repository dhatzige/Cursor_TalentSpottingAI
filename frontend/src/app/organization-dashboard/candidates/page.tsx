'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/DashboardLayout';
import { useProtectedRoute } from '../../../lib/hooks/useProtectedRoute';
import { EmployerService } from '../../../lib/api';

interface Candidate {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
  applicationId: string;
}

export default function CandidatesPage() {
  // Protect this route - only employer can access
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  const router = useRouter();
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  useEffect(() => {
    // Skip loading data if still authenticating
    if (authLoading) return;
    
    const fetchCandidates = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const apiCandidates = await EmployerService.getTopCandidates();
        setCandidates(apiCandidates);
      } catch (err: any) {
        console.error('Error fetching candidates:', err);
        setError('Failed to load candidates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCandidates();
  }, [authLoading]);

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidates(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      } else {
        // Limit to 3 selections
        if (prev.length >= 3) {
          return [...prev.slice(1), candidateId];
        }
        return [...prev, candidateId];
      }
    });
  };

  const handleCompare = () => {
    if (selectedCandidates.length > 0) {
      // Convert array of IDs to URL query param
      const applicationIds = selectedCandidates.map(candidateId => {
        const candidate = candidates.find(c => c.id === candidateId);
        return candidate?.applicationId || '';
      }).filter(Boolean).join(',');
      
      router.push(`/organization-dashboard/applications?compare=${applicationIds}`);
    }
  };

  return (
    <DashboardLayout title="Candidates" userRole="employer">
      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex flex-col gap-4 items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading candidates...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-semibold">All Candidates</h1>
                <p className="text-gray-600">Manage and review all applicants for your job postings</p>
              </div>
              
              <div className="space-x-4">
                {selectedCandidates.length > 0 && (
                  <button
                    onClick={handleCompare}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Compare Selected ({selectedCandidates.length})
                  </button>
                )}
                
                <button
                  onClick={() => router.push('/organization-dashboard/applications')}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  View All Applications
                </button>
              </div>
            </div>
            
            {candidates.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No candidates yet</h3>
                <p className="text-gray-500 mb-4">
                  No one has applied to your job postings yet. Check back later or create more job listings.
                </p>
                <button
                  onClick={() => router.push('/organization-dashboard/jobs')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Job Posting
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
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
                        Match
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Skills
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.map(candidate => (
                      <tr key={candidate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            checked={selectedCandidates.includes(candidate.id)}
                            onChange={() => handleCandidateSelect(candidate.id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                              <div className="text-sm text-gray-500">{candidate.role}</div>
                              {candidate.university && (
                                <div className="text-xs text-gray-500">{candidate.university}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            candidate.matchScore >= 80 
                              ? 'bg-green-100 text-green-800' 
                              : candidate.matchScore >= 60 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {candidate.matchScore}%
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 3).map((skill, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
                              >
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-500">
                                +{candidate.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => router.push(`/organization-dashboard/applications?id=${candidate.applicationId}`)}
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
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
