'use client';

import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error?: string;
  onBack: () => void;
}

export function ErrorState({ error, onBack }: ErrorStateProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-medium text-red-800 mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error || 'Candidate not found'}</p>
        <Button onClick={onBack} variant="outline">
          Go Back
        </Button>
      </div>
    </div>
  );
}
