import React from 'react';
import { Card } from '@/components/ui/card';
import { Building } from 'lucide-react';

interface Experience {
  title?: string;
  company?: string;
  location?: string;
  startDate?: Date | string;
  endDate?: Date | string | null;
  description?: string;
}

interface ExperienceTabProps {
  experiences: Experience[];
  formatDate: (date: Date | string | undefined | null) => string;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ experiences, formatDate }) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
      {experiences.length === 0 ? (
        <p className="text-gray-500">No experience listed</p>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-medium">{exp.title || 'Position'}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Building size={14} />
                    <span>{exp.company || 'Company'}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </div>
              </div>
              
              {exp.location && (
                <div className="text-sm text-gray-600 mb-2">{exp.location}</div>
              )}
              
              {exp.description && (
                <p className="text-gray-700 text-sm mt-2">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ExperienceTab;
