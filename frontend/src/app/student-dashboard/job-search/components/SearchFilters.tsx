'use client';

import React, { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface SearchFiltersProps {
  onFilterChange: (filters: JobFilters) => void;
  initialFilters?: JobFilters;
}

export interface JobFilters {
  jobType: string[];
  experienceLevel: string[];
  location: string[];
  salary: string[];
  remote: boolean;
  postedWithin: string | null;
  keyword: string;
  [key: string]: string[] | boolean | string | null;
}

/**
 * Job search filters component for the student dashboard
 * Allows filtering jobs by multiple criteria
 */
export default function SearchFilters({ 
  onFilterChange, 
  initialFilters = {
    jobType: [],
    experienceLevel: [],
    location: [],
    salary: [],
    remote: false,
    postedWithin: null,
    keyword: ''
  }
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<JobFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Available filter options
  const jobTypeOptions: FilterOption[] = [
    { label: 'Full-time', value: 'full-time' },
    { label: 'Part-time', value: 'part-time' },
    { label: 'Contract', value: 'contract' },
    { label: 'Internship', value: 'internship' },
    { label: 'Remote', value: 'remote' },
  ];

  const experienceLevelOptions: FilterOption[] = [
    { label: 'Entry Level', value: 'entry' },
    { label: 'Mid Level', value: 'mid' },
    { label: 'Senior', value: 'senior' },
  ];

  const locationOptions: FilterOption[] = [
    { label: 'New York', value: 'new-york' },
    { label: 'San Francisco', value: 'san-francisco' },
    { label: 'London', value: 'london' },
    { label: 'Berlin', value: 'berlin' },
    { label: 'Remote', value: 'remote' },
  ];

  const salaryOptions: FilterOption[] = [
    { label: '$0 - $50k', value: '0-50000' },
    { label: '$50k - $100k', value: '50000-100000' },
    { label: '$100k - $150k', value: '100000-150000' },
    { label: '$150k+', value: '150000+' },
  ];

  const postedWithinOptions: FilterOption[] = [
    { label: 'Last 24 hours', value: '24h' },
    { label: 'Last 3 days', value: '3d' },
    { label: 'Last week', value: '1w' },
    { label: 'Last month', value: '1m' },
  ];

  // Handle checkbox filter changes
  const handleCheckboxChange = (category: keyof JobFilters, value: string) => {
    const updatedFilters = { ...filters } as JobFilters;
    
    if (Array.isArray(updatedFilters[category])) {
      const currentValues = updatedFilters[category] as string[];
      
      if (currentValues.includes(value)) {
        // Remove value if already selected
        updatedFilters[category] = currentValues.filter(v => v !== value) as JobFilters[typeof category];
      } else {
        // Add value if not already selected
        updatedFilters[category] = [...currentValues, value] as JobFilters[typeof category];
      }
      
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    }
  };

  // Handle boolean filter changes
  const handleBooleanChange = (category: keyof JobFilters, value: boolean) => {
    const updatedFilters: JobFilters = { 
      ...filters,
      [category]: value 
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Handle single-select filter changes
  const handleSingleSelectChange = (category: keyof JobFilters, value: string | null) => {
    const updatedFilters: JobFilters = { 
      ...filters,
      [category]: value 
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Handle keyword search
  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    const updatedFilters: JobFilters = { 
      ...filters,
      keyword 
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Calculate the number of active filters
  const getActiveFilterCount = (): number => {
    let count = 0;
    
    if (filters.jobType.length > 0) count++;
    if (filters.experienceLevel.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.salary.length > 0) count++;
    if (filters.remote) count++;
    if (filters.postedWithin) count++;
    if (filters.keyword) count++;
    
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Reset all filters
  const resetFilters = () => {
    const emptyFilters: JobFilters = {
      jobType: [],
      experienceLevel: [],
      location: [],
      salary: [],
      remote: false,
      postedWithin: null,
      keyword: ''
    };
    
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md mb-6">
      {/* Search input and filter toggle */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              className="block w-full p-2 pl-10 text-sm text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Search by job title, skill, or company..." 
              value={filters.keyword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleKeywordChange(e)}
            />
          </div>
          <button 
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-slate-700 dark:text-gray-200 dark:border-gray-600 dark:hover:text-white dark:hover:bg-slate-600 flex items-center gap-2 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-3 py-2 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter panels */}
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Job Type */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-2">Job Type</h3>
            <div className="space-y-2">
              {jobTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`job-type-${option.value}`}
                    type="checkbox"
                    checked={filters.jobType.includes(option.value)}
                    onChange={() => handleCheckboxChange('jobType', option.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`job-type-${option.value}`}
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100 dark:text-gray-300"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-2">Experience Level</h3>
            <div className="space-y-2">
              {experienceLevelOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`experience-${option.value}`}
                    type="checkbox"
                    checked={filters.experienceLevel.includes(option.value)}
                    onChange={() => handleCheckboxChange('experienceLevel', option.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`experience-${option.value}`}
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100 dark:text-gray-300"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-2">Location</h3>
            <div className="space-y-2">
              {locationOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`location-${option.value}`}
                    type="checkbox"
                    checked={filters.location.includes(option.value)}
                    onChange={() => handleCheckboxChange('location', option.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`location-${option.value}`}
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100 dark:text-gray-300"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-2">Salary Range</h3>
            <div className="space-y-2">
              {salaryOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`salary-${option.value}`}
                    type="checkbox"
                    checked={filters.salary.includes(option.value)}
                    onChange={() => handleCheckboxChange('salary', option.value)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`salary-${option.value}`}
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100 dark:text-gray-300"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Remote */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-2">Remote Options</h3>
            <div className="flex items-center">
              <input
                id="remote-option"
                type="checkbox"
                checked={filters.remote}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleBooleanChange('remote', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="remote-option"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100 dark:text-gray-300"
              >
                Remote only
              </label>
            </div>
          </div>

          {/* Posted Within */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-2">Posted Within</h3>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={filters.postedWithin || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSingleSelectChange('postedWithin', e.target.value || null)}
            >
              <option value="">Any time</option>
              {postedWithinOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
