'use client';

interface JobsHeaderProps {
  showJobForm: boolean;
  onBack: () => void;
  onCreateJob: () => void;
}

export function JobsHeader({ showJobForm, onBack, onCreateJob }: JobsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <button 
          onClick={onBack}
          className="mr-3 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold">Manage Job Postings</h1>
      </div>
      {!showJobForm && (
        <button 
          onClick={onCreateJob}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Job Posting
          </span>
        </button>
      )}
    </div>
  );
}
