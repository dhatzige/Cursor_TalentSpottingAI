/**
 * Student Controller - Compatibility Layer
 * 
 * This file re-exports all controller functions from the modular implementation.
 * New code should import directly from the student subdirectory modules.
 * 
 * This approach maintains backward compatibility while adhering to
 * the project's strict modularity principles.
 */

// Import all controllers from modular implementation
import {
  getRecommendedJobs,
  getApplicationStatus,
  applyForJob,
  getApplicationDetails,
  getStudentStats
} from './student';

// Re-export everything for backward compatibility
export {
  getRecommendedJobs,
  getApplicationStatus,
  applyForJob,
  getApplicationDetails,
  getStudentStats
};
