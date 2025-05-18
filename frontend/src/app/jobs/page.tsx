'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import SearchBar from '@/components/home/SearchBar';

export default function JobsPage() {
  const [filters, setFilters] = useState({
    role: '',
    location: '',
    experience: '',
    remote: false
  });
  
  // Mock job data
  const jobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      description: 'We are looking for an experienced React developer to join our team...',
      salary: '$120,000 - $150,000',
      remote: true,
      posted: '2 days ago',
      tags: ['React', 'TypeScript', 'Node.js']
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'DesignHub',
      location: 'New York, NY',
      description: 'Join our creative team to design beautiful and intuitive interfaces...',
      salary: '$90,000 - $120,000',
      remote: true,
      posted: '1 week ago',
      tags: ['Figma', 'Adobe XD', 'UI/UX']
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'DataWorks',
      location: 'Seattle, WA',
      description: 'Looking for a data scientist with experience in machine learning...',
      salary: '$130,000 - $160,000',
      remote: false,
      posted: '3 days ago',
      tags: ['Python', 'Machine Learning', 'SQL']
    },
    {
      id: 4,
      title: 'Full Stack Developer',
      company: 'WebSolutions',
      location: 'Austin, TX',
      description: 'Develop and maintain web applications using modern technologies...',
      salary: '$100,000 - $130,000',
      remote: true,
      posted: '5 days ago',
      tags: ['JavaScript', 'React', 'Node.js', 'MongoDB']
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Remote',
      description: 'Help us build and maintain our cloud infrastructure...',
      salary: '$110,000 - $140,000',
      remote: true,
      posted: '1 day ago',
      tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-6">Browse Jobs</h1>
          <div className="mb-8">
            <SearchBar className="max-w-3xl" />
          </div>
          
          <div className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role/Title</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-[#0d1424] border border-gray-700 rounded text-white"
                  placeholder="e.g. Developer, Designer"
                  value={filters.role}
                  onChange={(e: any) => setFilters({...filters, role: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-[#0d1424] border border-gray-700 rounded text-white"
                  placeholder="e.g. San Francisco, Remote"
                  value={filters.location}
                  onChange={(e: any) => setFilters({...filters, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Experience</label>
                <select 
                  className="w-full px-3 py-2 bg-[#0d1424] border border-gray-700 rounded text-white"
                  value={filters.experience}
                  onChange={(e: any) => setFilters({...filters, experience: e.target.value})}
                >
                  <option value="">All Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="exec">Executive</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="mr-2 h-5 w-5"
                    checked={filters.remote}
                    onChange={(e: any) => setFilters({...filters, remote: e.target.checked})}
                  />
                  <span>Remote Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-[#131b39]/50 p-6 rounded-lg border border-gray-800 hover:border-blue-500 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">{job.title}</h2>
                  <p className="text-blue-400">{job.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-300">{job.salary}</p>
                  <p className="text-sm text-gray-400">Posted {job.posted}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-300">{job.location}</span>
                  {job.remote && (
                    <span className="ml-3 text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded">Remote</span>
                  )}
                </div>
                <p className="text-gray-300 line-clamp-2">{job.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
