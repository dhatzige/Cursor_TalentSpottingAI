'use client';

import { Application, ApplicationStatus } from '../../../../types/application';
import ApplicationsList from './ApplicationsList';
import ApplicationDetails from './ApplicationDetails';
import NoApplicationsState from './empty/NoApplicationsState';
import NoSelectedApplicationState from './empty/NoSelectedApplicationState';

interface ApplicationsContentProps {
  applications: Application[];
  selectedApplication: Application | null;
  onSelectApplication: (applicationId: string) => void;
  onStatusUpdate: (applicationId: string, newStatus: ApplicationStatus, feedback?: string) => Promise<void>;
  onAddNote: (applicationId: string, content: string) => Promise<void>;
  onCloseDetails: () => void;
  job: { id: string; title: string; company: string; status: 'open' | 'closed' | 'draft' } | null;
}

export function ApplicationsContent({ 
  applications, 
  selectedApplication, 
  onSelectApplication, 
  onStatusUpdate,
  onAddNote,
  onCloseDetails,
  job
}: ApplicationsContentProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left side: Applications list */}
      <div className="w-full md:w-2/5">
        {applications.length === 0 ? (
          <NoApplicationsState hasJob={!!job} />
        ) : (
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow-md overflow-hidden">
            <ApplicationsList 
              applications={applications}
              selectedApplicationId={selectedApplication?.id}
              onSelectApplication={onSelectApplication}
              isEmployer={true}
            />
          </div>
        )}
      </div>
      
      {/* Right side: Application details */}
      <div className="w-full md:w-3/5">
        {selectedApplication ? (
          <ApplicationDetails 
            application={selectedApplication}
            onStatusUpdate={onStatusUpdate}
            onAddNote={onAddNote}
            onClose={onCloseDetails}
            isEmployer={true}
          />
        ) : (
          <NoSelectedApplicationState />
        )}
      </div>
    </div>
  );
}

export default ApplicationsContent;
