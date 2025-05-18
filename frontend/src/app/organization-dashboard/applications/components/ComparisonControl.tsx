'use client';

import Button from '../../../components/Button';
import { useRouter } from 'next/navigation';

interface ComparisonControlProps {
  applications: any[];
  jobId: string | null;
  onCompareStart: () => void;
}

export function ComparisonControl({ applications, jobId, onCompareStart }: ComparisonControlProps) {
  const router = useRouter();
  
  if (applications.length <= 1) return null;
  
  const handleCompareClick = () => {
    onCompareStart();
    // Add compare parameter to URL
    const appIds = applications.slice(0, 3).map(a => a.id).join(',');
    router.push(`/organization-dashboard/applications?compare=${appIds}`);
  };
  
  return (
    <div className="mb-6">
      <Button
        variant="outline"
        onClick={handleCompareClick}
      >
        Compare Top Candidates
      </Button>
    </div>
  );
}

export default ComparisonControl;
