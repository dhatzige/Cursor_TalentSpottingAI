'use client';

import { useSearchParams as useNextSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

/**
 * A hook that safely uses search parameters in both client and server environments.
 * 
 * This hook solves the Next.js App Router build error: 
 * "useSearchParams() should be wrapped in a suspense boundary" 
 * by ensuring that pages using it are dynamically rendered and by providing a
 * safe fallback during the initial server render.
 * 
 * @returns A URLSearchParams object. It will be empty on the server and during the
 * initial client render, and will contain the actual search parameters after hydration.
 * 
 * @example
 * ```tsx
 * import { useSafeSearchParams } from '@/lib/hooks/useSafeSearchParams';
 * 
 * function MyComponent() {
 *   const searchParams = useSafeSearchParams();
 *   const query = searchParams.get('q');
 *   
 *   return <div>Search query: {query}</div>;
 * }
 * ```
 * 
 * @remarks
 * - Always use this hook instead of useSearchParams from next/navigation.
 * - For pages using this hook, add `export const dynamic = 'force-dynamic';` to disable prerendering.
 * - This hook returns an empty URLSearchParams object during SSR and updates with real values on the client.
 */
export function useSafeSearchParams() {
  // useNextSearchParams must be called at the top level of the hook/component.
  // It will throw an error if the page is not dynamically rendered.
  // Ensure pages using this hook have `export const dynamic = 'force-dynamic';`
  const searchParams = useNextSearchParams();
  const [isClient, setIsClient] = useState(false);

  // This effect will run once the component mounts on the client.
  useEffect(() => {
    setIsClient(true);
  }, []);

  // useMemo ensures we return a stable object.
  // On the server (and initial client render), we return an empty URLSearchParams instance.
  // After the component has mounted on the client, we return the actual searchParams.
  return useMemo(() => {
    if (isClient) {
      return searchParams;
    }
    // Provide a default empty URLSearchParams object for SSR and initial render.
    return new URLSearchParams();
  }, [isClient, searchParams]);
}
