export interface Candidate {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
  applicationId: string;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SavedFilter {
  id: string;
  name: string;
  minMatchScore?: number;
  skills?: string[];
  university?: string;
  createdAt: string;
  lastUsed: string;
}
