/**
 * Talent Search Controller - Compatibility Layer
 * 
 * This file re-exports all controller functions from the modular implementation.
 * New code should import directly from the talent-search subdirectory modules.
 * 
 * This approach maintains backward compatibility while adhering to
 * the project's strict modularity principles.
 */

// Import all controllers from modular implementation
import {
  searchTalent,
  getSearchFilters,
  viewCandidateProfile
} from './talent-search';

// Re-export everything for backward compatibility
export {
  searchTalent,
  getSearchFilters,
  viewCandidateProfile
};
