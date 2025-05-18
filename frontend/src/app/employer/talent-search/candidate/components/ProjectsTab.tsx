'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface Project {
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
}

interface ProjectsTabProps {
  projects: Project[];
}

export function ProjectsTab({ projects }: ProjectsTabProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects listed</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-4">
              {project.imageUrl && (
                <div className="mb-3 relative h-40 w-full overflow-hidden rounded-lg">
                  <Image
                    src={project.imageUrl}
                    alt={project.title || 'Project'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <h3 className="font-medium mb-1">{project.title || 'Project'}</h3>
              
              {project.description && (
                <p className="text-sm text-gray-700 mb-2">{project.description}</p>
              )}
              
              {project.url && (
                <a 
                  href={project.url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
