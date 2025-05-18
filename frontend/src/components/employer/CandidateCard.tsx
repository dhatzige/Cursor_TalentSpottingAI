import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  city?: string;
  country?: string;
  education: Array<{
    degree?: string;
    fieldOfStudy?: string;
    institution?: string;
    graduationYear?: number;
  }>;
  skills: string[];
  languages: Array<{
    name: string;
    proficiency?: string;
  }>;
  availableFrom?: Date;
  matchScore?: number | null;
}

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  // Get the latest education entry
  const latestEducation = candidate.education.length > 0 ? candidate.education[0] : null;
  
  // Format match score for display
  const formattedMatchScore = candidate.matchScore !== null && candidate.matchScore !== undefined 
    ? `${candidate.matchScore}%` 
    : 'N/A';
  
  // Format location
  const location = [candidate.city, candidate.country].filter(Boolean).join(', ');
  
  // Calculate skill display limit
  const displaySkills = candidate.skills.slice(0, 5);
  const additionalSkillsCount = candidate.skills.length - displaySkills.length;
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex">
        {/* Candidate Image */}
        <div className="mr-4 flex-shrink-0">
          {candidate.profileImage ? (
            <div className="relative h-16 w-16 rounded-full overflow-hidden">
              <Image
                src={candidate.profileImage}
                alt={`${candidate.firstName} ${candidate.lastName}`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-lg text-gray-500 font-medium">
                {candidate.firstName.charAt(0)}
                {candidate.lastName.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          {/* Header with name and match score */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium">
              {candidate.firstName} {candidate.lastName}
            </h3>
            
            {candidate.matchScore !== undefined && candidate.matchScore !== null && (
              <div className="flex items-center">
                <div className={`text-sm font-semibold rounded-full px-2 py-1 ${
                  candidate.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                  candidate.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {formattedMatchScore}
                </div>
              </div>
            )}
          </div>
          
          {/* Education and Location */}
          <div className="text-sm text-gray-600 mb-2">
            {latestEducation && (
              <div className="mb-1">
                {latestEducation.degree && latestEducation.fieldOfStudy && (
                  <span>{latestEducation.degree}, {latestEducation.fieldOfStudy}</span>
                )}
                {latestEducation.institution && (
                  <span> • {latestEducation.institution}</span>
                )}
              </div>
            )}
            
            {location && (
              <div>{location}</div>
            )}
          </div>
          
          {/* Skills */}
          <div className="flex flex-wrap gap-1 mt-2">
            {displaySkills.map((skill, index) => (
              <Badge key={index} variant="default" className="mr-1 mb-1">
                {skill}
              </Badge>
            ))}
            {additionalSkillsCount > 0 && (
              <Badge variant="outline" className="mb-1">
                +{additionalSkillsCount} more
              </Badge>
            )}
          </div>
          
          {/* Available from */}
          {candidate.availableFrom && (
            <div className="mt-2 text-xs text-gray-500">
              Available from: {new Date(candidate.availableFrom).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CandidateCard;
