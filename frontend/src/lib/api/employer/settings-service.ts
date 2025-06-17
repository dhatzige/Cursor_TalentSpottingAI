import api from '../axios';
import { EMPLOYER_SETTINGS_MOCK } from './mock-data';

/**
 * Employer Settings Service
 */
const isDev = process.env.NODE_ENV === 'development';

export interface EmployerPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
}

export const SettingsService = {
  /** Upload company logo and return CDN url */
  uploadLogo: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('logo', file);
    try {
      const res = await api.post<{ url: string }>('/employer/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.url;
    } catch (err) {
      if (isDev) {
        console.warn('[EmployerSettingsService] Using mock logo due to API error', err);
        return EMPLOYER_SETTINGS_MOCK.logoUrl;
      }
      throw err;
    }
  },

  /** Get subscription plan */
  getPlan: async (): Promise<EmployerPlan> => {
    try {
      const res = await api.get<EmployerPlan>('/employer/settings/plan');
      return res.data;
    } catch (err) {
      if (isDev) {
        console.warn('[EmployerSettingsService] Using mock plan', err);
        return { ...EMPLOYER_SETTINGS_MOCK.plan };
      }
      throw err;
    }
  },

  /** Upgrade plan */
  upgradePlan: async (planId: string): Promise<void> => {
    try {
      await api.post('/employer/settings/plan', { planId });
    } catch (err) {
      if (isDev) {
        console.warn('[EmployerSettingsService] Mock upgrade', err);
        return;
      }
      throw err;
    }
  },

  /** Delete account */
  deleteAccount: async (): Promise<void> => {
    try {
      await api.delete('/employer/settings');
    } catch (err) {
      if (isDev) {
        console.warn('[EmployerSettingsService] Mock delete account', err);
        return;
      }
      throw err;
    }
  }
};
