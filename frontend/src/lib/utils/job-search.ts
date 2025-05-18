/**
 * Job Search Utilities
 * 
 * Advanced search functionality for job listings including 
 * keyword parsing and filter application
 */
import { matchesRelatedTerm } from './job-synonyms';

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  remote?: boolean;
  posted?: string;
  postedRelative?: string;
  jobType?: string;
  experienceLevel?: string;
  industry?: string;
  skills?: string[];
  tags?: string[];
  benefits?: string[];
};

type SearchFilters = {
  jobType?: string[];
  experienceLevel?: string[];
  industry?: string[];
  remote?: boolean;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  postedWithin?: number; // In days
  skills?: string[];
};

type ParsedSearchQuery = {
  regularTerms: string[];
  requiredTerms: string[];
  excludedTerms: string[];
  orTerms: string[];
};

/**
 * Parse search query for special operators
 */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  const regularTerms: string[] = [];
  const requiredTerms: string[] = [];
  const excludedTerms: string[] = [];
  const orTerms: string[] = [];
  
  // Handle quoted phrases
  const quotedPhrasesRegex = /"([^"]+)"/g;
  const quotedPhrases = Array.from(query.matchAll(quotedPhrasesRegex)).map(match => match[1]);
  
  // Remove quoted phrases from query for further processing
  let remainingQuery = query;
  quotedPhrases.forEach(phrase => {
    remainingQuery = remainingQuery.replace(`"${phrase}"`, '');
    regularTerms.push(phrase);
  });
  
  // Split remaining terms by spaces
  const terms = remainingQuery.trim().split(/\s+/).filter(term => term);
  
  // Process each term for special operators
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    
    // Skip empty terms
    if (!term) continue;
    
    // Check for "OR" operator
    if (term.toLowerCase() === 'or' && i > 0 && i < terms.length - 1) {
      // Add the term before OR and after OR to orTerms
      orTerms.push(terms[i-1]);
      orTerms.push(terms[i+1]);
      // Remove the already processed term before OR from regularTerms
      const termBeforeIndex = regularTerms.indexOf(terms[i-1]);
      if (termBeforeIndex !== -1) {
        regularTerms.splice(termBeforeIndex, 1);
      }
      // Skip the next term as we've already processed it
      i++;
    }
    // Required term
    else if (term.startsWith('+')) {
      requiredTerms.push(term.substring(1));
    }
    // Excluded term
    else if (term.startsWith('-')) {
      excludedTerms.push(term.substring(1));
    }
    // Regular term
    else {
      regularTerms.push(term);
    }
  }
  
  return { regularTerms, requiredTerms, excludedTerms, orTerms };
}

// We don't need a local matchesRelatedTerm function since we import it from job-synonyms.ts

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

/**
 * Generate URL search params from filter state
 */
export function filtersToSearchParams(
  query: string,
  searchType: string,
  filters: SearchFilters
): URLSearchParams {
  const params = new URLSearchParams();
  
  // Add search query and type
  if (query) params.set('q', query);
  if (searchType) params.set('type', searchType);
  
  // Add filter parameters
  if (filters.jobType?.length) {
    filters.jobType.forEach(type => params.append('jobType', type));
  }
  
  if (filters.experienceLevel?.length) {
    filters.experienceLevel.forEach(level => params.append('experienceLevel', level));
  }
  
  if (filters.industry?.length) {
    filters.industry.forEach(ind => params.append('industry', ind));
  }
  
  if (filters.remote) params.set('remote', 'true');
  
  if (filters.location) params.set('location', filters.location);
  
  if (filters.salaryMin) params.set('salaryMin', filters.salaryMin.toString());
  if (filters.salaryMax) params.set('salaryMax', filters.salaryMax.toString());
  
  if (filters.postedWithin) params.set('postedWithin', filters.postedWithin.toString());
  
  if (filters.skills?.length) {
    filters.skills.forEach(skill => params.append('skills', skill));
  }
  
  return params;
}

/**
 * Parse URL search parameters into filter state
 */
export function parseSearchParams(searchParams: URLSearchParams): {
  query: string;
  searchType: string;
  filters: SearchFilters;
} {
  // Parse array parameters
  const parseArrayParam = (values: string[]): string[] | undefined => {
    return values.length > 0 ? values : undefined;
  };

  // Parse numeric parameters
  const parseNumParam = (value: string | null): number | undefined => {
    if (!value) return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  };

  // Parse posted within parameter (handles formats like "7d")
  const parsePostedWithinParam = (value: string | null): number | undefined => {
    if (!value) return undefined;
    
    if (value.endsWith('d')) {
      const days = parseInt(value.slice(0, -1), 10);
      return isNaN(days) ? undefined : days;
    }
    
    return parseNumParam(value);
  };

  return {
    query: searchParams.get('q') || '',
    searchType: searchParams.get('type') || 'keyword',
    filters: {
      jobType: parseArrayParam(searchParams.getAll('jobType')),
      experienceLevel: parseArrayParam(searchParams.getAll('experienceLevel')),
      industry: parseArrayParam(searchParams.getAll('industry')),
      remote: searchParams.get('remote') === 'true',
      location: searchParams.get('location') || '',
      salaryMin: parseNumParam(searchParams.get('salaryMin')),
      salaryMax: parseNumParam(searchParams.get('salaryMax')),
      postedWithin: parsePostedWithinParam(searchParams.get('postedWithin')),
      skills: parseArrayParam(searchParams.getAll('skills'))
    }
  };
}
