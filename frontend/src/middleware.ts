import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/student-dashboard(.*)',
  '/organization-dashboard(.*)',
  '/university-dashboard(.*)',
  '/admin-dashboard(.*)',
]);

const roleToDashboard = (role: string): string => {
  switch (role?.toLowerCase()) {
    case 'student': return '/student-dashboard';
    case 'employer': return '/organization-dashboard';
    case 'university': return '/university-dashboard';
    case 'admin': return '/admin-dashboard';
    default: return '/onboarding';
  }
};

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const { userId, sessionClaims } = await auth();

  // Handle authenticated users
  if (userId) {
    const unsafeMetadata = (sessionClaims?.unsafeMetadata as { role?: string }) || {};
    const publicMetadata = (sessionClaims?.publicMetadata as { role?: string }) || {};
    const role = unsafeMetadata.role || publicMetadata.role;

    // Redirect from auth pages to the correct dashboard
    if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
      const dashboardUrl = new URL(roleToDashboard(role || ''), req.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // Redirect to onboarding if the user has no role
    if (!role && !pathname.startsWith('/onboarding')) {
      const onboardingUrl = new URL('/onboarding', req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  } else {
    // Handle unauthenticated users trying to access protected routes
    if (isProtectedRoute(req)) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\..*|_next).*)', // Exclude files with extensions and _next folder
    '/', // Root
    '/(api|trpc)(.*)', // API and tRPC routes
  ],
};
