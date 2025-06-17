'use client';

export function NoMatchingApplications() {
  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg text-center text-gray-500">
      No applications match the selected filter.
    </div>
  );
}

export default NoMatchingApplications;
