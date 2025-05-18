/**
 * Jobs Service
 * 
 * Handles job searching, filtering and data retrieval
 */
import { JobType, ExperienceLevel, JobListing, SearchFilters, JobSearchQuery } from '@/types/jobs';

// Mock job data - would be replaced with actual API calls in production
const mockJobs: JobListing[] = [
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
 */
export async function searchJobs(query: JobSearchQuery): Promise<JobListing[]> {
  // In a real app, this would be an API call
  console.log('Searching with query:', query);
  
  let filteredJobs = [...mockJobs];
  const { searchTerms, filters } = query;

  // Apply search term filtering if provided
  if (searchTerms && searchTerms.trim() !== '') {
    filteredJobs = filterJobsBySearchTerms(filteredJobs, searchTerms);
  }
  
  // Apply filters if provided
  if (filters) {
    filteredJobs = filterJobsByFilters(filteredJobs, filters);
  }
  
  return filteredJobs;
}

/**
 * Filter jobs by search terms using advanced search logic
 */
function filterJobsBySearchTerms(jobs: JobListing[], searchTerms: string): JobListing[] {
  // Parse the search query for special operators
  const {
    regularTerms,
    requiredTerms,
    excludedTerms,
    orTerms
  } = parseSearchQuery(searchTerms);
  
  return jobs.filter(job => {
    // Create a single string to search within for this job
    const jobText = [
      job.title,
      job.company,
      job.location,
      job.description,
      job.jobType,
      job.experienceLevel,
      job.industry,
      ...(job.skills || []),
      ...(job.benefits || [])
    ].join(' ').toLowerCase();
    
    // Check excluded terms first - if any match, exclude this job
    if (excludedTerms.some(term => jobText.includes(term.toLowerCase()))) {
      return false;
    }
    
    // Check required terms - all must match
    if (!requiredTerms.every(term => jobText.includes(term.toLowerCase()))) {
      return false;
    }
    
    // Handle OR terms if present
    if (orTerms.length > 0) {
      return orTerms.some(term => jobText.includes(term.toLowerCase()));
    }
    
    // For regular terms, all must match if no OR terms
    if (regularTerms.length > 0) {
      return regularTerms.every(term => {
        // Skip very short terms
        if (term.length <= 2) return true;
        
        // Check for term match or related terms
        return jobText.includes(term.toLowerCase()) || 
               matchesRelatedTerm(jobText, term.toLowerCase());
      });
    }
    
    return true;
  });
}

/**
 * Checks if the job text contains any related terms
 */
function matchesRelatedTerm(jobText: string, term: string): boolean {
  // Define related terms/synonyms
  const relatedTerms: Record<string, string[]> = {
    'developer': ['development', 'programming', 'coding', 'engineer', 'engineering'],
    'engineer': ['engineering', 'development', 'technical', 'developer'],
    'manager': ['management', 'director', 'lead', 'leadership'],
    'design': ['designer', 'creative', 'ui', 'ux'],
    'remote': ['work from home', 'wfh', 'telecommute', 'virtual'],
    'intern': ['internship', 'student', 'entry-level', 'junior'],
    'marketing': ['growth', 'digital marketing', 'brand', 'social media'],
    'full-time': ['permanent', 'regular'],
    'part-time': ['flexible', 'hourly'],
    'junior': ['entry-level', 'associate', 'beginner'],
    'senior': ['lead', 'principal', 'staff', 'experienced']
  };
  
  // Check if there are related terms for this term
  const synonyms = relatedTerms[term];
  if (!synonyms) return false;
  
  // Check if any synonym is in the job text
  return synonyms.some(synonym => jobText.includes(synonym));
}

/**
 * Parse search query for special operators
 */
function parseSearchQuery(query: string) {
  const regularTerms: string[] = [];
  const requiredTerms: string[] = [];
  const excludedTerms: string[] = [];
  const orTerms: string[] = [];
  
  // Handle quoted phrases
  const quotedPhrasesRegex = /"([^"]+)"/g;
  const quotedPhrases = [...query.matchAll(quotedPhrasesRegex)].map(match => match[1]);
  
  // Remove quoted phrases from query for further processing
  let remainingQuery = query;
  quotedPhrases.forEach(phrase => {
    remainingQuery = remainingQuery.replace(`"${phrase}"`, '');
    regularTerms.push(phrase);
  });
  
  // Split remaining terms by spaces
  const terms = remainingQuery.trim().split(/\s+/).filter(term => term);
  
  // Process each term for special operators
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    
    // Skip empty terms
    if (!term) continue;
    
    // Check for "OR" operator
    if (term.toLowerCase() === 'or' && i > 0 && i < terms.length - 1) {
      // Add the term before OR and after OR to orTerms
      orTerms.push(terms[i-1]);
      orTerms.push(terms[i+1]);
      // Remove the already processed term before OR from regularTerms
      const termBeforeIndex = regularTerms.indexOf(terms[i-1]);
      if (termBeforeIndex !== -1) {
        regularTerms.splice(termBeforeIndex, 1);
      }
      // Skip the next term as we've already processed it
      i++;
    }
    // Required term
    else if (term.startsWith('+')) {
      requiredTerms.push(term.substring(1));
    }
    // Excluded term
    else if (term.startsWith('-')) {
      excludedTerms.push(term.substring(1));
    }
    // Regular term
    else {
      regularTerms.push(term);
    }
  }
  
  return { regularTerms, requiredTerms, excludedTerms, orTerms };
}

/**
 * Apply filters to job listings
 */
function filterJobsByFilters(jobs: JobListing[], filters: SearchFilters): JobListing[] {
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
 * Get a job by ID
 */
export async function getJobById(id: number): Promise<JobListing | null> {
  // In a real app, this would be an API call
  const job = mockJobs.find(job => job.id === id);
  return job || null;
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
  // In a real app, this might come from a separate API endpoint
  
  const jobTypes = [...new Set(mockJobs.map(job => job.jobType))];
  const experienceLevels = [...new Set(mockJobs.map(job => job.experienceLevel))];
  const industries = [...new Set(mockJobs.map(job => job.industry || '').filter(Boolean))];
  
  // Extract unique skills across all jobs
  const skillsSet = new Set<string>();
  mockJobs.forEach(job => {
    job.skills?.forEach(skill => skillsSet.add(skill));
  });
  
  return {
    jobTypes,
    experienceLevels,
    industries,
    skills: Array.from(skillsSet)
  };
}
