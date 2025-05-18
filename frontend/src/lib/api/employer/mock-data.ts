// Mock data for development only
export const MOCK_DATA = {
  stats: {
    activeJobs: 5,
    totalApplicants: 28,
    positionsFilled: 3,
    trends: {
      applicantChange: 15
    }
  },
  jobs: [
    {
      id: 'job1',
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      description: 'We are looking for a skilled Frontend Developer to join our team...',
      postDate: '2025-05-10T10:00:00Z',
      status: 'open',
      applicantCount: 12,
      skills: ['JavaScript', 'React', 'TypeScript', 'HTML/CSS']
    },
    {
      id: 'job2',
      title: 'UX Designer',
      company: 'TechCorp Inc.',
      location: 'Remote',
      description: 'Join our design team to create exceptional user experiences...',
      postDate: '2025-05-08T14:20:00Z',
      status: 'open',
      applicantCount: 8,
      skills: ['Figma', 'UI Design', 'Wireframing', 'User Research']
    },
    {
      id: 'job3',
      title: 'Full Stack Engineer',
      company: 'TechCorp Inc.',
      location: 'New York, NY',
      description: 'Looking for a versatile engineer who can work across the stack...',
      postDate: '2025-05-05T09:15:00Z',
      status: 'closed',
      applicantCount: 22,
      skills: ['JavaScript', 'Node.js', 'React', 'MongoDB']
    }
  ],
  candidates: [
    {
      id: 'candidate1',
      name: 'Alex Johnson',
      role: 'Frontend Developer',
      matchScore: 85,
      university: 'Stanford University',
      skills: ['JavaScript', 'React', 'CSS', 'TypeScript'],
      applicationId: 'app1'
    },
    {
      id: 'candidate2',
      name: 'Jamie Smith',
      role: 'UX/UI Designer',
      matchScore: 78,
      university: 'MIT',
      skills: ['Figma', 'UI Design', 'User Research'],
      applicationId: 'app2'
    },
    {
      id: 'candidate3',
      name: 'Taylor Williams',
      role: 'Full Stack Developer',
      matchScore: 92,
      university: 'UC Berkeley',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      applicationId: 'app3'
    },
    {
      id: 'candidate4',
      name: 'Jordan Miller',
      role: 'Frontend Developer',
      matchScore: 65,
      university: 'UCLA',
      skills: ['HTML/CSS', 'JavaScript', 'Vue.js'],
      applicationId: 'app4'
    },
    { 
      id: 'c1', 
      name: 'John Smith', 
      skills: ['JavaScript', 'React', 'Node.js'], 
      matchScore: 92 
    },
    { 
      id: 'c2', 
      name: 'Emily Johnson', 
      skills: ['Python', 'Django', 'SQL'], 
      matchScore: 85 
    },
    { 
      id: 'c3', 
      name: 'Michael Chen', 
      skills: ['Java', 'Spring', 'Hibernate'], 
      matchScore: 78 
    },
    { 
      id: 'c4', 
      name: 'Sarah Williams', 
      skills: ['JavaScript', 'Angular', 'TypeScript'], 
      matchScore: 88 
    },
    { 
      id: 'c5', 
      name: 'David Rodriguez', 
      skills: ['Python', 'TensorFlow', 'Machine Learning'], 
      matchScore: 95 
    },
    { 
      id: 'c6', 
      name: 'Lisa Kim', 
      skills: ['React', 'Redux', 'CSS'], 
      matchScore: 82 
    },
    { 
      id: 'c7', 
      name: 'Alex Thompson', 
      skills: ['C#', '.NET', 'SQL Server'], 
      matchScore: 75 
    },
    { 
      id: 'c8', 
      name: 'Sophia Martinez', 
      skills: ['Ruby', 'Rails', 'PostgreSQL'], 
      matchScore: 79 
    }
  ],
  applications: [
    {
      id: 'app1',
      jobId: 'job1',
      studentId: 'student1',
      studentName: 'Alex Johnson',
      status: 'pending',
      createdAt: '2025-05-15T14:30:00Z',
      updatedAt: '2025-05-15T14:30:00Z',
      resumeUrl: '/resume/alex-johnson.pdf',
      coverLetter: 'I am excited to apply for the Frontend Developer position at TechCorp. With my experience in React and modern JavaScript, I believe I could bring value to your team...',
      skills: ['JavaScript', 'React', 'CSS', 'TypeScript'],
      university: 'Stanford University',
      matchScore: 85
    },
    {
      id: 'app2',
      jobId: 'job1',
      studentId: 'student2',
      studentName: 'Jamie Smith',
      status: 'interview',
      createdAt: '2025-05-14T09:15:00Z',
      updatedAt: '2025-05-15T10:20:00Z',
      resumeUrl: '/resume/jamie-smith.pdf',
      coverLetter: 'As a recent graduate with a strong foundation in web development and a passion for creating intuitive user experiences, I am applying for the Frontend Developer role...',
      skills: ['JavaScript', 'Vue.js', 'HTML/CSS', 'UX Design'],
      university: 'MIT',
      matchScore: 78
    },
    {
      id: 'app3',
      jobId: 'job1',
      studentId: 'student3',
      studentName: 'Taylor Williams',
      status: 'accepted',
      createdAt: '2025-05-10T11:45:00Z',
      updatedAt: '2025-05-15T09:30:00Z',
      resumeUrl: '/resume/taylor-williams.pdf',
      coverLetter: 'I would like to express my interest in the Frontend Developer position. I have three years of experience building responsive web applications...',
      skills: ['JavaScript', 'React', 'Redux', 'Tailwind CSS'],
      university: 'UC Berkeley',
      matchScore: 92,
      feedback: 'Excellent technical skills and a great fit for our team culture. We are excited to have you join us!'
    },
    {
      id: 'app4',
      jobId: 'job1',
      studentId: 'student4',
      studentName: 'Jordan Miller',
      status: 'rejected',
      createdAt: '2025-05-08T15:20:00Z',
      updatedAt: '2025-05-15T11:15:00Z',
      resumeUrl: '/resume/jordan-miller.pdf',
      coverLetter: 'I am writing to apply for the Frontend Developer position at TechCorp. I have a background in graphic design and recently completed a coding bootcamp...',
      skills: ['HTML/CSS', 'JavaScript', 'Figma'],
      university: 'UCLA',
      matchScore: 65,
      feedback: 'Thank you for your application. While we were impressed with your design skills, we are looking for candidates with more experience in frontend frameworks.'
    }
  ]
};
