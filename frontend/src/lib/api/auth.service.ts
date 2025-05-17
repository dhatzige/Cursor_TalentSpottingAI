import api from './axios';

interface RegisterParams {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'student' | 'employer' | 'university';
}

interface LoginParams {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    organizationId?: string;
  };
  token?: string;
}

interface ProfileResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    organizationId?: string;
  };
}

/**
 * Authentication service for handling user registration, login, and profile
 */
export const AuthService = {
  /**
   * Register a new user
   */
  register: async (params: RegisterParams): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', params);
    return response.data;
  },
  
  /**
   * Login and get auth token
   */
  login: async (params: LoginParams): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', params);
    
    // Save token to localStorage if available
    if (response.data.token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      
      // Also save user data for easy access
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },
  
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>('/auth/profile');
    return response.data;
  },
  
  /**
   * Logout current user
   */
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  },
  
  /**
   * Get current user role
   */
  getUserRole: (): string | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.role;
      }
    }
    return null;
  }
};

export default AuthService;
