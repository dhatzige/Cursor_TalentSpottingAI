'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function CandidatesTab() {
  const router = useRouter();
  
  return (
    <Card>
      <CardHeader className="border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle>Candidates</CardTitle>
          <button 
            onClick={() => router.push('/organization-dashboard/candidates')}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
          >
            View All Candidates
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-20">
          <button 
            onClick={() => router.push('/organization-dashboard/candidates')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go to Candidates
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
