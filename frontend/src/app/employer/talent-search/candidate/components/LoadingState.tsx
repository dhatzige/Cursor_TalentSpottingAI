'use client';

import { Loader } from '@/components/ui/loader';

export function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader size="lg" />
    </div>
  );
}
