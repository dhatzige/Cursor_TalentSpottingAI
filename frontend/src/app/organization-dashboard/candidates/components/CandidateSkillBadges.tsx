import React from 'react';

interface CandidateSkillBadgesProps {
  skills: string[];
  maxVisible?: number;
}

export default function CandidateSkillBadges({ 
  skills, 
  maxVisible = 3 
}: CandidateSkillBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {skills.slice(0, maxVisible).map((skill, index) => (
        <span 
          key={index} 
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50"
        >
          {skill}
        </span>
      ))}
      {skills.length > maxVisible && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-600">
          +{skills.length - maxVisible} more
        </span>
      )}
    </div>
  );
}
