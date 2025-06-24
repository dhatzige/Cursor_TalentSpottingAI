/**
 * Employer Controller - Compatibility Layer
 * 
 * This file re-exports all controller functions from the modular implementation.
 * New code should import directly from the employer subdirectory modules.
 * 
 * This approach maintains backward compatibility while adhering to
 * the project's strict modularity principles.
 */

import { Request, Response } from 'express';

// Import all employer controller functions from the modular implementation
import {
  // Organization functions
  getOrganizationStats,
  
  // Jobs functions
  getActiveJobs,
  getAllJobs,
  getJobById,
  createJob,
  
  // Applications functions (Fixed names)
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationStats,
  
  // Candidates functions
  getTopCandidates
} from './employer';

// Re-export all functions for backwards compatibility
export {
  getOrganizationStats,
  getActiveJobs,
  getAllJobs,
  getJobById,
  createJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationStats,
  getTopCandidates
};
