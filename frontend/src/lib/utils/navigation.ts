/**
 * Navigation utilities for preserving dev bypass parameters
 */

/**
 * Adds dev_bypass parameter to a URL if we're in development mode and dev bypass is active
 * @param href - The base URL
 * @param searchParams - Current search parameters (optional)
 * @returns URL with dev_bypass parameter if needed
 */
export function preserveDevBypass(href: string, searchParams?: URLSearchParams): string {
  // Only in development mode
  if (process.env.NODE_ENV !== 'development') {
    return href;
  }

  // Check if dev bypass is currently active
  const devBypass = searchParams?.get('dev_bypass') === 'true' || 
                   (typeof window !== 'undefined' && window.location.search.includes('dev_bypass=true'));

  if (!devBypass) {
    return href;
  }

  // Add dev_bypass parameter
  const separator = href.includes('?') ? '&' : '?';
  return `${href}${separator}dev_bypass=true`;
}

/**
 * Hook to get a navigation function that preserves dev bypass
 */
export function useDevBypassNavigation() {
  if (typeof window === 'undefined') {
    return (href: string) => href;
  }

  const searchParams = new URLSearchParams(window.location.search);
  
  return (href: string) => preserveDevBypass(href, searchParams);
} 