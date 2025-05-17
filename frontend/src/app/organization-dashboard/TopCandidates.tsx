import Link from 'next/link';
import { Badge } from '../../components/ui/badge';

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
  // Sort candidates by match score (highest first) and limit to top 5
  const sortedCandidates = [...candidates]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
  
  return (
    <div className="overflow-hidden">
      {sortedCandidates.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {sortedCandidates.map((candidate) => (
            <li key={candidate.id} className="p-4 hover:bg-gray-50 transition-colors">
              <Link href={`/organization-dashboard/candidates/${candidate.id}`} className="block">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">{candidate.name}</h3>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        {candidate.matchScore}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{candidate.role}</p>
                    {candidate.university && (
                      <p className="text-xs text-gray-500">{candidate.university}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="px-2 py-0.5 text-gray-500 text-xs">
                        +{candidate.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-blue-600 font-medium">
                      View profile
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-6 text-center text-gray-500">
          <p>No matching candidates found.</p>
        </div>
      )}
      
      {sortedCandidates.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Link 
            href="/organization-dashboard/candidates" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all candidates →
          </Link>
        </div>
      )}
    </div>
  );
}
