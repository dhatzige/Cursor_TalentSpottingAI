import api from './axios';

interface OrganizationStats {
  activeJobs: number;
  totalApplicants: number;
  positionsFilled: number;
  trends: {
    applicantChange: number;
  };
}

interface StatsResponse {
  stats: OrganizationStats;
}

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  postDate: string;
  status: string;
  applicantCount: number;
  skills?: string[];
}

interface JobsResponse {
  jobs: JobItem[];
}

interface JobResponse {
  job: JobItem;
}

interface JobPostData {
  title: string;
  description: string;
  location: string;
  skills?: string[];
}

interface CandidateItem {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
  applicationId: string; // Add application ID for linking to applications
}

interface CandidatesResponse {
  candidates: CandidateItem[];
}

interface ApplicationResponse {
  applications: {
    id: string;
    studentName: string;
    status: string;
    appliedDate: string;
    resumeUrl?: string;
  }[];
}

// Mock data for development
const MOCK_DATA = {
  stats: {
    activeJobs: 5,
    totalApplicants: 28,
    positionsFilled: 3,
    trends: {
      applicantChange: 15
    }
  },
  jobs: [
    {
      id: 'job1',
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      description: 'We are looking for a skilled Frontend Developer to join our team...',
      postDate: '2025-05-10T10:00:00Z',
      status: 'open',
      applicantCount: 12,
      skills: ['JavaScript', 'React', 'TypeScript', 'HTML/CSS']
    },
    {
      id: 'job2',
      title: 'UX Designer',
      company: 'TechCorp Inc.',
      location: 'Remote',
      description: 'Join our design team to create exceptional user experiences...',
      postDate: '2025-05-08T14:20:00Z',
      status: 'open',
      applicantCount: 8,
      skills: ['Figma', 'UI Design', 'Wireframing', 'User Research']
    },
    {
      id: 'job3',
      title: 'Full Stack Engineer',
      company: 'TechCorp Inc.',
      location: 'New York, NY',
      description: 'Looking for a versatile engineer who can work across the stack...',
      postDate: '2025-05-05T09:15:00Z',
      status: 'closed',
      applicantCount: 22,
      skills: ['JavaScript', 'Node.js', 'React', 'MongoDB']
    }
  ],
  candidates: [
    {
      id: 'candidate1',
      name: 'Alex Johnson',
      role: 'Frontend Developer',
      matchScore: 85,
      university: 'Stanford University',
      skills: ['JavaScript', 'React', 'CSS', 'TypeScript'],
      applicationId: 'app1'
    },
    {
      id: 'candidate2',
      name: 'Jamie Smith',
      role: 'UX/UI Designer',
      matchScore: 78,
      university: 'MIT',
      skills: ['Figma', 'UI Design', 'User Research'],
      applicationId: 'app2'
    },
    {
      id: 'candidate3',
      name: 'Taylor Williams',
      role: 'Full Stack Developer',
      matchScore: 92,
      university: 'UC Berkeley',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      applicationId: 'app3'
    },
    {
      id: 'candidate4',
      name: 'Jordan Miller',
      role: 'Frontend Developer',
      matchScore: 65,
      university: 'UCLA',
      skills: ['HTML/CSS', 'JavaScript', 'Vue.js'],
      applicationId: 'app4'
    }
  ],
  applications: [
    {
      id: 'app1',
      jobId: 'job1',
      studentId: 'student1',
      studentName: 'Alex Johnson',
      status: 'pending',
      createdAt: '2025-05-15T14:30:00Z',
      updatedAt: '2025-05-15T14:30:00Z',
      resumeUrl: '/resume/alex-johnson.pdf',
      coverLetter: 'I am excited to apply for the Frontend Developer position at TechCorp. With my experience in React and modern JavaScript, I believe I could bring value to your team...',
      skills: ['JavaScript', 'React', 'CSS', 'TypeScript'],
      university: 'Stanford University',
      matchScore: 85
    },
    {
      id: 'app2',
      jobId: 'job1',
      studentId: 'student2',
      studentName: 'Jamie Smith',
      status: 'interview',
      createdAt: '2025-05-14T09:15:00Z',
      updatedAt: '2025-05-15T10:20:00Z',
      resumeUrl: '/resume/jamie-smith.pdf',
      coverLetter: 'As a recent graduate with a strong foundation in web development and a passion for creating intuitive user experiences, I am applying for the Frontend Developer role...',
      skills: ['JavaScript', 'Vue.js', 'HTML/CSS', 'UX Design'],
      university: 'MIT',
      matchScore: 78
    },
    {
      id: 'app3',
      jobId: 'job1',
      studentId: 'student3',
      studentName: 'Taylor Williams',
      status: 'accepted',
      createdAt: '2025-05-10T11:45:00Z',
      updatedAt: '2025-05-15T09:30:00Z',
      resumeUrl: '/resume/taylor-williams.pdf',
      coverLetter: 'I would like to express my interest in the Frontend Developer position. I have three years of experience building responsive web applications...',
      skills: ['JavaScript', 'React', 'Redux', 'Tailwind CSS'],
      university: 'UC Berkeley',
      matchScore: 92,
      feedback: 'Excellent technical skills and a great fit for our team culture. We are excited to have you join us!'
    },
    {
      id: 'app4',
      jobId: 'job1',
      studentId: 'student4',
      studentName: 'Jordan Miller',
      status: 'rejected',
      createdAt: '2025-05-08T15:20:00Z',
      updatedAt: '2025-05-15T11:15:00Z',
      resumeUrl: '/resume/jordan-miller.pdf',
      coverLetter: 'I am writing to apply for the Frontend Developer position at TechCorp. I have a background in graphic design and recently completed a coding bootcamp...',
      skills: ['HTML/CSS', 'JavaScript', 'Figma'],
      university: 'UCLA',
      matchScore: 65,
      feedback: 'Thank you for your application. While we were impressed with your design skills, we are looking for candidates with more experience in frontend frameworks.'
    }
  ]
};

