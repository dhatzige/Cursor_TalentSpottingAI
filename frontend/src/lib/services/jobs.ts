8/**
 * Modular Jobs Service
 * 
 * This is a modular implementation of the jobs service
 * that supports job search, filtering, and pagination.
 * 
 * This implementation strictly adheres to TypeScript types
 * to avoid runtime errors and ensure type safety.
 */
import { 
  JobType, 
  ExperienceLevel, 
  JobListing, 
  SearchFilters, 
  JobSearchQuery,
  JobSearchResponse,
  PaginationInfo
} from '@/types/jobs';

// Define internal saved search interface with additional properties
interface SavedSearch {
  id: string;
  name: string;
  query: JobSearchQuery;
  createdAt: string;
  lastUsed: string;
  useCount?: number;
}

// Export the SavedSearch type
export type { SavedSearch };

// Import mock data
import { mockJobs as importedMockJobs } from '@/lib/data/mockJobs';

// Define our internal JobTypeEnum for use in the code
const JobTypeEnum: Record<string, JobType> = {
  FULLTIME: 'full-time',
  PARTTIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship'
};

// Define ExperienceLevelEnum for use in the code
const ExperienceLevelEnum: Record<string, ExperienceLevel> = {
  ENTRY: 'entry',
  MID: 'mid',
  SENIOR: 'senior',
  EXECUTIVE: 'executive'
};

// Ensure mock data follows JobListing type strictly
const mockJobs: JobListing[] = importedMockJobs.map(job => {
  // Clean job type
  let jobType: JobType = 'full-time'; // Default value
  if (job.jobType === 'full-time' || job.jobType === 'part-time' || 
      job.jobType === 'contract' || job.jobType === 'internship') {
    jobType = job.jobType;
  }
  
  // Clean experience level
  let experienceLevel: ExperienceLevel = 'entry'; // Default value
  if (job.experienceLevel === 'entry' || job.experienceLevel === 'mid' || 
      job.experienceLevel === 'senior' || job.experienceLevel === 'executive') {
    experienceLevel = job.experienceLevel;
  }
  
  return {
    id: job.id,
    title: job.title || 'Untitled Position',
    company: job.company || 'Unknown Company',
    location: job.location || 'Remote',
    description: job.description || 'No description provided',
    salary: job.salary || 'Competitive',
    remote: typeof job.remote === 'boolean' ? job.remote : false,
    posted: job.posted || new Date().toISOString(),
    postedRelative: job.postedRelative || 'Recently',
    jobType,
    experienceLevel,
    // Optional fields that are defined in the JobListing interface
    ...(job.industry ? { industry: job.industry } : {}),
    ...(Array.isArray(job.skills) ? { skills: job.skills.filter(Boolean) as string[] } : {}),
    ...(Array.isArray(job.benefits) ? { benefits: job.benefits.filter(Boolean) as string[] } : {}),
    // Add optional salary range fields for filtering
    // These are part of our JobListing interface but not in the source Job type
    salaryMin: job.salary ? parseInt(job.salary.replace(/[^0-9]/g, '')) || undefined : undefined,
    salaryMax: job.salary ? parseInt(job.salary.replace(/[^0-9]/g, '')) * 1.2 || undefined : undefined
  };
});

// Export the sanitized mock jobs
export { mockJobs };

/**
 * Search jobs with support for filtering and pagination
 */
export async function searchJobs(query: JobSearchQuery): Promise<JobSearchResponse> {
  // Start with all jobs
  let filteredJobs = [...mockJobs];
  
  // Apply search terms if provided
  if (query.searchTerms && query.searchTerms.trim() !== '') {
    const terms = query.searchTerms.toLowerCase().trim().split(/\s+/);
    filteredJobs = filteredJobs.filter(job => {
      const searchableText = `${job.title} ${job.company} ${job.location} ${job.description}`.toLowerCase();
      // Job matches if it contains any of the search terms
      return terms.some(term => searchableText.includes(term));
    });
  }
  
  // Apply filters if provided
  if (query.filters) {
    // Filter by job type
    if (query.filters.jobType && query.filters.jobType.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        query.filters?.jobType?.includes(job.jobType!)
      );
    }
    
    // Filter by experience level
    if (query.filters.experienceLevel && query.filters.experienceLevel.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        query.filters?.experienceLevel?.includes(job.experienceLevel!)
      );
    }
    
    // Filter by industry
    if (query.filters.industry && query.filters.industry.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        job.industry && query.filters?.industry?.includes(job.industry!)
      );
    }
    
    // Filter by skills
    if (query.filters.skills && query.filters.skills.length > 0) {
      filteredJobs = filteredJobs.filter(job =>
        job.skills && query.filters?.skills?.some(skill => job.skills!.includes(skill))
      );
    }
  }
  
  // Calculate pagination info
  const totalResults = filteredJobs.length;
  const pageSize = query.pageSize || 10;
  const page = query.page || 1;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  
  // Ensure page is within valid range
  const validPage = Math.min(Math.max(1, page), totalPages);
  
  // Get paginated results
  const startIndex = (validPage - 1) * pageSize;
  const paginatedResults = filteredJobs.slice(startIndex, startIndex + pageSize);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create pagination metadata
  const pagination: PaginationInfo = {
    page: validPage,
    pageSize,
    totalResults,
    totalPages,
    hasNextPage: validPage < totalPages,
    hasPreviousPage: validPage > 1
  };
  
  // Return the formatted response
  return {
    results: paginatedResults,
    pagination
  };
}

