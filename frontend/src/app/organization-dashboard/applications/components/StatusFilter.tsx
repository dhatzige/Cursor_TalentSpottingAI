import { ApplicationStatus, StatusFilterProps } from '../../../../types/application';

export default function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm mb-4 flex flex-wrap gap-2" data-component-name="StatusFilter">
      <button
        onClick={() => onStatusChange('all')}
        className={`px-3 py-1 rounded-md text-sm ${
          selectedStatus === 'all' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700/50 dark:text-gray-200 dark:hover:bg-slate-600/70'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onStatusChange('pending')}
        className={`px-3 py-1 rounded-md text-sm ${
          selectedStatus === 'pending' 
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600/70 dark:text-white font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700/50 dark:text-gray-200 dark:hover:bg-slate-600/70'
        }`}
      >
        Pending
      </button>
      <button
        onClick={() => onStatusChange('interview')}
        className={`px-3 py-1 rounded-md text-sm ${
          selectedStatus === 'interview' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700/50 dark:text-gray-200 dark:hover:bg-slate-600/70'
        }`}
      >
        Interview
      </button>
      <button
        onClick={() => onStatusChange('accepted')}
        className={`px-3 py-1 rounded-md text-sm ${
          selectedStatus === 'accepted' 
            ? 'bg-green-100 text-green-800 dark:bg-green-600/70 dark:text-white font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700/50 dark:text-gray-200 dark:hover:bg-slate-600/70'
        }`}
      >
        Accepted
      </button>
      <button
        onClick={() => onStatusChange('rejected')}
        className={`px-3 py-1 rounded-md text-sm ${
          selectedStatus === 'rejected' 
            ? 'bg-red-100 text-red-800 dark:bg-red-600/70 dark:text-white font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-slate-700/50 dark:text-gray-200 dark:hover:bg-slate-600/70'
        }`}
      >
        Rejected
      </button>
    </div>
  );
}
