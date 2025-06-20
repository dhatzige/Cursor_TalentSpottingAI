'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';

export type AllowedRoles = string[] | 'any';

/**
 * Universal protected-route hook powered by Clerk.
 * Usage example:
 *   const { loading } = useProtectedRoute(['student']);
 */
export function useProtectedRoute(
  allowedRoles: AllowedRoles = 'any',
  redirectPath: string = '/sign-in',
) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const loading = !isLoaded;

  useEffect(() => {
    if (!isLoaded) return; // still hydrating

    // 1. Not signed in ➜ /sign-in
    if (!isSignedIn) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectAfterLogin', pathname ?? '/');
      }
      const safeRedirect = redirectPath || '/sign-in';
      router.replace(safeRedirect);
      return;
    }

    // 2. Signed in ➜ check role if restrictions exist
    if (allowedRoles !== 'any') {
      const role = (user?.unsafeMetadata?.role as string | undefined) ?? null;
      if (!role) {
        // Role not yet available – wait until profile fully loaded before deciding.
        return;
      }
      const hasPermission = allowedRoles.includes(role);
      if (!hasPermission) {
        const dest =
          role === 'admin'
            ? '/admin-dashboard'
            : role === 'student'
            ? '/student-dashboard'
            : role === 'employer'
            ? '/organization-dashboard'
            : role === 'university'
            ? '/university-dashboard'
            : '/';
        router.replace(dest);
      }
    }
  }, [isLoaded, isSignedIn, user, allowedRoles, redirectPath, pathname, router]);

  return { loading };
}

export default useProtectedRoute;
