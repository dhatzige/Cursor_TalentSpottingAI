/**
 * Jobs Service
 * 
 * Handles job searching, filtering and data retrieval
 * This is a compatibility layer for the modular jobs service
 */
import { 
  JobType, 
  ExperienceLevel, 
  JobListing, 
  SearchFilters, 
  JobSearchQuery,
  SavedSearch,
  JobSearchResponse
} from '@/types/jobs';

// Import from modular implementation
import {
  searchJobs as searchJobsModular,
  getJobById as getJobByIdModular,
  getFilterOptions as getFilterOptionsModular,
  getSavedSearches,
  saveSearch,
  deleteSavedSearch,
  updateSavedSearchUsage,
  getSavedSearchById,
  mockJobs
} from './jobs';

// Re-export the mock job data for backward compatibility
export { mockJobs };

/**
 * Export new functions for pagination and saved searches
 */
export {
  getSavedSearches,
  saveSearch,
  deleteSavedSearch,
  updateSavedSearchUsage,
  getSavedSearchById
};

/**
 * Get paginated job search results
 * New function that supports pagination
 */
export async function getPaginatedJobResults(query: JobSearchQuery): Promise<JobSearchResponse> {
  return searchJobsModular(query);
}

// Mock job data reference from the imported module - keeping this for reference
/* const mockJobs: JobListing[] = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    description: 'We are looking for an experienced React developer to join our team to build innovative web applications. Strong TypeScript skills required.',
    salary: '$120,000 - $150,000',
    salaryMin: 120000,
    salaryMax: 150000,
    remote: true,
    posted: '2023-05-16T10:00:00Z',
    postedRelative: '2 days ago',
    jobType: 'full-time',
    experienceLevel: 'senior',
    industry: 'Software Development',
    skills: ['React', 'TypeScript', 'Node.js', 'Redux', 'GraphQL'],
    benefits: ['Health insurance', 'Flexible hours', 'Remote work options', '401k matching']
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'DesignHub',
    location: 'New York, NY',
    description: 'Join our creative team to design beautiful and intuitive user interfaces for our flagship product. Experience with Figma and Adobe XD required.',
    salary: '$90,000 - $120,000',
    salaryMin: 90000,
    salaryMax: 120000,
    remote: true,
    posted: '2023-05-11T14:30:00Z',
    postedRelative: '1 week ago',
    jobType: 'full-time',
    experienceLevel: 'mid',
    industry: 'Design',
    skills: ['Figma', 'Adobe XD', 'UI/UX', 'Prototyping', 'User Research'],
    benefits: ['Creative environment', 'Latest design tools', 'Professional development']
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'DataWorks',
    location: 'Seattle, WA',
    description: 'Looking for a data scientist with experience in machine learning and statistical analysis to join our research team.',
    salary: '$130,000 - $160,000',
    salaryMin: 130000,
    salaryMax: 160000,
    remote: false,
    posted: '2023-05-15T09:15:00Z',
    postedRelative: '3 days ago',
    jobType: 'full-time',
    experienceLevel: 'senior',
    industry: 'Data Science',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'PyTorch', 'Data Visualization'],
    benefits: ['Research budget', 'Conference allowance', 'Publication opportunities']
  },
  {
    id: 4,
    title: 'Frontend Developer',
    company: 'WebSolutions',
    location: 'Austin, TX',
    description: 'Develop and maintain web applications using modern JavaScript frameworks and libraries.',
    salary: '$80,000 - $110,000',
    salaryMin: 80000,
    salaryMax: 110000,
    remote: true,
    posted: '2023-05-13T11:45:00Z',
    postedRelative: '5 days ago',
    jobType: 'full-time',
    experienceLevel: 'mid',
    industry: 'Software Development',
    skills: ['JavaScript', 'React', 'Angular', 'CSS', 'HTML5'],
    benefits: ['Flexible schedule', 'Training budget', 'Modern office']
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Remote',
    description: 'Help us build and maintain our cloud infrastructure. Experience with AWS and Kubernetes required.',
    salary: '$110,000 - $140,000',
    salaryMin: 110000,
    salaryMax: 140000,
    remote: true,
    posted: '2023-05-17T08:20:00Z',
    postedRelative: '1 day ago',
    jobType: 'full-time',
    experienceLevel: 'senior',
    industry: 'Cloud Computing',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    benefits: ['Remote-first culture', 'Latest equipment', 'Learning stipend']
  },
  {
    id: 6,
    title: 'Marketing Intern',
    company: 'GrowthLabs',
    location: 'Chicago, IL',
    description: 'Join our marketing team to learn digital marketing strategies and help execute campaigns.',
    salary: '$20 - $25/hr',
    salaryMin: 41600,
    salaryMax: 52000,
    remote: false,
    posted: '2023-05-12T13:10:00Z',
    postedRelative: '6 days ago',
    jobType: 'internship',
    experienceLevel: 'entry',
    industry: 'Marketing',
    skills: ['Social Media', 'Content Creation', 'Analytics', 'SEO'],
    benefits: ['College credit', 'Mentorship', 'Flexible hours']
  },
  {
    id: 7,
    title: 'Product Manager',
    company: 'ProductLabs',
    location: 'Boston, MA',
    description: 'Lead our product development team in creating innovative solutions for our enterprise clients.',
    salary: '$100,000 - $130,000',
    salaryMin: 100000,
    salaryMax: 130000,
    remote: true,
    posted: '2023-05-16T15:45:00Z',
    postedRelative: '2 days ago',
    jobType: 'full-time',
    experienceLevel: 'senior',
    industry: 'Product Management',
    skills: ['Product Strategy', 'Agile', 'Roadmapping', 'User Research', 'Data Analysis'],
    benefits: ['Stock options', 'Leadership training', 'Health benefits']
  },
  {
    id: 8,
    title: 'Support Specialist',
    company: 'TechHelp',
    location: 'Remote',
    description: 'Provide technical support to our customers. Strong troubleshooting skills and excellent communication required.',
    salary: '$50,000 - $65,000',
    salaryMin: 50000,
    salaryMax: 65000,
    remote: true,
    posted: '2023-05-14T09:00:00Z',
    postedRelative: '4 days ago',
    jobType: 'part-time',
    experienceLevel: 'mid',
    industry: 'Customer Service',
    skills: ['Technical Support', 'Communication', 'Troubleshooting', 'CRM Software'],
    benefits: ['Flexible schedule', 'Remote work', 'Professional development']
  }
];

/**
 * Fetches job listings with optional search and filters
 * Backward compatibility function that wraps the modular implementation
 */
export async function searchJobs(query: JobSearchQuery): Promise<JobListing[]> {
  // Call the modular version which includes pagination
  const response = await searchJobsModular(query);
  
  // Return just the results array for backward compatibility
  return response.results;
}

// filterJobsBySearchTerms is now in the search.ts module

// matchesRelatedTerm is now in the search-parser.ts module

// parseSearchQuery is now in the search-parser.ts module

// filterJobsByFilters is now in the filters.ts module

/**
 * Get a job by ID
 * Backward compatibility function that wraps the modular implementation
 */
export async function getJobById(id: number): Promise<JobListing | null> {
  // Use the modular implementation
  return getJobByIdModular(id);
}

/**
 * Get available filter options from current job data
 * Backward compatibility function that wraps the modular implementation
 */
export async function getFilterOptions(): Promise<{
  jobTypes: string[];
  experienceLevels: string[];
  industries: string[];
  skills: string[];
}> {
  // Use the modular implementation
  return getFilterOptionsModular();
}
