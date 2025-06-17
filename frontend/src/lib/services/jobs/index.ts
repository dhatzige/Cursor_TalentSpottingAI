/**
 * Jobs Service
 * 
 * Main entry point for job-related functionality
 * Exports all job service modules
 */

// Re-export from search module
export { 
  searchJobs, 
  filterJobsBySearchTerms,
  getJobById
} from './search';

// Re-export from filters module
export { 
  filterJobsByFilters,
  getFilterOptions
} from './filters';

// Re-export from search-parser module
export { 
  parseSearchQuery,
  matchesRelatedTerm,
  relatedTerms
} from './search-parser';

// Re-export from saved-searches module
export {
  getSavedSearches,
  saveSearch,
  deleteSavedSearch,
  updateSavedSearchUsage,
  getSavedSearchById
} from './saved-searches';

// Export mock data for development
export { mockJobs } from './mock-data';
