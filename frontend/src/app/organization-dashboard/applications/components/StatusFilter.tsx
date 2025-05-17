import { ApplicationStatus, StatusFilterProps } from '../../../../types/application';

export default function StatusFilter({ selectedStatus, onStatusChange }: StatusFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap gap-2">
      <button
        onClick={() => onStatusChange('all')}
        className={`px-3 py-1 rounded-md text-sm ${
          selectedStatus === 'all' 
            ? 'bg-blue-100 text-blue-800 font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onStatusChange('pending')}
        className={`px-3 py-1 rounded-md text-sm ${
          selectedStatus === 'pending' 
            ? 'bg-yellow-100 text-yellow-800 font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Pending
      </button>
      <button
        onClick={() => onStatusChange('interview')}
        className={`px-3 py-1 rounded-md text-sm ${
          selectedStatus === 'interview' 
            ? 'bg-blue-100 text-blue-800 font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Interview
      </button>
      <button
        onClick={() => onStatusChange('accepted')}
        className={`px-3 py-1 rounded-md text-sm ${
          selectedStatus === 'accepted' 
            ? 'bg-green-100 text-green-800 font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Accepted
      </button>
      <button
        onClick={() => onStatusChange('rejected')}
        className={`px-3 py-1 rounded-md text-sm ${
          selectedStatus === 'rejected' 
            ? 'bg-red-100 text-red-800 font-medium' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        Rejected
      </button>
    </div>
  );
}
