/**
 * EmployerService API - Modular implementation
 * 
 * This file exports the complete employer API surface from individual service modules:
 * - JobsService: Job posting management
 * - ApplicationsService: Application handling and review
 * - TalentSearchService: Candidate search and filtering
 * - DashboardService: Employer dashboard statistics
 * 
 * Each module follows the project's strict modularity principles:
 * - Each file is under 300-400 lines
 * - Single responsibility per module
 * - No duplication of functionality
 */

// Re-export types
export * from './types';

// Import individual services
import { JobsService } from './jobs-service';
import { ApplicationsService } from './applications-service';
import { TalentSearchService } from './talent-search-service';
import { DashboardService } from './dashboard-service';

// Combined employer service
export const EmployerService = {
  // Jobs
  getActiveJobs: JobsService.getActiveJobs,
  getAllJobs: JobsService.getAllJobs,
  getJobById: JobsService.getJobById,
  createJob: JobsService.createJob,
  updateJob: JobsService.updateJob,
  updateJobStatus: JobsService.updateJobStatus,
  deleteJob: JobsService.deleteJob,
  
  // Applications
  getJobApplications: ApplicationsService.getJobApplications,
  getApplicationById: ApplicationsService.getApplicationById,
  getApplicationsByIds: ApplicationsService.getApplicationsByIds,
  updateApplicationStatus: ApplicationsService.updateApplicationStatus,
  addApplicationNote: ApplicationsService.addApplicationNote,
  
  // Talent Search
  searchTalent: TalentSearchService.searchTalent,
  getSearchFilters: TalentSearchService.getSearchFilters,
  viewCandidateProfile: TalentSearchService.viewCandidateProfile,
  
  // Dashboard
  getOrganizationStats: DashboardService.getOrganizationStats,
  getTopCandidates: DashboardService.getTopCandidates
};

// Default export
export default EmployerService;
