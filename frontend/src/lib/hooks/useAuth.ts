'use client';

import { useState, useEffect, type ReactNode, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';

// Define types for user and auth context
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'employer' | 'university' | 'admin';
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

// Auth Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const router = useRouter();

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // In a real app, this would verify session with backend
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('talentSpottingUser');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error('Session verification failed', error);
      } finally {
        setInitializing(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call - in a real app, this would call the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login response
      const mockUser: User = {
        id: '123',
        name: email.split('@')[0],
        email,
        role: 'student',
      };
      
      // Save user to localStorage (in a real app, you'd manage tokens securely)
      if (typeof window !== 'undefined') {
        localStorage.setItem('talentSpottingUser', JSON.stringify(mockUser));
      }
      setUser(mockUser);
      
      // Redirect based on user role
      if (mockUser.role === 'student') {
        router.push('/student-dashboard');
      } else if (mockUser.role === 'employer') {
        router.push('/organization-dashboard');
      } else if (mockUser.role === 'university') {
        router.push('/university-dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call - in a real app, this would call the backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration response
      const mockUser: User = {
        id: '123',
        name: userData.fullName,
        email: userData.email,
        role: userData.role as 'student' | 'employer' | 'university' | 'admin',
      };
      
      // Save user to localStorage (in a real app, you'd manage tokens securely)
      if (typeof window !== 'undefined') {
        localStorage.setItem('talentSpottingUser', JSON.stringify(mockUser));
      }
      setUser(mockUser);
      
      // Redirect based on user role
      if (mockUser.role === 'student') {
        router.push('/student-dashboard');
      } else if (mockUser.role === 'employer') {
        router.push('/organization-dashboard');
      } else if (mockUser.role === 'university') {
        router.push('/university-dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('Registration failed. Please try again later.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      // Mock API call - in a real app, this would call the backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear stored user data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('talentSpottingUser');
      }
      setUser(null);
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock API call - in a real app, this would call the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful response
      return true;
    } catch (error) {
      setError('Password reset failed. Please try again later.');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
}

// Hook for accessing auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
