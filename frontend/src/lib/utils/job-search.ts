/**
 * Job Search Utilities
 * 
 * Advanced search functionality for job listings including 
 * keyword parsing and filter application
 * 
 * This file serves as a compatibility layer for the modular implementation
 */
import { matchesRelatedTerm } from './job-synonyms';
import {
  filterJobsBySearchTerms as filterBySearchTermsModular,
  filterJobsByFilters as filterByFiltersModular,
  parseSearchQuery as parseSearchQueryModular,
  filtersToSearchParams as filtersToSearchParamsModular,
  parseSearchParams as parseSearchParamsModular
} from './job-search/index';

// Re-export types for backward compatibility
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

// Re-export type for backward compatibility
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

// Re-export type for backward compatibility
type ParsedSearchQuery = {
  regularTerms: string[];
  requiredTerms: string[];
  excludedTerms: string[];
  orTerms: string[];
};

/**
 * Parse search query for special operators
 * This is a compatibility function that delegates to the modular implementation
 */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  // Delegate to the modular implementation
  return parseSearchQueryModular(query);
}

// We don't need a local matchesRelatedTerm function since we import it from job-synonyms.ts

/**
 * Apply advanced search filtering to job listings
 * Supports quoted phrases, +required terms, -excluded terms, and OR alternatives
 * Also includes matching of related job roles and synonyms
 * This is a compatibility function that delegates to the modular implementation
 */
export function filterJobsBySearchTerms(jobs: Job[], searchTerms: string): Job[] {
  // Delegate to the modular implementation
  return filterBySearchTermsModular(jobs, searchTerms);
}

/**
 * Apply all filters to job listings
 * This is a compatibility function that delegates to the modular implementation
 */
export function filterJobsByFilters(jobs: Job[], filters: SearchFilters): Job[] {
  // Delegate to the modular implementation
  return filterByFiltersModular(jobs, filters);
}

/**
 * Generate URL search params from filter state
 * This is a compatibility function that delegates to the modular implementation
 */
export function filtersToSearchParams(
  query: string,
  searchType: string,
  filters: SearchFilters
): URLSearchParams {
  // Delegate to the modular implementation
  return filtersToSearchParamsModular(query, searchType, filters);
}

/**
 * Parse URL search parameters into filter state
 * This is a compatibility function that delegates to the modular implementation
 */
export function parseSearchParams(searchParams: URLSearchParams): {
  query: string;
  searchType: string;
  filters: SearchFilters;
} {
  // Delegate to the modular implementation
  return parseSearchParamsModular(searchParams);
}
