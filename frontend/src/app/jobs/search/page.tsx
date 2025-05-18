'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Redirect search page to main jobs page with query parameters
export default function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  useEffect(() => {
    // Redirect to the main jobs page with the search query
    router.replace(`/jobs?q=${encodeURIComponent(searchQuery)}`);
  }, [searchQuery, router]);
  
  // Return a minimal loading state while redirecting
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
