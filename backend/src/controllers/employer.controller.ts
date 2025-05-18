/**
 * Employer Controller - Compatibility Layer
 * 
 * This file re-exports all controller functions from the modular implementation.
 * New code should import directly from the employer subdirectory modules.
 * 
 * This approach maintains backward compatibility while adhering to
 * the project's strict modularity principles.
 */

// Import all controllers from modular implementation
import {
  getOrganizationStats,
  getActiveJobs,
  getAllJobs, 
  getJobById,
  createJob,
  getJobApplications,
  getApplicationDetails,
  updateApplicationStatus,
  addApplicationNote,
  getTopCandidates,
  // Types
  Skill,
  StudentProfile,
  Job
} from './employer';

// Re-export everything for backward compatibility
export {
  getOrganizationStats,
  getActiveJobs,
  getAllJobs,
  getJobById,
  createJob,
  getJobApplications,
  getApplicationDetails,
  updateApplicationStatus,
  addApplicationNote,
  getTopCandidates,
  Skill,
  StudentProfile,
  Job
};

// For compatibility with existing code
export const calculateMatchScore = (studentProfile: StudentProfile | null | undefined, job: Job | null | undefined): number => {
  // Import and use the function from the modular implementation
  const { calculateMatchScore } = require('./employer/utils');
  return calculateMatchScore(studentProfile, job);
};
