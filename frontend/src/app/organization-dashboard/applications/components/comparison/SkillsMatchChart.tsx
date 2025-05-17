'use client';

import { Application } from '../../../../../types/application';
import { MatchResult } from '../../../../../lib/services/MatchingService';

interface SkillsMatchChartProps {
  applications: Application[];
  calculateScore: (application: Application) => number;
  matchResults?: {[applicationId: string]: MatchResult};
}

export default function SkillsMatchChart({
  applications,
  calculateScore,
  matchResults = {}
}: SkillsMatchChartProps) {
  // Maximum score for scaling
  const maxScore = 100;
  
  return (
    <div className="relative">
      {/* Chart container */}
      <div className="flex h-[120px] items-end space-x-2 md:space-x-8">
        {applications.map(application => {
          const score = calculateScore(application);
          const heightPercentage = (score / maxScore) * 100;
          const matchResult = matchResults[application.id];
          
          return (
            <div 
              key={application.id} 
              className="flex-1 flex flex-col items-center"
            >
              {/* Bar label (percentage) */}
              <div className="text-sm font-medium mb-2">{score}%</div>
              
              {/* Breakdown tooltips if we have detailed match results */}
              {matchResult && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Required: {matchResult.requiredSkillsScore.toFixed(0)}%
                  <br />
                  Preferred: {matchResult.preferredSkillsScore.toFixed(0)}%
                </div>
              )}
              
              {/* Bar */}
              <div className="w-full relative h-[80px]">
                <div 
                  className={`absolute bottom-0 w-full rounded-t-md ${
                    score >= 80 
                      ? 'bg-green-500' 
                      : score >= 60 
                        ? 'bg-yellow-500' 
                        : 'bg-gray-400'
                  }`}
                  style={{ height: `${heightPercentage}%` }}
                />
              </div>
              
              {/* Candidate name */}
              <div className="text-xs text-center mt-2 font-medium text-gray-700 w-full truncate">
                {application.studentName}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>80-100%: Strong match</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
          <span>60-79%: Good match</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
          <span>0-59%: Weak match</span>
        </div>
      </div>
      
      {/* Skills match explanation */}
      <div className="mt-2 text-xs text-gray-500">
        Skills match is calculated based on required skills (50%), preferred skills (20%), 
        {Object.keys(matchResults).length > 0 && ' experience (15%), education (10%), and location (5%).'}
        {Object.keys(matchResults).length === 0 && ' and other qualifications (30%).'}
      </div>
    </div>
  );
}
