/**
 * Jobs Filters Module
 * 
 * Handles filtering job listings based on multiple criteria
 */
import { JobListing, SearchFilters } from '@/types/jobs';
import { mockJobs } from './mock-data';

/**
 * Apply filters to job listings
 */
export function filterJobsByFilters(jobs: JobListing[], filters: SearchFilters): JobListing[] {
  return jobs.filter(job => {
    // Job Type filter
    if (filters.jobType && filters.jobType.length > 0 && 
        !filters.jobType.includes(job.jobType)) {
      return false;
    }
    
    // Experience Level filter
    if (filters.experienceLevel && filters.experienceLevel.length > 0 && 
        !filters.experienceLevel.includes(job.experienceLevel)) {
      return false;
    }
    
    // Industry filter
    if (filters.industry && filters.industry.length > 0 && 
        !filters.industry.some(industry => 
          job.industry?.toLowerCase().includes(industry.toLowerCase()))) {
      return false;
    }
    
    // Remote filter
    if (filters.remote === true && !job.remote) {
      return false;
    }
    
    // Location filter
    if (filters.location && filters.location.trim() !== '') {
      const locationLower = job.location.toLowerCase();
      const filterLocationLower = filters.location.toLowerCase();
      if (!locationLower.includes(filterLocationLower)) {
        return false;
      }
    }
    
    // Salary Range filter
    if (filters.salaryMin && job.salaryMax && job.salaryMax < filters.salaryMin) {
      return false;
    }
    if (filters.salaryMax && job.salaryMin && job.salaryMin > filters.salaryMax) {
      return false;
    }
    
    // Posted Within filter
    if (filters.postedWithin) {
      const jobDate = new Date(job.posted);
      const currentDate = new Date();
      const diffTime = currentDate.getTime() - jobDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > filters.postedWithin) {
        return false;
      }
    }
    
    // Skills filter
    if (filters.skills && filters.skills.length > 0) {
      const jobSkills = job.skills?.map(skill => skill.toLowerCase()) || [];
      const requiredSkills = filters.skills.map(skill => skill.toLowerCase());
      
      // Check if job has all required skills
      if (!requiredSkills.every(skill => jobSkills.includes(skill))) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Get available filter options from current job data
 */
export async function getFilterOptions(): Promise<{
  jobTypes: string[];
  experienceLevels: string[];
  industries: string[];
  skills: string[];
}> {
  // In a real app, this would be an API call to get filter options
  
  // Extract unique values for each filter category
  const jobTypes = [...new Set(mockJobs.map(job => job.jobType))];
  const experienceLevels = [...new Set(mockJobs.map(job => job.experienceLevel))];
  const industries = [...new Set(mockJobs.map(job => job.industry))].filter(Boolean) as string[];
  
  // Collect all skills across jobs and remove duplicates
  const allSkills = mockJobs.reduce<string[]>((skills, job) => {
    return [...skills, ...(job.skills || [])];
  }, []);
  const skills = [...new Set(allSkills)];
  
  return {
    jobTypes,
    experienceLevels,
    industries,
    skills
  };
}
