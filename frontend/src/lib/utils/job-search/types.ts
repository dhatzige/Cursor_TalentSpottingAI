/**
 * Job Search Types
 * 
 * Type definitions for job search functionality
 */

/**
 * Job interface used in the job search utility
 */
export type Job = {
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

/**
 * Search filters interface
 */
export type SearchFilters = {
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

/**
 * Search query parsing result
 */
export type ParsedSearchQuery = {
  regularTerms: string[];
  requiredTerms: string[];
  excludedTerms: string[];
  orTerms: string[];
};

/**
 * Result of parsing URL search parameters
 */
export type ParsedSearchParams = {
  query: string;
  searchType: string;
  filters: SearchFilters;
};
