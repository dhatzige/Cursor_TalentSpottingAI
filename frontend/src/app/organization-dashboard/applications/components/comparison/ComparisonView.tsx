'use client';

import { useState, useEffect } from 'react';
import { Application } from '../../../../../types/application';
// Import the components with explicit paths to fix TS error
import CandidateCard from '@/app/organization-dashboard/applications/components/comparison/CandidateCard';
import SkillsMatchChart from '@/app/organization-dashboard/applications/components/comparison/SkillsMatchChart';
import ComparisonHeader from '@/app/organization-dashboard/applications/components/comparison/ComparisonHeader';
// Import the new matching service
import MatchingService, { JobRequirements, MatchResult } from '@/lib/services/MatchingService';

// We'll use the JobRequirements interface from MatchingService

interface ComparisonViewProps {
  applications: Application[];
  jobId: string;
  onClose: () => void;
}

export default function ComparisonView({ 
  applications, 
  jobId,
  onClose 
}: ComparisonViewProps) {
  const [selectedApplications, setSelectedApplications] = useState<Application[]>([]);
  const [jobRequirements, setJobRequirements] = useState<JobRequirements>({
    required: [],
    preferred: [],
    experience: 2, // Default experience requirement
    education: ['bachelor'], // Default education requirement
    remote: true // Default remote preference
  });
  const [matchResults, setMatchResults] = useState<{[applicationId: string]: MatchResult}>({});

  // In a real implementation, we would fetch the job requirements from the API
  useEffect(() => {
    // Mock job requirements for demonstration
    const mockJobRequirements: JobRequirements = {
      required: ['JavaScript', 'React', 'TypeScript'],
      preferred: ['Next.js', 'Tailwind CSS', 'GraphQL'],
      experience: 2,
      education: ['bachelor'],
      remote: true
    };
    
    setJobRequirements(mockJobRequirements);
    
    // Initialize with all applications if there are 2 or 3,
    // otherwise just the first 2 for comparison
    if (applications.length > 0) {
      setSelectedApplications(
        applications.length <= 3 
          ? applications 
          : applications.slice(0, 2)
      );
    }
  }, [applications]);

  // Add an application to the comparison
  const handleAddToComparison = (application: Application) => {
    if (selectedApplications.length < 3) {
      setSelectedApplications([...selectedApplications, application]);
    }
  };

  // Remove an application from the comparison
  const handleRemoveFromComparison = (applicationId: string) => {
    setSelectedApplications(
      selectedApplications.filter(app => app.id !== applicationId)
    );
  };

  // Calculate match results for all selected applications
  useEffect(() => {
    if (selectedApplications.length === 0) return;
    
    const results: {[applicationId: string]: MatchResult} = {};
    
    selectedApplications.forEach(application => {
      // Convert application to candidate profile for matching
      const candidateProfile = {
        skills: application.skills || [],
        experience: getExperienceFromApplication(application),
        education: getEducationFromApplication(application),
        remotePreference: true // Default assumption
      };
      
      // Calculate match result using our enhanced service
      const result = MatchingService.calculateMatchScore(candidateProfile, jobRequirements);
      results[application.id] = result;
    });
    
    setMatchResults(results);
  }, [selectedApplications, jobRequirements]);
  
  // Helper to estimate experience from application (in a real app this would be structured data)
  const getExperienceFromApplication = (application: Application): number => {
    // Default to 1 year of experience
    return application.experience || 1;
  };
  
  // Helper to get education level from application
  const getEducationFromApplication = (application: Application): string => {
    if (!application.university) return 'high school';
    // This is simplistic - in a real app we'd have structured education data
    return 'bachelor';
  };
  
  // Get match score for an application
  const getMatchScore = (application: Application): number => {
    if (!application.id || !matchResults[application.id]) {
      // If no match result exists, calculate basic score
      if (!application.skills || application.skills.length === 0) {
        return 0;
      }

      const requiredMatches = jobRequirements.required.filter(
        skill => application.skills?.includes(skill)
      ).length;
      
      const preferredMatches = jobRequirements.preferred.filter(
        skill => application.skills?.includes(skill)
      ).length;

      // Weight required skills more heavily than preferred
      const requiredScore = (requiredMatches / jobRequirements.required.length) * 70;
      const preferredScore = (preferredMatches / jobRequirements.preferred.length) * 30;
      
      return Math.round(requiredScore + preferredScore);
    }
    
    return matchResults[application.id].overallScore;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <ComparisonHeader 
        applicationsCount={applications.length} 
        selectedCount={selectedApplications.length}
        onClose={onClose}
      />
      
      {selectedApplications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Select applications to compare (up to 3 at a time)
          </p>
        </div>
      ) : (
        <div className="mt-6">
          {/* Skills match visualization */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Skills Match Comparison</h3>
            <SkillsMatchChart 
              applications={selectedApplications}
              calculateScore={getMatchScore}
              matchResults={matchResults}
            />
          </div>
          
          {/* Side-by-side comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedApplications.map(application => (
              <div key={application.id}>
                <CandidateCard
                  key={application.id}
                  application={application}
                  jobRequirements={jobRequirements}
                  matchScore={matchResults[application.id] ? matchResults[application.id].overallScore : 0}
                  matchResult={matchResults[application.id]}
                  onRemove={handleRemoveFromComparison}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* List of applications that can be added to comparison */}
      {selectedApplications.length < 3 && applications.length > selectedApplications.length && (
        <div className="mt-8 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium mb-2">Add More Candidates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {applications
              .filter(app => !selectedApplications.some(selected => selected.id === app.id))
              .map(application => (
                <div 
                  key={application.id}
                  className="border border-gray-200 rounded p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAddToComparison(application)}
                >
                  <div className="font-medium">{application.studentName}</div>
                  <div className="text-sm text-gray-500">{application.university || 'University not specified'}</div>
                  <div className="mt-1 text-xs text-blue-600">+ Add to comparison</div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
