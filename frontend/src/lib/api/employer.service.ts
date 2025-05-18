/**
 * Employer Service - Main Entry Point
 * 
 * This file is a compatibility layer that re-exports all functionality
 * from the modular employer service implementation.
 * 
 * For new code, import directly from:
 * import { EmployerService } from './employer';
 * 
 * This approach maintains backward compatibility while allowing
 * the codebase to follow the strict modularity principles.
 */

import { EmployerService as ModularEmployerService } from './employer';

export const EmployerService = ModularEmployerService;
export default EmployerService;

// Re-export types for backward compatibility
export * from './employer/types';
