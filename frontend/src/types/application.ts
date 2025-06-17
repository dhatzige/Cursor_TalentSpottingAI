// Application Types
export interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface ScoreBreakdown {
  skills: number;
  education: number;
  experience: number;
  applicationQuality: number;
}

export interface CandidateScore {
  overallScore: number;
  breakdownScores: ScoreBreakdown;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  candidateEmail?: string; // Added for ApplicationsTable.tsx
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  resume?: string;
  resumeUrl?: string; // URL for resume download/view
  coverLetter?: string;
  additionalInfo?: string;
  feedback?: string;
  skills?: string[];
  university?: string;
  matchScore?: number; // Legacy score field
  scores?: CandidateScore; // Enhanced scoring with breakdown
  jobTitle?: string; // Added for ApplicationsTable.tsx
  // Additional fields for enhanced matching
  experience?: number; // Years of experience
  education?: string; // Education level
  remotePreference?: boolean; // Preference for remote work
  notes?: Note[];
}

export type ApplicationStatus = 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';

export interface ApplicationReview {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  reviewerId: string;
}

export interface ApplicationSubmission {
  jobId: string;
  resume?: File;
  coverLetter: string;
  additionalInfo?: string;
}

// Props for Application Components
export interface ApplicationDetailsProps {
  application: Application;
  onStatusUpdate: (applicationId: string, newStatus: ApplicationStatus, feedback?: string) => Promise<void>;
  onAddNote?: (applicationId: string, content: string) => Promise<void>;
  onClose?: () => void;
  isEmployer?: boolean;
}

export interface ApplicationsListProps {
  applications: Application[];
  selectedId?: string;
  selectedApplicationId?: string;
  onSelect?: (applicationId: string) => void;
  onSelectApplication: (applicationId: string) => void;
  isEmployer?: boolean;
  jobTitle?: string;
  compact?: boolean;
}

export interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export interface StatusFilterProps {
  selectedStatus: ApplicationStatus | 'all';
  onStatusChange: (status: ApplicationStatus | 'all') => void;
}
