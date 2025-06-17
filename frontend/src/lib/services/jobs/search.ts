/**
 * Jobs Search Module
 * 
 * Handles searching job listings with pagination
 */
import { JobListing, JobSearchQuery, PaginatedJobResults, JobSearchResponse } from '@/types/jobs';
import { mockJobs } from './mock-data';
import { parseSearchQuery, matchesRelatedTerm } from './search-parser';
import { filterJobsByFilters } from './filters';

/**
 * Filter jobs by search terms using advanced search logic
 */
export function filterJobsBySearchTerms(jobs: JobListing[], searchTerms: string): JobListing[] {
  // Parse the search query for special operators
  const {
    regularTerms,
    requiredTerms,
    excludedTerms,
    orTerms
  } = parseSearchQuery(searchTerms);
  
  return jobs.filter(job => {
    // Create a single string to search within for this job
    const jobText = [
      job.title,
      job.company,
      job.location,
      job.description,
      job.jobType,
      job.experienceLevel,
      job.industry,
      ...(job.skills || []),
      ...(job.benefits || [])
    ].join(' ').toLowerCase();
    
    // Check excluded terms first - if any match, exclude this job
    if (excludedTerms.some(term => jobText.includes(term.toLowerCase()))) {
      return false;
    }
    
    // Check required terms - all must match
    if (!requiredTerms.every(term => jobText.includes(term.toLowerCase()))) {
      return false;
    }
    
    // Handle OR terms if present
    if (orTerms.length > 0) {
      return orTerms.some(term => jobText.includes(term.toLowerCase()));
    }
    
    // For regular terms, all must match if no OR terms
    if (regularTerms.length > 0) {
      return regularTerms.every(term => {
        // Skip very short terms
        if (term.length <= 2) return true;
        
        // Check for term match or related terms
        return jobText.includes(term.toLowerCase()) || 
               matchesRelatedTerm(jobText, term.toLowerCase());
      });
    }
    
    return true;
  });
}

/**
 * Fetches job listings with optional search, filters, and pagination
 */
export async function searchJobs(
  query: JobSearchQuery
): Promise<JobSearchResponse> {
  // In a real app, this would be an API call
  console.log('Searching with query:', query);
  
  let filteredJobs = [...mockJobs];
  const { searchTerms, filters, page = 1, pageSize = 10 } = query;

  // Apply search term filtering if provided
  if (searchTerms && searchTerms.trim() !== '') {
    filteredJobs = filterJobsBySearchTerms(filteredJobs, searchTerms);
  }
  
  // Apply filters if provided
  if (filters) {
    filteredJobs = filterJobsByFilters(filteredJobs, filters);
  }
  
  // Calculate pagination
  const totalResults = filteredJobs.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // Get the current page of results
  const paginatedResults = filteredJobs.slice(startIndex, endIndex);
  
  return {
    results: paginatedResults,
    pagination: {
      page,
      pageSize,
      totalResults,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
}

/**
 * Get a job by ID
 */
export async function getJobById(id: number): Promise<JobListing | null> {
  // In a real app, this would be an API call
  const job = mockJobs.find(job => job.id === id);
  return job || null;
}
