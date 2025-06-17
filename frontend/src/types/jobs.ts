/**
 * Job-related type definitions
 */

/**
 * Job type options
 */
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

/**
 * Experience level options
 */
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';

/**
 * Job listing interface
 */
export interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  salaryMin?: number; // Numeric value for filtering
  salaryMax?: number; // Numeric value for filtering
  remote: boolean;
  posted: string; // ISO date string 
  postedRelative: string; // Human-readable relative time
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  industry?: string;
  skills?: string[];
  benefits?: string[];
}

/**
 * Search filters interface
 */
export interface SearchFilters {
  jobType?: JobType[];
  experienceLevel?: ExperienceLevel[];
  industry?: string[];
  remote?: boolean;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  postedWithin?: number; // In days
  skills?: string[];
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Pagination information
 */
export interface PaginationInfo extends PaginationParams {
  totalResults: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated job results
 */
export interface PaginatedJobResults {
  results: JobListing[];
  pagination: PaginationInfo;
}

/**
 * Job search query interface including pagination
 */
export interface JobSearchQuery {
  searchTerms: string;
  filters?: SearchFilters;
  page?: number;
  pageSize?: number;
}

/**
 * Search response with pagination
 */
export interface JobSearchResponse {
  results: JobListing[];
  pagination: PaginationInfo;
}

/**
 * Saved search interface
 */
export interface SavedSearch {
  id: string;
  name: string;
  query: JobSearchQuery;
  createdAt: string;
  lastUsed: string;
}

/**
 * Search parameter utils
 */
export interface ParsedSearchParams {
  query: string;
  searchType: 'keyword' | 'ai-free' | 'ai-premium';
  filters: SearchFilters;
}
