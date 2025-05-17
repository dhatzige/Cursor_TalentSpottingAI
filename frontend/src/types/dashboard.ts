// Dashboard data types
export interface ApiJobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  postDate: string;
  status: string;
  applicantCount: number;
}

export interface ApiCandidateItem {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
}

export interface ApiOrganizationStats {
  activeJobs: number;
  totalApplicants: number;
  positionsFilled: number;
  trends: {
    applicantChange: number;
  };
}

// Component prop types
export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  postDate: string;
  status: 'open' | 'closed' | 'draft';
  applicantCount: number;
}

export interface CandidateItem {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
}

export interface DashboardData {
  stats: ApiOrganizationStats;
  jobs: JobItem[];
  candidates: CandidateItem[];
}
