'use client';

import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface Education {
  degree?: string;
  fieldOfStudy?: string;
  institution?: string;
  graduationYear?: number;
  description?: string;
}

interface EducationTabProps {
  educations: Education[];
}

export function EducationTab({ educations }: EducationTabProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Education</h2>
      {educations.length === 0 ? (
        <p className="text-gray-500">No education listed</p>
      ) : (
        <div className="space-y-6">
          {educations.map((edu, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-medium">
                    {edu.degree && edu.fieldOfStudy 
                      ? `${edu.degree} in ${edu.fieldOfStudy}`
                      : (edu.degree || edu.fieldOfStudy || 'Degree')}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <BookOpen size={14} />
                    <span>{edu.institution || 'Institution'}</span>
                  </div>
                </div>
                {edu.graduationYear && (
                  <div className="text-sm text-gray-500">
                    Graduated {edu.graduationYear}
                  </div>
                )}
              </div>
              
              {edu.description && (
                <p className="text-gray-700 text-sm mt-2">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
