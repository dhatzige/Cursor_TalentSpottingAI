'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Mail, MapPin, Calendar } from 'lucide-react';

interface ProfileSidebarProps {
  candidate: {
    firstName: string;
    lastName: string;
    profileImage?: string;
    email?: string;
    bio?: string;
    city?: string;
    country?: string;
    skills: string[];
    languages: Array<{
      name: string;
      proficiency?: string;
    }>;
    availableFrom?: Date;
    matchScore?: number | null;
  };
  formatDate: (date: Date | string | undefined | null) => string;
}

export function ProfileSidebar({ candidate, formatDate }: ProfileSidebarProps) {
  return (
    <Card className="p-6">
      {/* Profile header */}
      <div className="flex flex-col items-center mb-6 text-center">
        {candidate.profileImage ? (
          <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4">
            <Image
              src={candidate.profileImage}
              alt={`${candidate.firstName} ${candidate.lastName}`}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl text-gray-500 font-medium">
              {candidate.firstName.charAt(0)}
              {candidate.lastName.charAt(0)}
            </span>
          </div>
        )}

        <h1 className="text-2xl font-bold">
          {candidate.firstName} {candidate.lastName}
        </h1>
        
        {/* Match score */}
        {candidate.matchScore !== undefined && candidate.matchScore !== null && (
          <div className="mt-2 mb-2">
            <span className={`inline-block text-sm font-semibold rounded-full px-3 py-1 ${
              candidate.matchScore >= 80 ? 'bg-green-100 text-green-800' :
              candidate.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-600'
            }`}>
              {candidate.matchScore}% Match
            </span>
          </div>
        )}
        
        {/* Bio */}
        {candidate.bio && (
          <p className="text-gray-600 mt-2">{candidate.bio}</p>
        )}
      </div>
      
      {/* Contact info */}
      <div className="space-y-3 mb-6">
        {candidate.email && (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-500" />
            <span className="text-gray-800">{candidate.email}</span>
          </div>
        )}
        
        {(candidate.city || candidate.country) && (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <span className="text-gray-800">
              {[candidate.city, candidate.country].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
        
        {candidate.availableFrom && (
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-gray-800">
              Available from {formatDate(candidate.availableFrom)}
            </span>
          </div>
        )}
      </div>
      
      {/* Skills */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Skills</h3>
        <div className="flex flex-wrap gap-1">
          {candidate.skills.map((skill, index) => (
            <div key={index} className="inline-block">
              <Badge className="mb-1 mr-1" children={skill} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Languages */}
      {candidate.languages.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Languages</h3>
          <ul className="space-y-1">
            {candidate.languages.map((language, index) => (
              <li key={index} className="flex justify-between">
                <span>{language.name}</span>
                {language.proficiency && (
                  <span className="text-sm text-gray-500">{language.proficiency}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
