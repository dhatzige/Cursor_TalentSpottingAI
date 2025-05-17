'use client';

import StatusBadge from './StatusBadge';
import { Application, ApplicationsListProps } from '../../../../types/application';

export default function ApplicationsList({
  applications,
  selectedApplicationId,
  onSelectApplication,
  isEmployer = true
}: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No applications match the selected filter.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
      {applications.map(application => (
        <div 
          key={application.id} 
          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
            selectedApplicationId === application.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onSelectApplication(application.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{application.studentName}</h3>
              <p className="text-sm text-gray-500">
                {application.university || 'University not specified'}
              </p>
              <div className="mt-1">
                <StatusBadge status={application.status} />
                {application.matchScore && (
                  <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {application.matchScore}% Match
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(application.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
