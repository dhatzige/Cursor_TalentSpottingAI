// Mock data for student dashboard (development only)

export const STUDENT_MOCK_DATA = {
  stats: {
    profileCompletion: 72,
    applicationsSubmitted: 6,
    jobsViewed: 34
  },
  jobs: [
    {
      id: 'job1',
      title: 'Frontend Developer Intern',
      company: 'TechCorp',
      location: 'Remote',
      postDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      matchScore: 88,
      applied: false
    },
    {
      id: 'job2',
      title: 'Data Analyst',
      company: 'DataVision',
      location: 'New York, NY',
      postDate: new Date(Date.now() - 86400000 * 4).toISOString(),
      matchScore: 75,
      applied: true
    }
  ],
  applications: [
    {
      id: 'app1',
      title: 'Backend Engineer Intern',
      company: 'Cloudify',
      status: 'pending',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'app2',
      title: 'QA Tester',
      company: 'GameStudio',
      status: 'interview',
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ]
} as const;
