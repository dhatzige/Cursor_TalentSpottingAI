'use client';

import { ApplicationItem } from './types';

interface StatusBadgeProps {
  status: ApplicationItem['status'];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
    reviewing: { color: 'bg-indigo-100 text-indigo-800', label: 'Under Review' },
    interview: { color: 'bg-blue-100 text-blue-800', label: 'Interview Stage' },
    accepted: { color: 'bg-green-100 text-green-800', label: 'Accepted' },
    rejected: { color: 'bg-red-100 text-red-800', label: 'Not Selected' }
  } as const;
  
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

export default StatusBadge;