/**
 * Get a job by ID
 */
export async function getJobById(id: number): Promise<JobListing | null> {
  const job = mockJobs.find(job => job.id === id);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return job || null;
}

/**
 * Get available filter options from current job data
 */
export async function getFilterOptions(): Promise<{
  jobTypes: string[];
  experienceLevels: string[];
  industries: string[];
  skills: string[];
}> {
  // Extract unique values - our mockJobs array is already properly typed and sanitized
  const jobTypes = [...new Set(mockJobs.map(job => job.jobType))];
  const experienceLevels = [...new Set(mockJobs.map(job => job.experienceLevel))];
  
  // Handle optional fields safely
  const industries: string[] = [];
  const allSkills: string[] = [];
  
  mockJobs.forEach(job => {
    // Collect unique industries
    if (job.industry) {
      industries.push(job.industry);
    }
    
    // Collect unique skills
    if (job.skills && Array.isArray(job.skills)) {
      job.skills.forEach(skill => allSkills.push(skill));
    }
  });
  
  // Make sure we have unique values
  const uniqueIndustries = [...new Set(industries)];
  const uniqueSkills = [...new Set(allSkills)];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    jobTypes,
    experienceLevels,
    industries: uniqueIndustries,
    skills: uniqueSkills
  };
}

// Saved searches storage (in-memory for mock purposes)
let savedSearches: SavedSearch[] = [
  {
    id: '1',
    name: 'Software Engineer Jobs',
    query: {
      searchTerms: 'software engineer',
      filters: {
        jobType: ['full-time']
      }
    },
    createdAt: '2023-08-15T10:30:00Z',
    lastUsed: '2023-08-20T14:45:00Z',
    useCount: 5
  },
  {
    id: '2',
    name: 'Remote Design Jobs',
    query: {
      searchTerms: 'design',
      filters: {
        jobType: ['contract']
      }
    },
    createdAt: '2023-08-10T09:15:00Z',
    lastUsed: '2023-08-19T16:20:00Z',
    useCount: 3
  }
];

/**
 * Get all saved searches
 */
export async function getSavedSearches(): Promise<SavedSearch[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [...savedSearches];
}

/**
 * Get a saved search by ID
 */
export async function getSavedSearchById(id: string): Promise<SavedSearch | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return savedSearches.find(search => search.id === id) || null;
}

/**
 * Save a new search
 */
export async function saveSearch(name: string, query: JobSearchQuery): Promise<SavedSearch> {
  // Create new saved search
  const newSearch: SavedSearch = {
    id: Date.now().toString(), // Use timestamp as ID
    name,
    query,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
    useCount: 1
  };
  
  // Add to saved searches
  savedSearches.push(newSearch);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return newSearch;
}

/**
 * Update saved search usage count and last used date
 */
export async function updateSavedSearchUsage(id: string): Promise<SavedSearch | null> {
  const index = savedSearches.findIndex(search => search.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Update the search
  savedSearches[index] = {
    ...savedSearches[index],
    lastUsed: new Date().toISOString(),
    useCount: (savedSearches[index].useCount || 0) + 1
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return savedSearches[index];
}

/**
 * Delete a saved search
 */
export async function deleteSavedSearch(id: string): Promise<boolean> {
  const initialLength = savedSearches.length;
  savedSearches = savedSearches.filter(search => search.id !== id);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return savedSearches.length < initialLength;
}
