import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '../api';

// User type definition
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const loadUser = () => {
      setLoading(true);
      try {
        // Check if we have a token
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Get user data from localStorage or fetch from API
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
          setIsAuthenticated(true);
        } else {
          // Fetch current user if token exists but no user data
          AuthService.getProfile()
            .then(response => {
              setUser(response.user);
              setIsAuthenticated(true);
              // Cache user in localStorage
              localStorage.setItem('user', JSON.stringify(response.user));
            })
            .catch(() => {
              // Clear invalid token
              localStorage.removeItem('token');
            });
        }
      } catch (err) {
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  // Login method
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register method
  const register = async (email: string, password: string, name: string, role: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await AuthService.register({ 
        email, 
        password, 
        name, 
        role: role as 'admin' | 'student' | 'employer' | 'university' 
      });
      // Auto-login after registration
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout method
  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
