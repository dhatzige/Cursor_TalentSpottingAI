'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Redirect the duplicate /homepage route to the main homepage at the root path
export default function Homepage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/');
  }, [router]);
  
  // This won't be displayed because of the redirect, but is needed
  return null;
}
