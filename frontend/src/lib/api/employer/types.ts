// Types for employer service API

// Organization Stats
export interface OrganizationStats {
  activeJobs: number;
  totalApplicants: number;
  positionsFilled: number;
  trends: {
    applicantChange: number;
  };
}

export interface StatsResponse {
  stats: OrganizationStats;
}

// Jobs
export interface JobItem {
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

export interface JobsResponse {
  jobs: JobItem[];
}

export interface JobResponse {
  job: JobItem;
}

export interface JobPostData {
  title: string;
  description: string;
  location: string;
  skills?: string[];
}

// Candidates
export interface CandidateItem {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
  applicationId: string;
}

export interface CandidatesResponse {
  candidates: CandidateItem[];
}

// Applications
export interface ApplicationItem {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resumeUrl: string;
  coverLetter?: string;
  skills: string[];
  university?: string;
  matchScore: number;
  feedback?: string;
}

export interface ApplicationsResponse {
  applications: ApplicationItem[];
  job?: JobItem;
}

export interface ApplicationResponse {
  application: ApplicationItem;
}

// Talent Search
export interface TalentSearchCriteria {
  location?: {
    city?: string;
    lat?: number;
    lng?: number;
  };
  radiusKm?: number;
  universities?: string[];
  skills?: Array<{ name: string; priority?: number }>;
  languages?: Array<{ name: string; proficiency?: string }>;
  availabilityDate?: string;
  page?: number;
  limit?: number;
}

export interface TalentSearchResult {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  lastActive?: Date;
  city?: string;
  country?: string;
  education: Array<{
    degree?: string;
    fieldOfStudy?: string;
    institution?: string;
    graduationYear?: number;
  }>;
  skills: string[];
  languages: Array<{
    name: string;
    proficiency?: string;
  }>;
  availableFrom?: Date;
  matchScore?: number | null;
}

export interface TalentSearchResponse {
  results: TalentSearchResult[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  universities: Array<{
    id: string;
    name: string;
    type?: string;
    city?: string;
    country?: string;
  }>;
  cities: Array<{
    city: string;
    country: string;
    count: number;
  }>;
  skills: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  languages: Array<{
    id: string;
    name: string;
    code: string;
  }>;
}

export interface CandidateProfile extends TalentSearchResult {
  email?: string;
  bio?: string;
  experience: Array<{
    title?: string;
    company?: string;
    location?: string;
    startDate?: Date | string;
    endDate?: Date | string | null;
    description?: string;
  }>;
  projects: Array<{
    title?: string;
    description?: string;
    url?: string;
    imageUrl?: string;
  }>;
  certificates: Array<{
    name?: string;
    issuer?: string;
    issueDate?: Date | string;
    expiryDate?: Date | string | null;
    credentialId?: string;
    credentialUrl?: string;
  }>;
}
