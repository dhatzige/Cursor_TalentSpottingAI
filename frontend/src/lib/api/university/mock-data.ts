// Mock data for university dashboard (development only)
// Ensure this stays under 300 lines to follow project rules

export const UNIVERSITY_MOCK_DATA = {
  metrics: {
    totalStudents: 1240,
    activeStudents: 932,
    placementRate: 78,
    averageSalary: '$65,400'
  },
  placements: [
    {
      degree: 'Computer Science',
      students: 320,
      placed: 290,
      averageSalary: '$72,000',
      trend: 'increasing' as const
    },
    {
      degree: 'Electrical Engineering',
      students: 210,
      placed: 160,
      averageSalary: '$68,500',
      trend: 'stable' as const
    },
    {
      degree: 'Business Administration',
      students: 180,
      placed: 140,
      averageSalary: '$58,700',
      trend: 'decreasing' as const
    },
    {
      degree: 'Mechanical Engineering',
      students: 150,
      placed: 120,
      averageSalary: '$64,200',
      trend: 'increasing' as const
    },
    {
      degree: 'Psychology',
      students: 180,
      placed: 95,
      averageSalary: '$45,000',
      trend: 'stable' as const
    }
  ],
  employers: [
    {
      id: 'emp1',
      name: 'TechCorp Inc.',
      industry: 'Technology',
      hiringStatus: 'active' as const,
      openPositions: 12,
      studentsHired: 45
    },
    {
      id: 'emp2',
      name: 'HealthPlus',
      industry: 'Healthcare',
      hiringStatus: 'active' as const,
      openPositions: 8,
      studentsHired: 30
    },
    {
      id: 'emp3',
      name: 'FinServe LLC',
      industry: 'Finance',
      hiringStatus: 'inactive' as const,
      openPositions: 0,
      studentsHired: 22
    },
    {
      id: 'emp4',
      name: 'GreenEnergy Co.',
      industry: 'Renewable Energy',
      hiringStatus: 'active' as const,
      openPositions: 5,
      studentsHired: 18
    },
    {
      id: 'emp5',
      name: 'EduSoft',
      industry: 'EdTech',
      hiringStatus: 'inactive' as const,
      openPositions: 2,
      studentsHired: 10
    }
  ],
  students: [
    {
      id: 'stu1',
      name: 'Alice Zhang',
      degree: 'Computer Science',
      graduationYear: 2025,
      status: 'active',
      gpa: 3.8
    },
    {
      id: 'stu2',
      name: 'Brian Lee',
      degree: 'Mechanical Engineering',
      graduationYear: 2024,
      status: 'active',
      gpa: 3.2
    },
    {
      id: 'stu3',
      name: 'Carla Díaz',
      degree: 'Psychology',
      graduationYear: 2023,
      status: 'inactive',
      gpa: 3.6
    },
    {
      id: 'stu4',
      name: 'David Kim',
      degree: 'Electrical Engineering',
      graduationYear: 2025,
      status: 'active',
      gpa: 3.9
    },
    {
      id: 'stu5',
      name: 'Emma Patel',
      degree: 'Business Administration',
      graduationYear: 2024,
      status: 'active',
      gpa: 3.5
    }
  ],
  settings: {
    universityName: 'Example University',
    contactEmail: 'info@example.edu',
    contactPhone: '+1 (555) 123-4567',
    website: 'https://www.example.edu',
    address: '123 College Ave, Cityville, CA 91011'
  }
} as const;
