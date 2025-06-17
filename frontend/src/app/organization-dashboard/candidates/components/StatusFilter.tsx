import React from 'react';

type StatusOption = 'all' | 'highMatch' | 'mediumMatch' | 'lowMatch';

interface StatusFilterProps {
  currentStatus: StatusOption;
  onChange: (status: StatusOption) => void;
}

export default function StatusFilter({ currentStatus, onChange }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`px-3 py-1.5 text-sm rounded-md ${
          currentStatus === 'all'
            ? 'bg-blue-100 text-blue-800 font-medium'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All Candidates
      </button>
      <button
        onClick={() => onChange('highMatch')}
        className={`px-3 py-1.5 text-sm rounded-md ${
          currentStatus === 'highMatch'
            ? 'bg-green-100 text-green-800 font-medium'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        High Match (80%+)
      </button>
      <button
        onClick={() => onChange('mediumMatch')}
        className={`px-3 py-1.5 text-sm rounded-md ${
          currentStatus === 'mediumMatch'
            ? 'bg-yellow-100 text-yellow-800 font-medium'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Medium Match (60-79%)
      </button>
      <button
        onClick={() => onChange('lowMatch')}
        className={`px-3 py-1.5 text-sm rounded-md ${
          currentStatus === 'lowMatch'
            ? 'bg-gray-300 text-gray-800 font-medium'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Low Match (&lt; 60%)
      </button>
    </div>
  );
}
