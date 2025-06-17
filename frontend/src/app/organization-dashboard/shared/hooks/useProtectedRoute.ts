/**
 * Hook to protect routes based on user role
 * This is a simplified implementation for development purposes
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock authentication state - in a real app, this would come from your auth provider
const mockAuthState = {
  isAuthenticated: true,
  userRole: 'employer'
};

// Type for the hook return value
interface ProtectedRouteResult {
  isAuthorized: boolean;
  loading: boolean;
  userRole: string | null;
}

/**
 * Enhanced hook to protect routes based on user role with better flexibility
 * @param requiredRoles The role(s) required to access the route
 * @param redirectPath Optional path to redirect to if unauthorized
 * @returns Object with authorization status and loading state
 */
export function useProtectedRoute(
  requiredRoles: string | string[], 
  redirectPath: string = '/login'
): ProtectedRouteResult {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  
  useEffect(() => {
    // Check for dev mode
    const isDev = process.env.NODE_ENV === 'development';
    const devBypass = checkDevModeBypass();
    
    // Convert requiredRoles to array for consistency
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // In development with dev bypass, allow access without checking roles
    if (isDev && devBypass) {
      setIsAuthorized(true);
      setLoading(false);
      return;
    }
    
    // Normal auth check
    const hasAccess = mockAuthState.isAuthenticated && 
      (roles.includes(mockAuthState.userRole) || roles.length === 0);
    
    setIsAuthorized(hasAccess);
    setLoading(false);
    
    // Redirect if no access and redirectPath is provided
    if (!hasAccess && redirectPath) {
      router.push(redirectPath);
    }
  }, [requiredRoles, redirectPath, router]);
  
  return { 
    isAuthorized, 
    loading,
    userRole: mockAuthState.isAuthenticated ? mockAuthState.userRole : null 
  };
}

/**
 * Check if dev mode bypass is enabled via localStorage or URL parameter
 */
function checkDevModeBypass(): boolean {
  // Only run on client
  if (typeof window === 'undefined') return false;
  
  // Check URL parameter - highest priority
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('dev_bypass')) {
    // Save this preference to localStorage as well for persistence
    try {
      localStorage.setItem('devBypassAuth', 'true');
    } catch (e) {
      console.error('Could not save dev bypass preference to localStorage');
    }
    return true;
  }
  
  // Check if the DevNavBar is visible (which adds a class to the body)
  const devNavVisible = document.querySelector('nav.dev-nav-visible');
  if (devNavVisible) {
    return true; // If DevNavBar is visible, always allow access
  }
  
  // Check localStorage as fallback
  try {
    return localStorage.getItem('devBypassAuth') === 'true';
  } catch (e) {
    return false;
  }
}
