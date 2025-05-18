'use client';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading applications data...' }: LoadingStateProps) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <span className="ml-3 text-gray-600">{message}</span>
    </div>
  );
}

export default LoadingState;
