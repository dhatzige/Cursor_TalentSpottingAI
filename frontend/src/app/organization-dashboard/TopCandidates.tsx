// Reference: Organization_dashboard.jpg
import Link from 'next/link';
import Button from '../components/Button';

interface Candidate {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  university?: string;
  skills: string[];
}

interface TopCandidatesProps {
  candidates: Candidate[];
}

export default function TopCandidates({ candidates }: TopCandidatesProps) {
  // Sort candidates by match score (highest first)
  const sortedCandidates = [...candidates].sort((a, b) => b.matchScore - a.matchScore);
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Top Candidates</h3>
        <Link 
          href="/organization-dashboard/candidates" 
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View all
        </Link>
      </div>
      
      <div className="p-5">
        {sortedCandidates.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {sortedCandidates.slice(0, 5).map((candidate) => (
              <li key={candidate.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-base font-medium text-gray-900">{candidate.name}</h4>
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {candidate.matchScore}% match
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{candidate.role}</p>
                    {candidate.university && (
                      <p className="text-xs text-gray-500">{candidate.university}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, index) => (
                        <span 
                          key={index}
                          className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="px-2 py-0.5 text-gray-500 text-xs">
                          +{candidate.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 self-start md:self-center">
                    <Link href={`/organization-dashboard/candidates/${candidate.id}`}>
                      <Button variant="primary">View Profile</Button>
                    </Link>
                    <Link 
                      href={`/organization-dashboard/messages/new?candidateId=${candidate.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No matching candidates found.
          </div>
        )}
      </div>
    </div>
  );
}
