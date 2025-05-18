'use client';

import { JobStatus } from './types';

interface JobStatusControlProps {
  currentStatus: JobStatus;
  onStatusChange: (status: JobStatus) => void;
}

/**
 * JobStatusControl - Component for managing job status
 * 
 * Provides UI for changing a job's status between draft, open, and closed
 */
export function JobStatusControl({ 
  currentStatus, 
  onStatusChange 
}: JobStatusControlProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Job Status
      </label>
      <div className="flex space-x-4">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            currentStatus === 'draft' 
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onStatusChange('draft')}
        >
          Draft
        </button>
        
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            currentStatus === 'open' 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onStatusChange('open')}
        >
          Open
        </button>
        
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            currentStatus === 'closed' 
              ? 'bg-red-100 text-red-800 border border-red-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => onStatusChange('closed')}
        >
          Closed
        </button>
      </div>
    </div>
  );
}

export default JobStatusControl;
