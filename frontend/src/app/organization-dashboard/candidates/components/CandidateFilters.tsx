'use client';

import React from 'react';
import SkillsFilter from './SkillsFilter';

interface CandidateFiltersProps {
  availableSkills: string[];
  selectedSkills: string[];
  minMatchScore: number;
  onSkillsChange: (skills: string[]) => void;
  onMatchScoreChange: (score: number) => void;
  onResetFilters: () => void;
}

export default function CandidateFilters({
  availableSkills,
  selectedSkills,
  minMatchScore,
  onSkillsChange,
  onMatchScoreChange,
  onResetFilters
}: CandidateFiltersProps) {
  // Handle match score filter change
  const handleMatchScoreFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onMatchScoreChange(parseInt(e.target.value));
  };

  const hasActiveFilters = selectedSkills.length > 0 || minMatchScore > 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Skills filter */}
        <div className="w-full md:w-auto">
          <SkillsFilter 
            availableSkills={availableSkills}
            selectedSkills={selectedSkills}
            onChange={onSkillsChange}
          />
        </div>
        
        {/* Match score filter */}
        <div className="w-full md:w-auto flex items-center">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Min Match Score:
          </label>
          <select 
            value={minMatchScore}
            onChange={handleMatchScoreFilterChange}
            className="rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
          >
            <option value="0">Any</option>
            <option value="50">50% or above</option>
            <option value="70">70% or above</option>
            <option value="80">80% or above</option>
            <option value="90">90% or above</option>
          </select>
        </div>
        
        {/* Reset filters button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
