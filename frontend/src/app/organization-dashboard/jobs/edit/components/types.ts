// Define job-related types for reuse across components

// Job status options (for type safety and reusability)
export type JobStatus = 'open' | 'closed' | 'draft';

// Base job data interface with common fields
export interface JobDataBase {
  title: string;
  description: string;
  location: string;
  skills: string[];
}

// Interface for form data (with skillsInput as string for form handling)
export interface JobFormData extends Omit<JobDataBase, 'skills'> {
  skillsInput: string;
  status: JobStatus;
}

// Interface for API request payloads
export interface JobPostRequest extends JobDataBase {}

// Interface for complete job data (from API responses)
export interface JobData extends JobDataBase {
  id: string;
  status: JobStatus;
  createdAt?: string;
  updatedAt?: string;
}

// Interface for job status update requests
export interface JobStatusUpdateRequest {
  status: JobStatus;
}
