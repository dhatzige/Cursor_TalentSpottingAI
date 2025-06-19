'use client';

import { useState, useEffect } from 'react';
import { useSearchParams as useNextSearchParams } from 'next/navigation';

/**
 * A hook that safely uses search parameters in both client and server environments.
 * 
 * This hook solves the Next.js App Router build error: 
 * "useSearchParams() should be wrapped in a suspense boundary" 
 * by only accessing search parameters on the client side through useEffect.
 * 
 * @returns An object with methods similar to URLSearchParams that safely access search parameters
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
 * - Always use this hook instead of useSearchParams from next/navigation
 * - For pages using this hook, add `export const dynamic = 'force-dynamic';` to disable prerendering
 * - This hook returns safe empty values during SSR and updates with real values on the client
 */
export function useSafeSearchParams() {
  // Initialize with empty values that will be safe during SSR
  const [params, setParams] = useState<{
    get: (key: string) => string | null;
    getAll: (key: string) => string[];
    has: (key: string) => boolean;
    toString: () => string;
    entries: () => IterableIterator<[string, string]>;
    keys: () => IterableIterator<string>;
    values: () => IterableIterator<string>;
  }>({
    get: () => null,
    getAll: () => [],
    has: () => false,
    toString: () => '',
    entries: () => [][Symbol.iterator](),
    keys: () => [][Symbol.iterator](),
    values: () => [][Symbol.iterator]()
  });

  // Only access useSearchParams on the client side
  useEffect(() => {
    // This will only run in the browser, not during SSR
    const searchParams = useNextSearchParams();
    
    if (searchParams) {
      setParams({
        get: (key: string) => searchParams.get(key),
        getAll: (key: string) => searchParams.getAll(key),
        has: (key: string) => searchParams.has(key),
        toString: () => searchParams.toString(),
        entries: () => searchParams.entries(),
        keys: () => searchParams.keys(),
        values: () => searchParams.values()
      });
    }
  }, []);

  return params;
}
