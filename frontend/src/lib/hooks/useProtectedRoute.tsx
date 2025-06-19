'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSafeSearchParams } from './useSafeSearchParams';
import { useAuth } from './useAuth'; // Import named exports

// Define user type locally to avoid import issues
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string;
}

type AllowedRoles = string[] | 'any';

/**
 * Hook to protect routes based on authentication and roles
 * @param allowedRoles Array of roles that can access the route, or 'any' for any authenticated user
 * @param redirectPath Path to redirect to if unauthorized
 */
export const useProtectedRoute = (allowedRoles: AllowedRoles = 'any', redirectPath: string = '/login') => {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSafeSearchParams();

  const devBypassParam = searchParams.get('dev_bypass');
  const isDevBypassActive = process.env.NODE_ENV === 'development' && devBypassParam === 'true';

  let effectiveLoading = auth.loading;
  let effectiveUser = auth.user;
  let effectiveIsAuthenticated = auth.isAuthenticated;

  if (isDevBypassActive) {
    effectiveLoading = false;
    
    // If allowedRoles is an array, use the first role as the mock user's role
    // Otherwise, use a generic 'user' role
    const mockRole = Array.isArray(allowedRoles) && allowedRoles.length > 0
      ? allowedRoles[0]
      : 'user';
    
    effectiveUser = { 
      id: 'dev', 
      email: 'dev@example.com', 
      name: 'Dev User', 
      role: mockRole
    } as User;
    effectiveIsAuthenticated = true;
  }

  useEffect(() => {
    if (effectiveLoading) return;

    if (!effectiveIsAuthenticated) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectAfterLogin', pathname || '/');
      }
      router.push(redirectPath);
      return;
    }

    // User is authenticated, check role if specified
    if (allowedRoles !== 'any' && effectiveUser) {
      // Assuming effectiveUser.role is always a string if effectiveUser is not null, based on User type.
      const userRole = effectiveUser.role;
      const hasPermission = allowedRoles.includes(userRole);

      if (!hasPermission) {
        // Redirect to appropriate dashboard based on role
        switch (userRole) {
          case 'admin':
            router.push('/admin-dashboard');
            break;
          case 'student':
            router.push('/student-dashboard');
            break;
          case 'employer':
            router.push('/organization-dashboard');
            break;
          case 'university':
            router.push('/university-dashboard');
            break;
          default:
            // If role is 'any' (from dev_bypass) and doesn't match specific allowedRoles,
            // or if it's an unknown role, redirect to login.
            router.push('/login');
        }
      }
    } else if (allowedRoles !== 'any' && !effectiveUser && !effectiveLoading && !isDevBypassActive) {
      // Fallback: specific roles required, no user, not loading, not dev_bypass.
      // This should ideally be caught by !effectiveIsAuthenticated.
      router.push(redirectPath);
    }
  }, [
    effectiveLoading,
    effectiveIsAuthenticated,
    effectiveUser,
    router,
    allowedRoles,
    redirectPath,
    pathname,
    isDevBypassActive // Added as its change should re-evaluate the effect
  ]);

  return { 
    loading: effectiveLoading, 
    user: effectiveUser, 
    isAuthenticated: effectiveIsAuthenticated 
  };
};

export default useProtectedRoute;
