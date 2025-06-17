'use client';

import { useState } from 'react';
import Button from '../../../components/Button';
import StatusBadge from './StatusBadge';
import CandidateScoreCard from './CandidateScoreCard';
import { Application, ApplicationStatus, ApplicationDetailsProps, Note } from '../../../../types/application';

export default function ApplicationDetails({
  application,
  onStatusUpdate,
  onAddNote,
  onClose,
  isEmployer = true
}: ApplicationDetailsProps) {
  const [feedback, setFeedback] = useState(application.feedback || '');
  const [noteContent, setNoteContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleUpdateStatus = async (newStatus: ApplicationStatus) => {
    if (!onStatusUpdate) return;
    
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      await onStatusUpdate(application.id, newStatus, feedback);
    } catch (err: any) {
      console.error('Error updating application status:', err);
      setUpdateError('Failed to update status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleAddNote = async () => {
    if (!onAddNote || !noteContent.trim()) return;
    
    setIsAddingNote(true);
    setUpdateError(null);
    
    try {
      await onAddNote(application.id, noteContent);
      setNoteContent(''); // Clear note content after successful submission
    } catch (err: any) {
      console.error('Error adding note:', err);
      setUpdateError('Failed to add note. Please try again.');
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">{application.studentName}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{application.university || 'University not specified'}</p>
            <StatusBadge status={application.status} />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Applied: {new Date(application.createdAt).toLocaleDateString()}
            </div>
            {application.matchScore && (
              <div className="bg-blue-100 text-blue-800 dark:bg-blue-700/50 dark:text-blue-200 px-2 py-1 rounded text-sm font-medium inline-block">
                {application.matchScore}% Match
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhanced Candidate Scoring Card */}
      {application.scores ? (
        <div className="p-6 border-b border-gray-200">
          <CandidateScoreCard scores={application.scores} />
        </div>
      ) : application.matchScore !== undefined ? (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Match Score</h3>
          <div className="flex items-center">
            <div className={`text-xl font-bold rounded-full w-12 h-12 flex items-center justify-center ${application.matchScore >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-700/50 dark:text-green-200' : application.matchScore >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700/50 dark:text-yellow-200' : 'bg-red-100 text-red-800 dark:bg-red-700/50 dark:text-red-200'}`}>
              {application.matchScore}%
            </div>
            <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">Basic skills match</p>
          </div>
        </div>
      ) : null}

      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {application.skills ? (
            application.skills.map(skill => (
              <span 
                key={skill} 
                className="px-2 py-1 bg-gray-100 text-gray-800 dark:text-gray-200 text-xs font-medium rounded"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No skills listed</p>
          )}
        </div>
      </div>
      
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium mb-3">Cover Letter</h3>
        <div className="bg-gray-50 p-4 rounded-md text-sm">
          {application.coverLetter || 'No cover letter provided.'}
        </div>
      </div>
      
      {isEmployer && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Notes</h3>
          </div>
          
          {/* Display existing notes */}
          {application.notes && application.notes.length > 0 ? (
            <div className="mb-4">
              {application.notes.map((note: Note) => (
                <div key={note.id} className="mb-3 bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{note.createdBy}</span>
                    <span>{new Date(note.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm">{note.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-4">No notes yet</p>
          )}
          
          {/* Add new note */}
          <div>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 min-h-[80px] mb-2"
              placeholder="Add a note about this application"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleAddNote}
                disabled={isAddingNote || !noteContent.trim()}
              >
                {isAddingNote ? 'Adding...' : 'Add Note'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {application.resumeUrl && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium mb-3">Resume</h3>
          <a 
            href={application.resumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            View Resume
          </a>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Application Status</h3>
          {onClose && (
            <Button 
              variant="outline" 
              onClick={onClose}
              className="text-sm"
            >
              Close
            </Button>
          )}
        </div>
        
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 min-h-[100px]"
          placeholder="Provide feedback to the candidate (they will see this if accepted or rejected)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        
        {updateError && (
          <div className="mt-2 text-sm text-red-600">
            {updateError}
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <Button
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => handleUpdateStatus('rejected')}
            disabled={isUpdating || application.status === 'rejected'}
          >
            Reject
          </Button>
          <Button
            variant="outline"
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
            onClick={() => handleUpdateStatus('reviewing')}
            disabled={isUpdating || application.status === 'reviewing'}
          >
            Mark for Review
          </Button>
          <Button
            variant="outline" 
            className="text-purple-600 border-purple-300 hover:bg-purple-50"
            onClick={() => handleUpdateStatus('interview')}
            disabled={isUpdating || application.status === 'interview'}
          >
            Schedule Interview
          </Button>
          <Button
            onClick={() => handleUpdateStatus('accepted')}
            disabled={isUpdating || application.status === 'accepted'}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
