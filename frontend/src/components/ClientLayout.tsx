'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DevNavBar from '../app/components/DevNavBar';
import Navbar from './layout/Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
    <>
      <DevNavBar />
      <Navbar transparent={isHomepage} />
      <main className={isHomepage ? '' : 'pt-16'}> {/* Only add padding on non-homepage */}
        <div className="dev-nav-spacer">
          {children}
        </div>
      </main>
      {/* This style ensures proper spacing when DevNavBar is visible */}
      <style dangerouslySetInnerHTML={{
        __html: `
          body.dev-nav-visible .navbar-main {
            top: 2.75rem; /* DevNav height */
          }
          body.dev-nav-visible main {
            padding-top: calc(4rem + 2.75rem); /* Header height + DevNav height */
          }
          body:not(.dev-nav-visible) main {
            padding-top: 4rem; /* Just header height when DevNav is hidden */
          }
        `
      }} />
    </>
  );
}
