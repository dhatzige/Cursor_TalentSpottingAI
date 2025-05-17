'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './useAuth';

type AllowedRoles = string[] | 'any';

/**
 * Hook to protect routes based on authentication and roles
 * @param allowedRoles Array of roles that can access the route, or 'any' for any authenticated user
 * @param redirectPath Path to redirect to if unauthorized
 */
export const useProtectedRoute = (allowedRoles: AllowedRoles = 'any', redirectPath: string = '/login') => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip validation during loading state
    if (loading) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the current path for redirect after login
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectAfterLogin', pathname || '/');
      }
      router.push(redirectPath);
      return;
    }

    // User is authenticated, check role if specified
    if (allowedRoles !== 'any' && user) {
      const hasPermission = allowedRoles.includes(user.role);
      
      if (!hasPermission) {
        // Redirect to appropriate dashboard based on role
        switch(user.role) {
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
            router.push('/login');
        }
      }
    }
  }, [loading, isAuthenticated, user, router, allowedRoles, redirectPath, pathname]);

  return { loading, user };
};

export default useProtectedRoute;
