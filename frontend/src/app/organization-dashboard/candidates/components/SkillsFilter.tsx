'use client';

import React, { useState } from 'react';

interface SkillsFilterProps {
  availableSkills: string[];
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillsFilter({
  availableSkills,
  selectedSkills,
  onChange
}: SkillsFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle skill selection/deselection
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter(s => s !== skill));
    } else {
      onChange([...selectedSkills, skill]);
    }
  };
  
  // Filter available skills based on search query
  const filteredSkills = searchQuery.trim() 
    ? availableSkills.filter(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableSkills;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        Skills
      </label>
      
      {/* Search input */}
      <input
        type="text"
        placeholder="Search skills..."
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
      
      {/* Skills selection */}
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
        {filteredSkills.length > 0 ? (
          filteredSkills.map(skill => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                selectedSkills.includes(skill)
                  ? 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
              }`}
            >
              {skill}
            </button>
          ))
        ) : searchQuery ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 w-full text-center py-2">
            No skills match your search
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 w-full text-center py-2">
            No skills available
          </p>
        )}
      </div>
      
      {/* Selected skills count */}
      {selectedSkills.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}
