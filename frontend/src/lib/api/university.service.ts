import api from './axios';

interface UniversityMetrics {
  totalStudents: number;
  activeStudents: number;
  placementRate: number;
  averageSalary: string;
}

interface MetricsResponse {
  metrics: UniversityMetrics;
}

interface PlacementData {
  degree: string;
  students: number;
  placed: number;
  averageSalary: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface PlacementsResponse {
  placements: PlacementData[];
}

interface EmployerPartner {
  id: string;
  name: string;
  industry: string;
  hiringStatus: 'active' | 'inactive';
  openPositions: number;
  studentsHired: number;
}

interface EmployersResponse {
  employers: EmployerPartner[];
}

/**
 * University service for handling university-specific API calls
 */
export const UniversityService = {
  /**
   * Get university dashboard metrics
   */
  getUniversityStats: async (): Promise<UniversityMetrics> => {
    const response = await api.get<MetricsResponse>('/university/dashboard/stats');
    return response.data.metrics;
  },
  
  /**
   * Get student placement data by degree
   */
  getStudentPlacement: async (): Promise<PlacementData[]> => {
    const response = await api.get<PlacementsResponse>('/university/placements');
    return response.data.placements;
  },
  
  /**
   * Get university's employer partners
   */
  getEmployerPartners: async (): Promise<EmployerPartner[]> => {
    const response = await api.get<EmployersResponse>('/university/employer-partners');
    return response.data.employers;
  }
};

export default UniversityService;
