import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/student-dashboard(.*)',
  '/organization-dashboard(.*)',
  '/university-dashboard(.*)',
  '/admin-dashboard(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const { userId } = await auth();

  // Only handle the most basic case: unauthenticated users accessing protected routes
  if (!userId && isProtectedRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Let everything else pass through - no complex role-based redirects
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\..*|_next).*)', // Exclude files with extensions and _next folder
    '/', // Root
    '/(api|trpc)(.*)', // API and tRPC routes
  ],
};
