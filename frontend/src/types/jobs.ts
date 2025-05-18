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
 * Job search query interface
 */
export interface JobSearchQuery {
  searchTerms: string;
  filters?: SearchFilters;
}

/**
 * Search parameter utils
 */
export interface ParsedSearchParams {
  query: string;
  searchType: 'keyword' | 'ai-free' | 'ai-premium';
  filters: SearchFilters;
}
