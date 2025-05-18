'use client';

interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;
  
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
      {error}
    </div>
  );
}

export default ErrorDisplay;
