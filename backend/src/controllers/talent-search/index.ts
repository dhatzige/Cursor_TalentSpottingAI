/**
 * Talent Search Controller - Modular Implementation
 * 
 * This file exports the complete talent search controller API from individual modules:
 * - search: Main search functionality for finding candidates
 * - filters: Filter management for search parameters
 * - profile: Candidate profile viewing
 * 
 * Each module follows the project's strict modularity principles:
 * - Each file is under 300-400 lines
 * - Single responsibility per module
 * - No duplication of functionality
 */

// Import from individual controller modules
import { searchTalent } from './search-controller';
import { getSearchFilters } from './filters-controller';
import { viewCandidateProfile } from './profile-controller';

// Re-export all controllers
export {
  // Search functionality
  searchTalent,
  
  // Filter functionality
  getSearchFilters,
  
  // Profile functionality
  viewCandidateProfile
};
