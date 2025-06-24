'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';

export type AllowedRoles = string[] | 'any';

/**
 * Universal protected-route hook powered by Clerk.
 * Handles ALL role-based redirects client-side to avoid middleware conflicts.
 * Supports development bypass with ?dev_bypass=true parameter.
 */
export function useProtectedRoute(
  allowedRoles: AllowedRoles = 'any',
  redirectPath: string = '/sign-in',
) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Check for development bypass
  const isDevMode = process.env.NODE_ENV === 'development';
  const devBypass = searchParams.get('dev_bypass') === 'true';
  const shouldBypass = isDevMode && devBypass;

  const loading = !isLoaded && !shouldBypass;

  useEffect(() => {
    if ((!isLoaded && !shouldBypass) || hasRedirected) return;

    // Development bypass - inject mock user based on route
    if (shouldBypass) {
      let mockRole = 'student'; // default
      
      // Determine role from pathname
      if (pathname.includes('student')) mockRole = 'student';
      else if (pathname.includes('organization') || pathname.includes('employer')) mockRole = 'employer';
      else if (pathname.includes('university')) mockRole = 'university';
      else if (pathname.includes('admin')) mockRole = 'admin';
      
      console.log('Development bypass active, mock role:', mockRole);
      
      // Check role permissions for dev bypass
      if (allowedRoles !== 'any') {
        const hasPermission = allowedRoles.includes(mockRole);
        
        if (!hasPermission) {
          const correctDashboard = getDashboardForRole(mockRole);
          console.log('Dev bypass: Wrong role for route, redirecting to correct dashboard:', correctDashboard);
          setHasRedirected(true);
          router.replace(`${correctDashboard}?dev_bypass=true`);
          return;
        }
      }
      
      console.log('Dev bypass: Access granted to route:', pathname);
      return;
    }

    // Regular authentication flow
    // 1. Not signed in -> redirect to sign-in
    if (!isSignedIn) {
      console.log('Not signed in, redirecting to sign-in');
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectAfterLogin', pathname ?? '/');
      }
      setHasRedirected(true);
      router.replace(redirectPath);
      return;
    }

    // 2. Signed in but no user object yet -> wait
    if (!user) {
      return;
    }

    const role = (user.unsafeMetadata?.role as string | undefined) ?? null;
    console.log('User role check:', { role, pathname, allowedRoles });

    // 3. User on auth pages but has a role -> redirect to dashboard
    if ((pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) && role) {
      const dashboard = getDashboardForRole(role);
      console.log('Redirecting from auth page to dashboard:', dashboard);
      setHasRedirected(true);
      router.replace(dashboard);
      return;
    }

    // 4. User has no role and not on onboarding -> go to onboarding
    if (!role && pathname !== '/onboarding' && !pathname.startsWith('/sign-in') && !pathname.startsWith('/sign-up')) {
      console.log('No role, redirecting to onboarding');
      setHasRedirected(true);
      router.replace('/onboarding');
      return;
    }

    // 5. User has role but on onboarding -> go to dashboard
    if (role && pathname === '/onboarding') {
      const dashboard = getDashboardForRole(role);
      console.log('Has role, redirecting from onboarding to dashboard:', dashboard);
      setHasRedirected(true);
      router.replace(dashboard);
      return;
    }

    // 6. Check role permissions for protected routes
    if (allowedRoles !== 'any' && role) {
      const hasPermission = allowedRoles.includes(role);
      
      if (!hasPermission) {
        const correctDashboard = getDashboardForRole(role);
        console.log('Wrong role for route, redirecting to correct dashboard:', correctDashboard);
        setHasRedirected(true);
        router.replace(correctDashboard);
        return;
      }
    }

    console.log('Access granted to route:', pathname);
  }, [isLoaded, isSignedIn, user, allowedRoles, redirectPath, pathname, router, hasRedirected, shouldBypass, searchParams]);

  return { loading };
}

function getDashboardForRole(role: string): string {
  switch (role?.toLowerCase()) {
    case 'student': return '/student-dashboard';
    case 'employer': return '/organization-dashboard';
    case 'university': return '/university-dashboard';
    case 'admin': return '/admin-dashboard';
    default: return '/onboarding';
  }
}

export default useProtectedRoute;
