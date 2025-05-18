'use client';

import React from 'react';
import { Job } from '@/lib/data/mockJobs';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 hover:border-blue-500 transition-colors cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-bold text-white hover:text-blue-400">{job.title}</h2>
          <p className="text-gray-300">{job.company} • {job.location}</p>
        </div>
        <span className={`px-3 py-1 text-xs rounded-full ${job.remote ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}>
          {job.remote ? 'Remote' : 'On-site'}
        </span>
      </div>
      
      <p className="text-gray-300 line-clamp-2 mb-4">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.jobType && <span className="px-2 py-1 text-xs bg-[#1e2a4a] text-gray-300 rounded">{job.jobType}</span>}
        {job.experienceLevel && <span className="px-2 py-1 text-xs bg-[#1e2a4a] text-gray-300 rounded">{job.experienceLevel}</span>}
        {job.salary && <span className="px-2 py-1 text-xs bg-[#1e2a4a] text-blue-300 rounded">{job.salary}</span>}
        <span className="px-2 py-1 text-xs bg-[#1e2a4a] text-gray-300 rounded">{job.postedRelative || job.posted}</span>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {job.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 text-xs bg-blue-900/30 text-blue-300 border border-blue-800 rounded-md">{tag}</span>
        ))}
      </div>
    </div>
  );
}
