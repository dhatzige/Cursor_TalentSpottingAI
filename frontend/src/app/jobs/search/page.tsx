'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSafeSearchParams } from '@/lib/hooks/useSafeSearchParams';

function Redirector() {
  const router = useRouter();
  const searchParams = useSafeSearchParams();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    router.replace(`/jobs?q=${encodeURIComponent(searchQuery)}`);
  }, [searchQuery, router]);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Redirect search page to main jobs page with query parameters
export default function SearchResultsPage() {
  return <Redirector />;
}
