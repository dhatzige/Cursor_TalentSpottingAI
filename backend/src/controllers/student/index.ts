/**
 * Student Controller - Modular Implementation
 * 
 * This file exports the complete student controller API from individual modules:
 * - jobs: Job discovery and recommendations
 * - applications: Application management and submission
 * - dashboard: Student dashboard statistics
 * 
 * Each module follows the project's strict modularity principles:
 * - Each file is under 300-400 lines
 * - Single responsibility per module
 * - No duplication of functionality
 */

// Import from individual controller modules
import { getRecommendedJobs } from './jobs-controller';
import { 
  getApplicationStatus,
  applyForJob,
  getApplicationDetails
} from './applications-controller';
import { getStudentStats } from './dashboard-controller';

// Re-export all controllers
export {
  // Jobs functionality
  getRecommendedJobs,
  
  // Application functionality
  getApplicationStatus,
  applyForJob,
  getApplicationDetails,
  
  // Dashboard functionality
  getStudentStats
};
