'use client';

interface ComparisonHeaderProps {
  applicationsCount: number;
  selectedCount: number;
  onClose: () => void;
}

export default function ComparisonHeader({
  applicationsCount,
  selectedCount,
  onClose
}: ComparisonHeaderProps) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Candidate Comparison</h2>
        <p className="text-sm text-gray-600">
          {selectedCount === 0 
            ? `Select up to 3 candidates to compare (${applicationsCount} total applications)`
            : `Comparing ${selectedCount} of ${applicationsCount} candidates`
          }
        </p>
      </div>
      
      <button
        onClick={onClose}
        className="text-gray-600 hover:text-gray-800 p-2"
        aria-label="Close comparison view"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
