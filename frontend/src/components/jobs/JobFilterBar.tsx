'use client';

import React, { useState } from 'react';
import { JOB_TYPES, EXPERIENCE_LEVELS, INDUSTRIES, POSTED_TIMES } from '@/lib/data/mockJobs';

// Define the filter state interface
export interface JobFilters {
  jobTypes: string[];
  experienceLevels: string[];
  industries: string[];
  location: string;
  remote: boolean;
  salaryMin: string;
  salaryMax: string;
  postedWithin: string;
  skills: string[];
  searchTerm: string;
}

interface JobFilterBarProps {
  filterState: JobFilters;
  handleMultiSelectChange: (field: 'jobTypes' | 'experienceLevels' | 'industries', value: string) => void;
  handleTextInputChange: (field: string, value: string | boolean) => void;
  handleSkillInput: (e: any) => void;
  removeSkill: (skill: string) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  isFiltering: boolean;
}

export default function JobFilterBar({
  filterState,
  handleMultiSelectChange,
  handleTextInputChange,
  handleSkillInput,
  removeSkill,
  applyFilters,
  resetFilters,
  isFiltering
}: JobFilterBarProps) {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Count active filters for badge
  const activeFilterCount = [
    filterState.jobTypes.length,
    filterState.experienceLevels.length,
    filterState.industries.length,
    filterState.location ? 1 : 0,
    filterState.remote ? 1 : 0,
    filterState.salaryMin || filterState.salaryMax ? 1 : 0,
    filterState.postedWithin ? 1 : 0,
    filterState.skills.length
  ].reduce((sum, count) => sum + count, 0);
  
  const toggleFilterPanel = () => setIsFilterPanelOpen(prev => !prev);

  return (
    <div className="bg-[#131b39]/50 rounded-lg border border-gray-800 mb-6 shadow-inner shadow-blue-900/20">
      {/* Filter Header with Toggle */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={toggleFilterPanel}
            className="text-white flex items-center gap-2 focus:outline-none"
            aria-expanded={isFilterPanelOpen}
            aria-controls="job-filters-panel"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-medium">Filters</span>
            </span>
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full">
                {activeFilterCount}
              </span>
            )}
            <svg 
              className={`w-4 h-4 ml-2 transition-transform ${isFilterPanelOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={resetFilters}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors text-sm"
            type="button"
          >
            Reset
          </button>
          <button 
            onClick={applyFilters}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm flex items-center"
            disabled={isFiltering}
          >
            {isFiltering ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                Filtering...
              </>
            ) : (
              'Apply Filters'
            )}
          </button>
        </div>
      </div>
      
      {/* Expandable Filter Content */}
      <div 
        id="job-filters-panel"
        className={`${isFilterPanelOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'} transition-all duration-300 ease-in-out`}
      >
        <div className="border-t border-gray-800 p-6">
          <div className="space-y-6">
            {/* Search Term */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Search Term</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-[#0d1424] border border-gray-700 rounded-md text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-inner"
                placeholder="Enter search terms (e.g. 'developer +react -junior')"
                value={filterState.searchTerm}
                onChange={(e) => handleTextInputChange('searchTerm', e.target.value)}
              />
              <div className="mt-1.5 flex flex-wrap gap-2">
                <div className="text-xs text-gray-400 bg-[#0d1424]/70 px-2 py-1 rounded-md">"exact phrase"</div>
                <div className="text-xs text-gray-400 bg-[#0d1424]/70 px-2 py-1 rounded-md">+required</div>
                <div className="text-xs text-gray-400 bg-[#0d1424]/70 px-2 py-1 rounded-md">-excluded</div>
                <div className="text-xs text-gray-400 bg-[#0d1424]/70 px-2 py-1 rounded-md">term1 OR term2</div>
              </div>
            </div>
            
            {/* Basic Filters Group */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Filter */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Location</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-[#0d1424] border border-gray-700 rounded-md text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-inner"
                  placeholder="e.g. San Francisco, New York"
                  value={filterState.location}
                  onChange={(e) => handleTextInputChange('location', e.target.value)}
                />
                <label className="flex items-center mt-2">
                  <input 
                    type="checkbox" 
                    className="mr-2 h-4 w-4 accent-blue-500 cursor-pointer"
                    checked={filterState.remote}
                    onChange={(e) => handleTextInputChange('remote', e.target.checked)}
                  />
                  <span className="text-sm text-white">Remote Only</span>
                </label>
              </div>
              
              {/* Salary Range */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Salary Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-[#0d1424] border border-gray-700 rounded-md text-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-inner"
                    placeholder="Min ($)"
                    value={filterState.salaryMin}
                    onChange={(e) => handleTextInputChange('salaryMin', e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-[#0d1424] border border-gray-700 rounded-md text-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-inner"
                    placeholder="Max ($)"
                    value={filterState.salaryMax}
                    onChange={(e) => handleTextInputChange('salaryMax', e.target.value)}
                  />
                </div>
              </div>
              
              {/* Posted Within */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Posted Within</label>
                <select
                  className="w-full px-4 py-3 bg-[#0d1424] border border-gray-700 rounded-md text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none shadow-inner"
                  value={filterState.postedWithin}
                  onChange={(e) => handleTextInputChange('postedWithin', e.target.value)}
                >
                  <option value="">Any Time</option>
                  {POSTED_TIMES.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Job Types */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Job Type</label>
              <div className="flex flex-wrap gap-3">
                {JOB_TYPES.map(jobType => (
                  <label key={jobType.value} className={`
                    flex items-center px-3 py-2 rounded-md cursor-pointer
                    ${filterState.jobTypes.includes(jobType.value) 
                      ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300' 
                      : 'bg-[#0d1424]/70 border border-gray-700 text-gray-300 hover:border-gray-600'}
                  `}>
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={filterState.jobTypes.includes(jobType.value)}
                      onChange={() => handleMultiSelectChange('jobTypes', jobType.value)}
                    />
                    <span>{jobType.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Experience Levels */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Experience Level</label>
              <div className="flex flex-wrap gap-3">
                {EXPERIENCE_LEVELS.map(level => (
                  <label key={level.value} className={`
                    flex items-center px-3 py-2 rounded-md cursor-pointer
                    ${filterState.experienceLevels.includes(level.value) 
                      ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300' 
                      : 'bg-[#0d1424]/70 border border-gray-700 text-gray-300 hover:border-gray-600'}
                  `}>
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={filterState.experienceLevels.includes(level.value)}
                      onChange={() => handleMultiSelectChange('experienceLevels', level.value)}
                    />
                    <span>{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Industries */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Industry</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {INDUSTRIES.map(industry => (
                  <label key={industry.value} className={`
                    flex items-center px-3 py-2 rounded-md cursor-pointer
                    ${filterState.industries.includes(industry.value) 
                      ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300' 
                      : 'bg-[#0d1424]/70 border border-gray-700 text-gray-300 hover:border-gray-600'}
                  `}>
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={filterState.industries.includes(industry.value)}
                      onChange={() => handleMultiSelectChange('industries', industry.value)}
                    />
                    <span className="text-sm">{industry.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Skills */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Skills</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-[#0d1424] border border-gray-700 rounded-md text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-inner"
                  placeholder="Type a skill and press Enter"
                  onKeyDown={handleSkillInput}
                />
              </div>
              {filterState.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {filterState.skills.map((skill) => (
                    <div 
                      key={skill} 
                      className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-md flex items-center"
                    >
                      <span>{skill}</span>
                      <button 
                        className="ml-2 text-blue-300 hover:text-blue-100"
                        onClick={() => removeSkill(skill)}
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
