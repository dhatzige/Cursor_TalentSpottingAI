'use client';

interface FilterControlsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterControls({ activeFilter, onFilterChange }: FilterControlsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap gap-2">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-3 py-1 rounded-md text-sm ${
          activeFilter === 'all' 
            ? 'bg-blue-100 text-blue-800 font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        All Applications
      </button>
      <button
        onClick={() => onFilterChange('pending')}
        className={`px-3 py-1 rounded-md text-sm ${
          activeFilter === 'pending' 
            ? 'bg-yellow-100 text-yellow-800 font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Pending
      </button>
      <button
        onClick={() => onFilterChange('interview')}
        className={`px-3 py-1 rounded-md text-sm ${
          activeFilter === 'interview' 
            ? 'bg-blue-100 text-blue-800 font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Interview
      </button>
      <button
        onClick={() => onFilterChange('accepted')}
        className={`px-3 py-1 rounded-md text-sm ${
          activeFilter === 'accepted' 
            ? 'bg-green-100 text-green-800 font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Accepted
      </button>
      <button
        onClick={() => onFilterChange('rejected')}
        className={`px-3 py-1 rounded-md text-sm ${
          activeFilter === 'rejected' 
            ? 'bg-red-100 text-red-800 font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Not Selected
      </button>
    </div>
  );
}

export default FilterControls;
