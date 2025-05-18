'use client';

export function NoSelectedApplicationState() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No application selected</h3>
      <p className="text-gray-500">
        Select an application from the list to view details
      </p>
    </div>
  );
}

export default NoSelectedApplicationState;
