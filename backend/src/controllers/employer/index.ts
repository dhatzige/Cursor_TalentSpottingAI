/**
 * Employer Controller - Modular Implementation
 * 
 * This file exports the complete employer controller API from individual modules:
 * - organization: Organization dashboard statistics
 * - jobs: Job management (create, update, list)
 * - applications: Application handling and review
 * - candidates: Candidate discovery and matching
 * 
 * Each module follows the project's strict modularity principles:
 * - Each file is under 300-400 lines
 * - Single responsibility per module
 * - No duplication of functionality
 */

// Import from individual controller modules
import { getOrganizationStats } from './organization-controller';
import { getActiveJobs, getAllJobs, getJobById, createJob } from './jobs-controller';
import { 
  getJobApplications, 
  getApplicationDetails,
  updateApplicationStatus, 
  addApplicationNote
} from './applications-controller';
import { getTopCandidates } from './candidates-controller';

// Re-export all controllers
export {
  // Organization
  getOrganizationStats,
  
  // Jobs
  getActiveJobs,
  getAllJobs,
  getJobById,
  createJob,
  
  // Applications
  getJobApplications,
  getApplicationDetails,
  updateApplicationStatus,
  addApplicationNote,
  
  // Candidates
  getTopCandidates
};

// Export types from utils
export * from './utils';
