// Mock job data for development and testing
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  remote: boolean;
  posted: string;
  postedRelative?: string;
  jobType?: string;
  experienceLevel?: string;
  industry?: string;
  skills?: string[];
  tags: string[];
  benefits?: string[];
}

export const mockJobs: Job[] = [
  {
    id: 0,
    title: 'Account Executive',
    company: 'SalesForce',
    location: 'San Francisco, CA',
    description: 'Looking for an experienced Account Executive to join our enterprise sales team. You will be responsible for managing client relationships and driving revenue growth.',
    salary: '$90,000 - $120,000',
    remote: false,
    posted: '1 day ago',
    jobType: 'full-time',
    experienceLevel: 'mid-senior',
    industry: 'sales',
    skills: ['Sales', 'CRM', 'Client Management', 'Business Development'],
    tags: ['Sales', 'Account Management', 'B2B']
  },
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    description: 'We are looking for an experienced React developer to join our team...',
    salary: '$120,000 - $150,000',
    remote: true,
    posted: '2 days ago',
    jobType: 'full-time',
    experienceLevel: 'senior',
    industry: 'software',
    skills: ['React', 'TypeScript', 'Node.js'],
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
    jobType: 'full-time',
    experienceLevel: 'mid',
    industry: 'design',
    skills: ['Figma', 'Adobe XD', 'UI/UX', 'Sketch'],
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
    jobType: 'full-time',
    experienceLevel: 'senior',
    industry: 'data',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
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
    jobType: 'contract',
    experienceLevel: 'mid',
    industry: 'software',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
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
    jobType: 'full-time',
    experienceLevel: 'mid',
    industry: 'software',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
  },
  {
    id: 6,
    title: 'Marketing Specialist',
    company: 'GrowthMarketing',
    location: 'Chicago, IL',
    description: 'Lead our digital marketing campaigns and growth strategies...',
    salary: '$80,000 - $100,000',
    remote: false,
    posted: '2 weeks ago',
    jobType: 'full-time',
    experienceLevel: 'mid',
    industry: 'marketing',
    skills: ['SEO', 'Content Marketing', 'Social Media', 'Analytics'],
    tags: ['Digital Marketing', 'SEO', 'Content Strategy']
  },
  {
    id: 7,
    title: 'Frontend Developer Intern',
    company: 'StartupInc',
    location: 'Boston, MA',
    description: 'Join our team as a frontend development intern to learn and grow...',
    salary: '$25 - $30/hour',
    remote: false,
    posted: '3 days ago',
    jobType: 'internship',
    experienceLevel: 'entry',
    industry: 'software',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    tags: ['Internship', 'Frontend', 'React']
  }
];

// Filter options for the job filter UI
export const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry-level' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'senior', label: 'Senior' },
  { value: 'executive', label: 'Executive' },
];

export const INDUSTRIES = [
  { value: 'software', label: 'Software Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'data', label: 'Data Science' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'sales', label: 'Sales' },
];

export const POSTED_TIMES = [
  { value: '1', label: 'Last 24 hours' },
  { value: '7', label: 'Last 7 days' },
  { value: '14', label: 'Last 14 days' },
  { value: '30', label: 'Last 30 days' },
];
