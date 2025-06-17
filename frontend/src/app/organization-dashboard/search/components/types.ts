// Types for advanced search functionality

export interface SearchCriteria {
  query: string;
  skills: string[];
  education: string[];
  experience: {
    min: number;
    max: number;
  };
  locations: string[];
  matchScore: {
    min: number;
    max: number;
  };
}

export interface SearchResult {
  id: string;
  name: string;
  title: string;
  skills: string[];
  experience: number;
  education: string;
  location: string;
  matchScore: number;
  appliedDate: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  criteria: SearchCriteria;
  createdAt?: string;
}
