'use client';

import Link from 'next/link';
import Button from '../../../components/Button';
import StatusBadge from './StatusBadge';
import { ApplicationItem as ApplicationItemType } from './types';

interface ApplicationItemProps {
  application: ApplicationItemType;
}

export function ApplicationItem({ application }: ApplicationItemProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {application.title}
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              {application.company} • {application.location}
            </p>
            <div className="mb-2">
              <StatusBadge status={application.status} />
            </div>
            <p className="text-sm text-gray-500">
              Applied: {new Date(application.appliedDate).toLocaleDateString()}
              {application.lastUpdated !== application.appliedDate && (
                <span> • Updated: {new Date(application.lastUpdated).toLocaleDateString()}</span>
              )}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Link href={`/job-application?id=${application.jobId}`}>
              <Button variant="outline" className="text-sm px-4 py-2">
                View Job
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Feedback section for accepted/rejected applications */}
        {(application.status === 'accepted' || application.status === 'rejected') && application.feedback && (
          <div className={`mt-4 p-3 rounded-md ${
            application.status === 'accepted' ? 'bg-green-50' : 'bg-gray-50'
          }`}>
            <h4 className="text-sm font-medium mb-1">Feedback from Employer</h4>
            <p className="text-sm">{application.feedback}</p>
          </div>
        )}
        
        {/* Interview section */}
        {application.status === 'interview' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <h4 className="text-sm font-medium mb-1">Interview Status</h4>
            <p className="text-sm">Your application is being reviewed for an interview. Check your email for further instructions.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationItem;
