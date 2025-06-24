'use client';

import { useState } from 'react';
import { SearchCriteria } from './types';

interface SearchFiltersProps {
  criteria: SearchCriteria;
  onChange: (criteria: SearchCriteria) => void;
  onSearch: () => void;
  onSave: (name: string) => void;
}

export default function SearchFilters({ criteria, onChange, onSearch, onSave }: SearchFiltersProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [expandedFilters, setExpandedFilters] = useState(false);
  
  // Handle input change
  const handleChange = (field: string, value: any) => {
    onChange({
      ...criteria,
      [field]: value
    });
  };
  
  // Handle skill input
  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      const skill = e.currentTarget.value.trim();
      if (skill && !criteria.skills.includes(skill)) {
        onChange({
          ...criteria,
          skills: [...criteria.skills, skill]
        });
        e.currentTarget.value = '';
      }
    }
  };
  
  // Remove a skill
  const removeSkill = (skill: string) => {
    onChange({
      ...criteria,
      skills: criteria.skills.filter(s => s !== skill)
    });
  };
  
  // Handle location input
  const handleLocationInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      const location = e.currentTarget.value.trim();
      if (location && !criteria.locations.includes(location)) {
        onChange({
          ...criteria,
          locations: [...criteria.locations, location]
        });
        e.currentTarget.value = '';
      }
    }
  };
  
  // Remove a location
  const removeLocation = (location: string) => {
    onChange({
      ...criteria,
      locations: criteria.locations.filter(l => l !== location)
    });
  };
  
  // Handle education selection
  const handleEducationChange = (education: string) => {
    if (criteria.education.includes(education)) {
      onChange({
        ...criteria,
        education: criteria.education.filter(e => e !== education)
      });
    } else {
      onChange({
        ...criteria,
        education: [...criteria.education, education]
      });
    }
  };
  
  // Handle experience range change
  const handleExperienceChange = (field: 'min' | 'max', value: number) => {
    onChange({
      ...criteria,
      experience: {
        ...criteria.experience,
        [field]: value
      }
    });
  };
  
  // Handle match score range change
  const handleMatchScoreChange = (field: 'min' | 'max', value: number) => {
    onChange({
      ...criteria,
      matchScore: {
        ...criteria.matchScore,
        [field]: value
      }
    });
  };
  
  // Handle save
  const handleSave = () => {
    if (searchName.trim()) {
      onSave(searchName);
      setSearchName('');
      setSaveDialogOpen(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Main search bar */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-grow">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search candidates by name, skill, or keyword..."
              value={criteria.query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('query', e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onSearch}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
          
          <button
            type="button"
            onClick={() => setSaveDialogOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
          
          <button
            type="button"
            onClick={() => setExpandedFilters(!expandedFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {expandedFilters ? (
              <>
                <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Fewer Filters
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                More Filters
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Advanced filters section */}
      {expandedFilters && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {criteria.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button 
                      type="button" 
                      onClick={() => removeSkill(skill)}
                      className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                    >
                      <span className="sr-only">Remove {skill}</span>
                      <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Type a skill and press Enter..."
                onKeyDown={handleSkillInput}
              />
            </div>
            
            {/* Locations section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Locations
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {criteria.locations.map((location, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {location}
                    <button 
                      type="button" 
                      onClick={() => removeLocation(location)}
                      className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none focus:bg-green-500 focus:text-white"
                    >
                      <span className="sr-only">Remove {location}</span>
                      <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Type a location and press Enter..."
                onKeyDown={handleLocationInput}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level
              </label>
              <div className="space-y-2">
                {['High School', 'Associate\'s', 'Bachelor\'s', 'Master\'s', 'PhD'].map((edu) => (
                  <div key={edu} className="flex items-center">
                    <input
                      id={`edu-${edu}`}
                      name={`edu-${edu}`}
                      type="checkbox"
                      checked={criteria.education.includes(edu)}
                      onChange={() => handleEducationChange(edu)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`edu-${edu}`} className="ml-2 block text-sm text-gray-700">
                      {edu}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Experience range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max={criteria.experience.max}
                  value={criteria.experience.min}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExperienceChange('min', Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min={criteria.experience.min}
                  value={criteria.experience.max}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExperienceChange('max', Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="text-gray-500">years</span>
              </div>
            </div>
          </div>
          
          {/* Match score range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Match Score Range: {criteria.matchScore.min}% - {criteria.matchScore.max}%
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={criteria.matchScore.min}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMatchScoreChange('min', Number(e.target.value))}
                className="block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={criteria.matchScore.max}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMatchScoreChange('max', Number(e.target.value))}
                className="block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Save search dialog */}
      {saveDialogOpen && (
        <div className="fixed inset-0 overflow-y-auto z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <div className="inline-block bg-gray-50 dark:bg-slate-800/50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Save Search
                    </h3>
                    <div className="mt-4">
                      <input
                        type="text"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter a name for this search"
                        value={searchName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSaveDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
