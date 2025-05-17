'use client';

import { Application } from '../../../../../types/application';
import StatusBadge from '../StatusBadge';
import { JobRequirements, MatchResult } from '../../../../../lib/services/MatchingService';

// Using JobRequirements from MatchingService instead

interface CandidateCardProps {
  application: Application;
  jobRequirements: JobRequirements;
  matchScore: number;
  matchResult?: MatchResult;
  onRemove: (applicationId: string) => void;
}

export default function CandidateCard({
  application,
  jobRequirements,
  matchScore,
  matchResult,
  onRemove
}: CandidateCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Card header with match score */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="font-medium">{application.studentName}</h3>
          <div className="text-sm text-gray-600">{application.university || 'University not specified'}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs font-medium text-gray-500 mb-1">Match</div>
          {matchResult && (
            <div className="text-xs mb-1">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Skills: {Math.round(matchResult.requiredSkillsScore * 0.5 + matchResult.preferredSkillsScore * 0.2)}%</span>
              </div>
              {matchResult.experienceScore !== undefined && (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>Exp: {matchResult.experienceScore}%</span>
                </div>
              )}
            </div>
          )}
          <div className={`text-sm font-semibold rounded-full px-2 py-1 ${
            matchScore >= 80 
              ? 'bg-green-100 text-green-800' 
              : matchScore >= 60 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-800'
          }`}>
            {matchScore}%
          </div>
        </div>
      </div>
      
      {/* Card body with skills and application details */}
      <div className="p-4">
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Application Status</div>
          <StatusBadge status={application.status} />
          <div className="text-xs text-gray-500 mt-1">
            Applied on {new Date(application.createdAt).toLocaleDateString()}
          </div>
          {application.status !== 'pending' && (
            <div className="text-xs text-gray-500 mt-1">
              Updated on {new Date(application.updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Skills</div>
          <div className="flex flex-wrap gap-1">
            {application.skills && application.skills.length > 0 ? (
              application.skills.map(skill => {
                const isRequired = jobRequirements.required.includes(skill);
                const isPreferred = jobRequirements.preferred.includes(skill);
                
                return (
                  <span 
                    key={skill}
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      isRequired 
                        ? 'bg-blue-100 text-blue-800' 
                        : isPreferred 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {skill}
                    {isRequired && ' ★'}
                  </span>
                );
              })
            ) : (
              <div className="text-sm text-gray-500">No skills listed</div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Cover Letter</div>
          <div className="text-sm text-gray-600 line-clamp-3">
            {application.coverLetter || 'No cover letter provided'}
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => window.open(application.resumeUrl, '_blank')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
            disabled={!application.resumeUrl}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            View Resume
          </button>
          
          <button
            onClick={() => onRemove(application.id)}
            className="text-gray-600 hover:text-red-600 text-sm font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
