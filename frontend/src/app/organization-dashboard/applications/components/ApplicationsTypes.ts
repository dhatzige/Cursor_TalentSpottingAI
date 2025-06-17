import { Application } from '@/types/application';

export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SavedApplicationSearch {
  id: string;
  name: string;
  status?: string;
  jobId?: string;
  createdAt: string;
  lastUsed: string;
}
