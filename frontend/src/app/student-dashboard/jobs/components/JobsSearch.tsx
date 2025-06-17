'use client';

import React, { useState, useEffect } from 'react';
import { filterJobsBySearchTerms, filterJobsByFilters } from '@/lib/utils/job-search';
import { mockJobs, Job } from '@/lib/data/mockJobs';

// Define interfaces needed for job filtering
interface SearchFilters {
  jobType?: string[];
  experienceLevel?: string[];
  industry?: string[];
  remote?: boolean;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  postedWithin?: number;
  skills?: string[];
}
import JobFilterBar, { JobFilters } from '@/components/jobs/JobFilterBar';
import JobsList from '@/components/jobs/JobsList';

/**
 * JobsSearch component for the student dashboard
 */
export default function JobsSearch() {
  // Define filter state
  const [filterState, setFilterState] = useState<JobFilters>({
    jobTypes: [],
    experienceLevels: [],
    industries: [],
    location: '',
    remote: false,
    salaryMin: '',
    salaryMax: '',
    postedWithin: '',
    skills: [],
    searchTerm: ''
  });
  
  // Jobs display state
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>(mockJobs);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Handler for multi-select filters
  const handleMultiSelectChange = (field: 'jobTypes' | 'experienceLevels' | 'industries', value: string): void => {
    setFilterState((prev: JobFilters) => {
      const currentValues = [...prev[field]];
      const valueIndex = currentValues.indexOf(value);
      
      if (valueIndex === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(valueIndex, 1);
      }
      
      return { ...prev, [field]: currentValues };
    });
  };
  
  // Handler for text/boolean/number inputs
  const handleTextInputChange = (field: string, value: string | boolean): void => {
    setFilterState((prev: JobFilters) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for adding skills via keyboard
  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim().toLowerCase();
      
      if (value && !filterState.skills.includes(value)) {
        setFilterState((prev: JobFilters) => ({
          ...prev,
          skills: [...prev.skills, value]
        }));
      }
      
      input.value = '';
    }
  };
  
  // Handler for removing skills
  const removeSkill = (skill: string): void => {
    setFilterState((prev: JobFilters) => ({
      ...prev,
      skills: prev.skills.filter((s: string) => s !== skill)
    }));
  };
  
  // Apply filters when filter state changes
  useEffect(() => {
    setIsFiltering(true);
    
    // Apply search terms filter
    let filteredResults = [...mockJobs];
    if (filterState.searchTerm) {
      // Make sure the result is typed as Job[] from our mockJobs import
      filteredResults = filterJobsBySearchTerms(filteredResults, filterState.searchTerm) as Job[];
    }
    
    // Convert string values to proper types for the SearchFilters interface
    const adaptedFilters: SearchFilters = {
      jobType: filterState.jobTypes,
      experienceLevel: filterState.experienceLevels,
      industry: filterState.industries,
      location: filterState.location || undefined,
      remote: filterState.remote,
      salaryMin: filterState.salaryMin ? parseInt(filterState.salaryMin, 10) : undefined,
      salaryMax: filterState.salaryMax ? parseInt(filterState.salaryMax, 10) : undefined,
      postedWithin: filterState.postedWithin ? parseInt(filterState.postedWithin, 10) : undefined,
      skills: filterState.skills
    };
    
    // Apply all other filters and ensure the result is typed as Job[] from our mockJobs import
    filteredResults = filterJobsByFilters(filteredResults, adaptedFilters) as Job[];
    
    // Update state
    setDisplayedJobs(filteredResults);
    setIsFiltering(false);
  }, [filterState]);

  return (
    <div className="space-y-6">
      {/* Search box */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search jobs by title, company, or keyword..."
              className="w-full px-4 py-2 pl-10 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-slate-700 text-gray-900 dark:text-gray-100 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              value={filterState.searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextInputChange('searchTerm', e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Filters panel */}
        <JobFilterBar 
          filterState={filterState}
          handleMultiSelectChange={handleMultiSelectChange}
          handleTextInputChange={handleTextInputChange} 
          handleSkillInput={handleSkillInput}
          removeSkill={removeSkill}
          applyFilters={() => {}}
          resetFilters={() => {
            setFilterState({
              jobTypes: [],
              experienceLevels: [],
              industries: [],
              location: '',
              remote: false,
              salaryMin: '',
              salaryMax: '',
              postedWithin: '',
              skills: [],
              searchTerm: ''
            });
          }}
          isFiltering={isFiltering}
        />
      </div>
      
      {/* Results section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 dark:text-white">
            {displayedJobs.length} Jobs Found
          </h3>
          
          {/* Sorting control */}
          <div className="flex gap-2">
            <select 
              className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-3 py-1.5 text-sm"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                // Sort jobs logic would go here
                console.log('Sort by:', e.target.value);
              }}
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="recent">Most Recent</option>
              <option value="salary-high">Salary (High to Low)</option>
              <option value="salary-low">Salary (Low to High)</option>
            </select>
          </div>
        </div>
        
        {/* Job list */}
        <JobsList 
          isFiltering={isFiltering}
          displayedJobs={displayedJobs}
          resetFilters={() => {
            setFilterState({
              jobTypes: [],
              experienceLevels: [],
              industries: [],
              location: '',
              remote: false,
              salaryMin: '',
              salaryMax: '',
              postedWithin: '',
              skills: [],
              searchTerm: ''
            });
          }}
        />
      </div>
    </div>
  );
}
