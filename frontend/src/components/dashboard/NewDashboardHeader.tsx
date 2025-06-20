'use client';

import { UserButton } from '@clerk/nextjs';

const NewDashboardHeader = () => {
  return (
    <header className="flex h-16 items-center justify-end border-b border-gray-800 bg-gray-900/40 px-6 shrink-0">
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};

export default NewDashboardHeader;
