/**
 * Job Filters Module
 * 
 * Handles filtering job listings based on search filters
 */
import { Job, SearchFilters } from './types';
import { matchesRelatedTerm } from '../job-synonyms';
import { parseSearchQuery } from './search-parser';

/**
 * Apply advanced search filtering to job listings
 * Supports quoted phrases, +required terms, -excluded terms, and OR alternatives
 * Also includes matching of related job roles and synonyms
 */
export function filterJobsBySearchTerms(jobs: Job[], searchTerms: string): Job[] {
  if (!searchTerms.trim()) return jobs;
  
  // Parse the search query for special operators
  const {
    regularTerms,
    requiredTerms,
    excludedTerms,
    orTerms
  } = parseSearchQuery(searchTerms);
  
  console.log('Searching jobs with terms:', { regularTerms, requiredTerms, excludedTerms, orTerms, searchTerms });
  console.log('Number of jobs before filtering:', jobs.length);
  
  // The main job filtering function
  const filteredJobs = jobs.filter(job => {
    // Create a single string to search within for this job
    const jobText = [
      job.title || '',
      job.company || '',
      job.location || '',
      job.description || '',
      job.jobType || '',
      job.experienceLevel || '',
      job.industry || '',
      ...(job.skills || []),
      ...(job.tags || []),
      ...(job.benefits || [])
    ].join(' ').toLowerCase();
    
    // For debugging individual job matching
    const jobTitle = job.title || '';
    
    // Check excluded terms first - if any match, exclude this job
    if (excludedTerms.length > 0) {
      const hasExcluded = excludedTerms.some(term => jobText.includes(term.toLowerCase()));
      if (hasExcluded) {
        return false;
      }
    }
    
    // Check required terms - all must match
    if (requiredTerms.length > 0) {
      const allRequired = requiredTerms.every(term => matchesRelatedTerm(jobText, term));
      if (!allRequired) {
        return false;
      }
    }
    
    // Handle OR terms if present
    if (orTerms.length > 0) {
      const hasOrMatch = orTerms.some(term => matchesRelatedTerm(jobText, term));
      return hasOrMatch;
    }
    
    // For regular terms (which is the most common case for simple searches)
    if (regularTerms.length > 0) {
      // For single term searches like "sales"
      if (regularTerms.length === 1) {
        const term = regularTerms[0];
        if (term.length <= 2) return true; // Skip very short terms
        
        // This is the key part - we use the matchesRelatedTerm function that handles synonyms
        const matches = matchesRelatedTerm(jobText, term);
        console.log(`Job ${jobTitle} matches '${term}': ${matches}`);
        return matches;
      }
      
      // For multiple regular terms, check if the job matches any of them
      const hasMatch = regularTerms.some(term => {
        if (term.length <= 2) return false; // Skip very short terms
        return matchesRelatedTerm(jobText, term);
      });
      
      return hasMatch;
    }
    
    return true; // No terms to filter on, include the job
  });
  
  console.log('Number of jobs after filtering:', filteredJobs.length);
  // Last resort - if we're searching for 'sales' and got no results, we might need to add sample data
  if (searchTerms.toLowerCase().includes('sales') && filteredJobs.length === 0) {
    console.log('⚠️ No sales jobs found, but this is a common search term');
  }
  
  return filteredJobs;
}

/**
 * Apply all filters to job listings
 */
export function filterJobsByFilters(jobs: Job[], filters: SearchFilters): Job[] {
  return jobs.filter(job => {
    // Job Type filter
    if (filters.jobType && filters.jobType.length > 0 && 
        job.jobType && !filters.jobType.includes(job.jobType)) {
      return false;
    }
    
    // Experience Level filter
    if (filters.experienceLevel && filters.experienceLevel.length > 0 && 
        job.experienceLevel && !filters.experienceLevel.includes(job.experienceLevel)) {
      return false;
    }
    
    // Industry filter
    if (filters.industry && filters.industry.length > 0 && job.industry &&
        !filters.industry.some(industry => 
          job.industry?.toLowerCase().includes(industry.toLowerCase()))) {
      return false;
    }
    
    // Remote filter
    if (filters.remote === true && job.remote !== true) {
      return false;
    }
    
    // Location filter
    if (filters.location && filters.location.trim() !== '' && job.location) {
      const locationLower = job.location.toLowerCase();
      const filterLocationLower = filters.location.toLowerCase();
      if (!locationLower.includes(filterLocationLower)) {
        return false;
      }
    }
    
    // Salary Range filter
    if (filters.salaryMin && job.salaryMax && job.salaryMax < filters.salaryMin) {
      return false;
    }
    if (filters.salaryMax && job.salaryMin && job.salaryMin > filters.salaryMax) {
      return false;
    }
    
    // Posted Within filter
    if (filters.postedWithin && job.posted) {
      const jobDate = new Date(job.posted);
      const currentDate = new Date();
      const diffTime = currentDate.getTime() - jobDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > filters.postedWithin) {
        return false;
      }
    }
    
    // Skills filter
    if (filters.skills && filters.skills.length > 0 && job.skills) {
      const jobSkills = job.skills.map(skill => skill.toLowerCase());
      const requiredSkills = filters.skills.map(skill => skill.toLowerCase());
      
      // Check if job has all required skills
      if (!requiredSkills.every(skill => jobSkills.includes(skill))) {
        return false;
      }
    }
    
    return true;
  });
}
