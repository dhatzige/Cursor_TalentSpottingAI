import api from './axios';
import { UNIVERSITY_MOCK_DATA } from './university/mock-data';

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

interface Student {
  id: string;
  name: string;
  degree: string;
  graduationYear: number;
  status: 'active' | 'inactive';
  gpa: number;
}

interface Settings {
  universityName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
}

interface SettingsResponse {
  settings: Settings;
}

interface StudentsResponse {
  students: Student[];
}

/**
 * University service for handling university-specific API calls
 */
const isDev = process.env.NODE_ENV === 'development';

export const UniversityService = {
  /**
   * Get university dashboard metrics
   */
  getUniversityStats: async (): Promise<UniversityMetrics> => {
    try {
      const response = await api.get<MetricsResponse>('/university/dashboard/stats');
      return response.data.metrics;
    } catch (err) {
      if (isDev) {
        console.warn('[UniversityService] Using mock metrics due to API error:', err);
        return UNIVERSITY_MOCK_DATA.metrics;
      }
      throw err;
    }
  },
  
  /**
   * Get student placement data by degree
   */
  getStudentPlacement: async (): Promise<PlacementData[]> => {
    try {
      const response = await api.get<PlacementsResponse>('/university/placements');
      return response.data.placements;
    } catch (err) {
      if (isDev) {
        console.warn('[UniversityService] Using mock placements due to API error:', err);
        return UNIVERSITY_MOCK_DATA.placements.map((p) => ({ ...p }));
      }
      throw err;
    }
  },
  
  /**
   * Get university's employer partners
   */
  getEmployerPartners: async (): Promise<EmployerPartner[]> => {
    try {
      const response = await api.get<EmployersResponse>('/university/employer-partners');
      return response.data.employers;
    } catch (err) {
      if (isDev) {
        console.warn('[UniversityService] Using mock employers due to API error:', err);
        return UNIVERSITY_MOCK_DATA.employers.map((e) => ({ ...e }));
      }
      throw err;
    }
  },

  /**
   * Get list of students
   */
  getStudents: async (): Promise<Student[]> => {
    try {
      const response = await api.get<StudentsResponse>('/university/students');
      return response.data.students;
    } catch (err) {
      if (isDev) {
        console.warn('[UniversityService] Using mock students due to API error:', err);
        return UNIVERSITY_MOCK_DATA.students.map((s) => ({ ...s }));
      }
      throw err;
    }
  },

  /**
   * Get university settings
   */
  getSettings: async (): Promise<Settings> => {
    try {
      const response = await api.get<SettingsResponse>('/university/settings');
      return response.data.settings;
    } catch (err) {
      if (isDev) {
        console.warn('[UniversityService] Using mock settings due to API error:', err);
        return UNIVERSITY_MOCK_DATA.settings;
      }
      throw err;
    }
  },

  /**
   * Update university settings
   */
  updateSettings: async (settings: Settings): Promise<Settings> => {
    try {
      const response = await api.put<SettingsResponse>('/university/settings', settings);
      return response.data.settings;
    } catch (err) {
      if (isDev) {
        console.warn('[UniversityService] Mock updating settings due to API error:', err);
        // Just return the provided settings in dev mode
        return settings;
      }
      throw err;
    }
  },

  /** Upload university logo */
  uploadLogo: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('logo', file);
    try {
      const res = await api.post<{ url: string }>('/university/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.url;
    } catch (err) {
      if (isDev) {
        console.warn('[UniversityService] Mock logo upload', err);
        return '/images/mock-university-logo.png';
      }
      throw err;
    }
  },

  /** Plan management */
  getPlan: async (): Promise<any> => {
    try {
      const res = await api.get('/university/settings/plan');
      return res.data;
    } catch (err) {
      if (isDev) {
        console.warn('[UniversityService] Mock get plan', err);
        return { id: 'basic', name: 'Basic', price: 'Free', features: [] };
      }
      throw err;
    }
  },
  upgradePlan: async (planId: string): Promise<void> => {
    try {
      await api.post('/university/settings/plan', { planId });
    } catch (err) {
      if (isDev) {
        console.warn('[UniversityService] Mock upgrade plan', err);
        return;
      }
      throw err;
    }
  },

  deleteAccount: async (): Promise<void> => {
    try {
      await api.delete('/university/settings');
    } catch (err) {
      if (isDev) {
        console.warn('[UniversityService] Mock delete', err);
        return;
      }
      throw err;
    }
  }
};

export default UniversityService;
