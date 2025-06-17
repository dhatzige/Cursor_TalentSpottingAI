/**
 * URL Parameters Module
 * 
 * Handles converting between search filters and URL parameters
 */
import { SearchFilters, ParsedSearchParams } from './types';

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
export function parseSearchParams(searchParams: URLSearchParams): ParsedSearchParams {
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
