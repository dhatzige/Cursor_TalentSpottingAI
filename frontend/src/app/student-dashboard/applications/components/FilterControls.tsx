'use client';

interface FilterControlsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterControls({ activeFilter, onFilterChange }: FilterControlsProps) {
  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm mb-4 flex flex-wrap gap-2" data-component-name="FilterControls">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-3 py-1 rounded-md text-sm ${
          activeFilter === 'all' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700/50 dark:text-gray-200 dark:hover:bg-slate-600/70'
        }`}
      >
        All Applications
      </button>
      <button
        onClick={() => onFilterChange('pending')}
        className={`px-3 py-1 rounded-md text-sm ${
          activeFilter === 'pending' 
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600/70 dark:text-white font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700/50 dark:text-gray-200 dark:hover:bg-slate-600/70'
        }`}
      >
        Pending
      </button>
      <button
        onClick={() => onFilterChange('reviewing')}
        className={`px-3 py-1 rounded-md text-sm ${
          activeFilter === 'reviewing' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700/50 dark:text-gray-200 dark:hover:bg-slate-600/70'
        }`}
      >
        Reviewing
      </button>
      <button
        onClick={() => onFilterChange('interview')}
        className={`px-3 py-1 rounded-md text-sm ${
          activeFilter === 'interview' 
            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-600/70 dark:text-white font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700/50 dark:text-gray-200 dark:hover:bg-slate-600/70'
        }`}
      >
        Interview
      </button>
      <button
        onClick={() => onFilterChange('accepted')}
        className={`px-3 py-1 rounded-md text-sm ${
          activeFilter === 'accepted' 
            ? 'bg-green-100 text-green-800 dark:bg-green-600/70 dark:text-white font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700/50 dark:text-gray-200 dark:hover:bg-slate-600/70'
        }`}
      >
        Accepted
      </button>
      <button
        onClick={() => onFilterChange('rejected')}
        className={`px-3 py-1 rounded-md text-sm ${
          activeFilter === 'rejected' 
            ? 'bg-red-100 text-red-800 dark:bg-red-600/70 dark:text-white font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700/50 dark:text-gray-200 dark:hover:bg-slate-600/70'
        }`}
      >
        Not Selected
      </button>
    </div>
  );
}

export default FilterControls;
