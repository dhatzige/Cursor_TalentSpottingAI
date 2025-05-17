// Reference: University_dashboard.jpg
import Link from 'next/link';
import Button from '../components/Button';

interface Employer {
  id: string;
  name: string;
  industry: string;
  hiringStatus: 'active' | 'inactive';
  openPositions: number;
  studentsHired: number;
  logo?: string;
}

interface EmployerPartnersProps {
  employers: Employer[];
}

export default function EmployerPartners({ employers }: EmployerPartnersProps) {
  // Sort employers by those with active hiring first, then by openPositions
  const sortedEmployers = [...employers].sort((a, b) => {
    if (a.hiringStatus === 'active' && b.hiringStatus !== 'active') return -1;
    if (a.hiringStatus !== 'active' && b.hiringStatus === 'active') return 1;
    return b.openPositions - a.openPositions;
  });
  
  return (
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Employer Partners</h3>
        <Link 
          href="/university-dashboard/employers" 
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          View all
        </Link>
      </div>
      
      <div className="p-5">
        {sortedEmployers.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {sortedEmployers.slice(0, 5).map((employer) => (
              <li key={employer.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-base font-medium text-gray-900">{employer.name}</h4>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        employer.hiringStatus === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {employer.hiringStatus === 'active' ? 'Hiring' : 'Not Hiring'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{employer.industry}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                      <span>{employer.openPositions} open positions</span>
                      <span>{employer.studentsHired} students hired</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 self-start sm:self-center">
                    <Link href={`/university-dashboard/employers/${employer.id}`}>
                      <Button variant="primary">View Details</Button>
                    </Link>
                    <Link 
                      href={`/university-dashboard/messages/new?employerId=${employer.id}`}
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
            No employer partners found.
          </div>
        )}
      </div>
    </div>
  );
}
