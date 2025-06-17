'use client';

interface JobStatusBadgeProps {
  status: 'open' | 'closed' | 'draft';
}

export default function JobStatusBadge({ status }: JobStatusBadgeProps) {
  // Determine badge styles based on status
  const getBadgeStyles = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeStyles(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
