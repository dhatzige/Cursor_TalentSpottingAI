'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSafeSearchParams } from '@/lib/hooks/useSafeSearchParams';
import SearchBar from '@/components/home/SearchBar';
import { filterJobsBySearchTerms, filterJobsByFilters } from '@/lib/utils/job-search';
import { mockJobs } from '@/lib/data/mockJobs';
import JobFilterBar, { JobFilters } from '@/components/jobs/JobFilterBar';
import JobsList from '@/components/jobs/JobsList';

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSafeSearchParams();
  
  // Get search query from URL if present
  const searchQuery = searchParams.get('q') || '';
  
  // Comprehensive filter state
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
    searchTerm: searchQuery // Initialize with URL search query
  });
  
  // Filtered/displayed jobs state
  const [displayedJobs, setDisplayedJobs] = useState<typeof mockJobs>(mockJobs);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Helper function to handle checkbox filter changes
  const handleMultiSelectChange = (field: 'jobTypes' | 'experienceLevels' | 'industries', value: string) => {
    setFilterState(prev => {
      const currentValues = [...prev[field]];
      const valueIndex = currentValues.indexOf(value);
      
      // Toggle value (add if not present, remove if present)
      if (valueIndex === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(valueIndex, 1);
      }
      
      return { ...prev, [field]: currentValues };
    });
  };
  
  // Helper function for text inputs
  const handleTextInputChange = (field: string, value: string | boolean) => {
    setFilterState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function for adding/removing skill tags
  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim().toLowerCase();
      
      if (value && !filterState.skills.includes(value)) {
        setFilterState(prev => ({
          ...prev,
          skills: [...prev.skills, value]
        }));
      }
      
      input.value = '';
    }
  };
  
  // Remove a skill tag
  const removeSkill = (skill: string) => {
    setFilterState(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };
  
  // Apply all filters and search terms
  const applyFilters = () => {
    setIsFiltering(true);

    // Generate URL parameters from filters
    const params = new URLSearchParams();
    
    if (filterState.jobTypes.length > 0) {
      filterState.jobTypes.forEach(jobType => params.append('jobType', jobType));
    }
    
    if (filterState.experienceLevels.length > 0) {
      filterState.experienceLevels.forEach(level => params.append('experienceLevel', level));
    }
    
    if (filterState.industries.length > 0) {
      filterState.industries.forEach(industry => params.append('industry', industry));
    }
    
    if (filterState.location) params.set('location', filterState.location);
    if (filterState.remote) params.set('remote', 'true');
    if (filterState.salaryMin) params.set('salaryMin', filterState.salaryMin);
    if (filterState.salaryMax) params.set('salaryMax', filterState.salaryMax);
    if (filterState.postedWithin) params.set('postedWithin', filterState.postedWithin);
    
    if (filterState.skills.length > 0) {
      filterState.skills.forEach(skill => params.append('skills', skill));
    }
    
    if (filterState.searchTerm) params.set('q', filterState.searchTerm);
    
    // Update URL without refreshing page
    const url = `/jobs${params.toString() ? '?' + params.toString() : ''}`;
    router.replace(url);
    
    // Filter the jobs based on the current filters
    let filteredJobs = [...mockJobs];
    
    // ALWAYS apply search term filtering FIRST if present
    // This is critical to ensure search works properly
    if (filterState.searchTerm) {
      console.log(`Filtering jobs with search term: "${filterState.searchTerm}"`);
      console.log(`Jobs before filtering: ${filteredJobs.length}`);
      
      // Apply the search filtering - this is the most important part for search functionality
      filteredJobs = filterJobsBySearchTerms(filteredJobs, filterState.searchTerm) as typeof mockJobs;
      console.log(`Jobs after search filtering: ${filteredJobs.length}`);
    }
    
    // Only apply other filters if there are any jobs left after search
    if (filteredJobs.length > 0) {
      const hasAdditionalFilters = 
        filterState.jobTypes.length > 0 ||
        filterState.experienceLevels.length > 0 ||
        filterState.industries.length > 0 ||
        filterState.remote ||
        filterState.location ||
        filterState.salaryMin ||
        filterState.salaryMax ||
        filterState.postedWithin ||
        filterState.skills.length > 0;
      
      if (hasAdditionalFilters) {
        console.log('Applying additional filters');
        filteredJobs = filterJobsByFilters(filteredJobs, {
          jobType: filterState.jobTypes,
          experienceLevel: filterState.experienceLevels,
          industry: filterState.industries,
          remote: filterState.remote,
          location: filterState.location,
          salaryMin: filterState.salaryMin ? parseInt(filterState.salaryMin, 10) : undefined,
          salaryMax: filterState.salaryMax ? parseInt(filterState.salaryMax, 10) : undefined,
          postedWithin: filterState.postedWithin ? parseInt(filterState.postedWithin, 10) : undefined,
          skills: filterState.skills
        }) as typeof mockJobs;
        console.log(`Jobs after additional filters: ${filteredJobs.length}`);
      }
    }
    
    setDisplayedJobs(filteredJobs);
    setTimeout(() => {
      setIsFiltering(false);
    }, 500); // Add slight delay for better UX
  };
  
  // Reset all filters
  const resetFilters = () => {
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
    
    // Clear URL parameters
    router.replace('/jobs');
    
    // Reset displayed jobs to all jobs
    setDisplayedJobs(mockJobs);
  };
  
  // Execute the search immediately when component loads and there's a search query
  useEffect(() => {
    const searchTermFromUrl = searchParams.get('q') || '';
    
    if (searchTermFromUrl) {
      console.log('Initial search from URL query:', searchTermFromUrl);
      
      // Apply the search filter directly to avoid any race conditions
      setIsFiltering(true);
      
      // Direct search application for queries coming from homepage
      const filteredJobs = filterJobsBySearchTerms(mockJobs, searchTermFromUrl) as typeof mockJobs;
      console.log(`Direct search found ${filteredJobs.length} jobs for term: "${searchTermFromUrl}"`);
      
      // Update the displayed jobs
      setDisplayedJobs(filteredJobs);
      setIsFiltering(false);
    }
  }, []); // Only run once on component mount
  
  // Initialize filters and jobs from URL parameters when they change
  useEffect(() => {
    // Parse URL parameters to set initial filter state
    const jobTypes = searchParams.getAll('jobType');
    const experienceLevels = searchParams.getAll('experienceLevel');
    const industries = searchParams.getAll('industry');
    const location = searchParams.get('location') || '';
    const remote = searchParams.get('remote') === 'true';
    const salaryMin = searchParams.get('salaryMin') || '';
    const salaryMax = searchParams.get('salaryMax') || '';
    const postedWithin = searchParams.get('postedWithin') || '';
    const skills = searchParams.getAll('skills');
    const searchTerm = searchParams.get('q') || '';
    
    // Always update the filter state from URL parameters
    setFilterState({
      jobTypes,
      experienceLevels,
      industries,
      location,
      remote,
      salaryMin,
      salaryMax,
      postedWithin,
      skills,
      searchTerm
    });
    
    // Only apply filters if we have specific filter parameters (not just search)
    // We've already handled the search-only case in the first useEffect
    if (jobTypes.length > 0 || experienceLevels.length > 0 || industries.length > 0 || 
        location || remote || salaryMin || salaryMax || postedWithin || skills.length > 0) {
      setTimeout(() => applyFilters(), 0);
    } else if (!searchTerm) {
      // No filters and no search term, show all jobs
      setDisplayedJobs(mockJobs);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-6">Browse Jobs</h1>
          <div className="mb-8">
            <SearchBar 
              className="max-w-3xl" 
              defaultValue={filterState.searchTerm}
            />
          </div>
          
          <JobFilterBar
            filterState={filterState}
            handleMultiSelectChange={handleMultiSelectChange}
            handleTextInputChange={handleTextInputChange}
            handleSkillInput={handleSkillInput}
            removeSkill={removeSkill}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
            isFiltering={isFiltering}
          />
          
          <JobsList 
            isFiltering={isFiltering}
            displayedJobs={displayedJobs}
            resetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
}
