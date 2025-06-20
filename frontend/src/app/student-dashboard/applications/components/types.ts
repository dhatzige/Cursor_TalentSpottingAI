// Type definitions for student applications components
export interface ApplicationItem {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  appliedDate: string;
  lastUpdated: string;
  feedback?: string;
}