/**
 * Employer service for handling employer/organization-specific API calls
 * Using mock data for development
 */
export const EmployerService = {
  /**
   * Get organization dashboard statistics
   */
  getOrganizationStats: async (): Promise<OrganizationStats> => {
    // Mock API response
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_DATA.stats);
      }, 500);
    });
  },
  
  /**
   * Get active jobs for the organization
   */
  getActiveJobs: async (): Promise<JobItem[]> => {
    // Mock API response
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_DATA.jobs.filter(job => job.status === 'open'));
      }, 500);
    });
  },
  
  /**
   * Get all jobs for the organization (regardless of status)
   */
  getAllJobs: async (): Promise<JobItem[]> => {
    // Mock API response
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_DATA.jobs);
      }, 500);
    });
  },
  
  /**
   * Get a specific job by ID
   */
  getJobById: async (jobId: string): Promise<JobItem> => {
    // Mock API response
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const job = MOCK_DATA.jobs.find(j => j.id === jobId);
        if (job) {
          resolve(job);
        } else {
          reject(new Error('Job not found'));
        }
      }, 500);
    });
  },
  
  /**
   * Get top candidates for the organization
   */
  getTopCandidates: async (): Promise<CandidateItem[]> => {
    // Mock API response
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_DATA.candidates);
      }, 500);
    });
  },
  
  /**
   * Create a new job
   */
  createJob: async (jobData: JobPostData): Promise<JobItem> => {
    const response = await api.post<JobResponse>('/employer/jobs', jobData);
    return response.data.job;
  },
  
  /**
   * Update an existing job
   */
  updateJob: async (jobId: string, jobData: JobPostData): Promise<JobItem> => {
    const response = await api.put<JobResponse>(`/employer/jobs/${jobId}`, jobData);
    return response.data.job;
  },
  
  /**
   * Update job status
   */
  updateJobStatus: async (jobId: string, status: 'open' | 'closed' | 'draft'): Promise<JobItem> => {
    const response = await api.patch<JobResponse>(`/employer/jobs/${jobId}/status`, { status });
    return response.data.job;
  },
  
  /**
   * Delete a job posting
   */
  deleteJob: async (jobId: string): Promise<void> => {
    await api.delete(`/employer/jobs/${jobId}`);
  },
  
  /**
   * Get job applications
   */
  getJobApplications: async (jobId: string) => {
    // Mock API response
    return new Promise(resolve => {
      setTimeout(() => {
        const applications = MOCK_DATA.applications.filter(app => app.jobId === jobId);
        resolve(applications);
      }, 500);
    });
  },
  
  /**
   * Get application by ID
   */
  getApplicationById: async (applicationId: string) => {
    // Mock API response
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const application = MOCK_DATA.applications.find(app => app.id === applicationId);
        if (application) {
          resolve(application);
        } else {
          reject(new Error('Application not found'));
        }
      }, 500);
    });
  },
  
  /**
   * Get applications by IDs (for comparison)
   */
  getApplicationsByIds: async (applicationIds: string[]) => {
    // Mock API response
    return new Promise(resolve => {
      setTimeout(() => {
        const applications = MOCK_DATA.applications.filter(app => applicationIds.includes(app.id));
        resolve(applications);
      }, 500);
    });
  }
};

export default EmployerService;
