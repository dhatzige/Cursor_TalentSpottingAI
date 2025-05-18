'use client';

import React from 'react';
import DevNavBar from '../app/components/DevNavBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DevNavBar />
      <div className="dev-nav-spacer">
        {children}
      </div>
      <style dangerouslySetInnerHTML={{ 
        __html: `
          nav.dev-nav-visible ~ div.dev-nav-spacer {
            padding-top: 2.75rem !important;
          }
        `
      }} />
    </>
  );
}
