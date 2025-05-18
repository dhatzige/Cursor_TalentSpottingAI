'use client';

import StatusBadge from '../StatusBadge';
import { Application } from '../../../../../types/application';

interface ApplicationHeaderProps {
  application: Application;
}

export function ApplicationHeader({ application }: ApplicationHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold mb-1">{application.studentName}</h2>
          <p className="text-gray-600 mb-2">{application.university || 'University not specified'}</p>
          <StatusBadge status={application.status} />
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">
            Applied: {new Date(application.createdAt).toLocaleDateString()}
          </div>
          {application.matchScore && (
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium inline-block">
              {application.matchScore}% Match
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationHeader;
