/**
 * Search parameter utilities
 * 
 * Handles conversion between URL search parameters and our application's filter state
 */
import { SearchFilters, ParsedSearchParams } from '@/types/jobs';

/**
 * Parse URL search parameters into a structured filter object
 */
export function parseSearchParams(searchParams: URLSearchParams): ParsedSearchParams {
  return {
    query: searchParams.get('q') || '',
    searchType: (searchParams.get('type') || 'keyword') as 'keyword' | 'ai-free' | 'ai-premium',
    filters: {
      jobType: parseArrayParam(searchParams.getAll('jobType')),
      experienceLevel: parseArrayParam(searchParams.getAll('experienceLevel')),
      industry: parseArrayParam(searchParams.getAll('industry')),
      remote: searchParams.get('remote') === 'true',
      location: searchParams.get('location') || '',
      salaryMin: parseSalaryParam(searchParams.get('salaryMin')),
      salaryMax: parseSalaryParam(searchParams.get('salaryMax')),
      postedWithin: parsePostedWithinParam(searchParams.get('postedWithin')),
      skills: parseArrayParam(searchParams.getAll('skills')),
    }
  };
}

/**
 * Convert filters object to URLSearchParams
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
 * Generate a URL string from search parameters
 */
export function generateSearchUrl(
  query: string, 
  searchType: string,
  filters: SearchFilters
): string {
  const params = filtersToSearchParams(query, searchType, filters);
  return `/jobs/search?${params.toString()}`;
}

// Utility functions for parsing different parameter types

function parseArrayParam(values: string[]): string[] | undefined {
  return values.length > 0 ? values : undefined;
}

function parseSalaryParam(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}

function parsePostedWithinParam(value: string | null): number | undefined {
  if (!value) return undefined;
  
  // Handle special cases like "7d" (7 days), "30d" (30 days), etc.
  if (value.endsWith('d')) {
    const days = parseInt(value.slice(0, -1), 10);
    return isNaN(days) ? undefined : days;
  }
  
  // Handle direct number input
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}
