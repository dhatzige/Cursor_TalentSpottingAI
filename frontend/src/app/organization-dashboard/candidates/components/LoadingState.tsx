import React from 'react';

export default function LoadingState() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-500">Loading candidates...</p>
    </div>
  );
}
