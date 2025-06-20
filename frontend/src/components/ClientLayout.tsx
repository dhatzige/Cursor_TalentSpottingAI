'use client';

import React from 'react';
import DevNavBar from '../app/components/DevNavBar';
import Header from './Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <DevNavBar />
      <main className="pt-16"> {/* Spacing for the fixed header */}
        <div className="dev-nav-spacer">
          {children}
        </div>
      </main>
      {/* This style ensures the DevNavBar also adds spacing when it's visible */}
      <style dangerouslySetInnerHTML={{
        __html: `
          body.dev-nav-visible main {
            padding-top: calc(4rem + 2.75rem); /* Header height + DevNav height */
          }
        `
      }} />
    </>
  );
}
