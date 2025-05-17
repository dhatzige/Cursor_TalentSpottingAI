'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  transparentNav?: boolean;
}

export default function MainLayout({ children, transparentNav = false }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1a]">
      <Navbar transparent={transparentNav} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
