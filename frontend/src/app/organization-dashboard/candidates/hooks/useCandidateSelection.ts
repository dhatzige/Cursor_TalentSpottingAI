'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Candidate } from './useCandidateFilters';

export function useCandidateSelection(allCandidates: Candidate[]) {
  const router = useRouter();
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  
  // Handle candidate selection
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
  
  // Handle compare action
  const handleCompare = () => {
    if (selectedCandidates.length > 0) {
      // Convert array of IDs to URL query param
      const applicationIds = selectedCandidates.map(candidateId => {
        const candidate = allCandidates.find(c => c.id === candidateId);
        return candidate?.applicationId || '';
      }).filter(Boolean).join(',');
      
      router.push(`/organization-dashboard/applications?compare=${applicationIds}`);
    }
  };
  
  return {
    selectedCandidates,
    handleCandidateSelect,
    handleCompare
  };
}
