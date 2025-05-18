'use client';

import CandidateScoreCard from '../CandidateScoreCard';
import { Application } from '../../../../../types/application';

interface MatchScoreSectionProps {
  application: Application;
}

export function MatchScoreSection({ application }: MatchScoreSectionProps) {
  if (!application.scores && application.matchScore === undefined) {
    return null;
  }
  
  return (
    <div className="p-6 border-b border-gray-200">
      {application.scores ? (
        <>
          <h3 className="text-lg font-medium mb-3">Candidate Assessment</h3>
          <CandidateScoreCard scores={application.scores} />
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-3">Match Score</h3>
          <div className="flex items-center">
            <div className={`text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center ${
              application.matchScore && application.matchScore >= 70 
                ? 'bg-green-100 text-green-800' 
                : application.matchScore && application.matchScore >= 50 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-red-100 text-red-800'
            }`}>
              {application.matchScore}%
            </div>
            <p className="ml-3 text-sm text-gray-600">Basic skills match</p>
          </div>
        </>
      )}
    </div>
  );
}

export default MatchScoreSection;
