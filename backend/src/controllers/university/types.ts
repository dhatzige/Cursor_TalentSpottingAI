export interface UniversityResponse {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  city: string;
  emailDomains: string[];
  website: string | null;
  established: number | null;
}

export interface UniversityListResponse {
  success: boolean;
  count: number;
  data: UniversityResponse[];
}

export interface UniversityDetailResponse {
  success: boolean;
  data: UniversityResponse & {
    _count?: {
      users: number;
      degrees: number;
    };
  };
}

export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  verified: boolean;
  university?: {
    id: string;
    name: string;
    nameEn: string;
    type: string;
  };
  message?: string;
}

export interface UniversityStatsResponse {
  success: boolean;
  data: {
    total: number;
    public: number;
    private: number;
    topUniversities: {
      id: string;
      name: string;
      userCount: number;
    }[];
  };
} 