'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          An unexpected error occurred. Our team has been notified.
        </p>
        <Button
          onClick={() => reset()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Try again
        </Button>
      </div>
    </div>
  );
} 