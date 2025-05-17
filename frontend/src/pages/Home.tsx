'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This file is deprecated. Redirecting to the main homepage to avoid duplication
const Home: React.FC = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main homepage
    router.push('/');
  }, [router]);
  
  // Return minimal component while redirect happens
  return <div className="h-screen w-screen bg-black"></div>;
};

export default Home;
