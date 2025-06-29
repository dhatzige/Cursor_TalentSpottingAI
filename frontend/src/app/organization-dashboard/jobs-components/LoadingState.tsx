'use client';

export function LoadingState() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-500">Loading job postings...</p>
    </div>
  );
}
