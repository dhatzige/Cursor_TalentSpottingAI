'use client';

import { CandidateScore, ScoreBreakdown } from '../../../../types/application';

interface ScoreCategory {
  name: string;
  key: keyof ScoreBreakdown;
  description: string;
  icon: string;
}

interface CandidateScoreCardProps {
  scores: CandidateScore;
}

// Score category definitions with descriptions and icons
const scoreCategories: ScoreCategory[] = [
  {
    name: 'Skills Match',
    key: 'skills',
    description: 'How closely the candidate\'s skills match the job requirements',
    icon: '💼'
  },
  {
    name: 'Education',
    key: 'education',
    description: 'Relevance of educational background to the position',
    icon: '🎓'
  },
  {
    name: 'Experience',
    key: 'experience',
    description: 'Relevant work experience and industry knowledge',
    icon: '⏱️'
  },
  {
    name: 'Application Quality',
    key: 'applicationQuality',
    description: 'The quality and completeness of the application materials',
    icon: '📄'
  }
];

// Function to determine score color based on value
const getScoreColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-blue-100 text-blue-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

// Function to get score recommendation text
const getScoreRecommendation = (overallScore: number): string => {
  if (overallScore >= 85) return 'Excellent match! Consider fast-tracking this candidate.';
  if (overallScore >= 70) return 'Strong candidate worth interviewing.';
  if (overallScore >= 50) return 'Potential match but may need additional evaluation.';
  return 'Not a strong match for this position.';
};

export default function CandidateScoreCard({ scores }: CandidateScoreCardProps) {
  const { overallScore, breakdownScores } = scores;
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="font-semibold text-gray-700 mb-2">Match Score Analysis</h3>
      
      {/* Overall Score */}
      <div className="flex items-center mb-4">
        <div className={`text-2xl font-bold rounded-full w-16 h-16 flex items-center justify-center ${getScoreColor(overallScore)}`}>
          {overallScore}%
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-600">Overall Match</p>
          <p className="text-sm font-medium">{getScoreRecommendation(overallScore)}</p>
        </div>
      </div>
      
      {/* Score Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Score Breakdown</h4>
        
        {scoreCategories.map((category) => (
          <div key={category.key} className="flex items-center">
            <div className="mr-2">{category.icon}</div>
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600">{category.name}</span>
                <span className="text-xs font-semibold">{breakdownScores[category.key]}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${breakdownScores[category.key]}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 italic">
        Score calculated based on skills match, education relevance, experience alignment, and application quality.
      </div>
    </div>
  );
}
