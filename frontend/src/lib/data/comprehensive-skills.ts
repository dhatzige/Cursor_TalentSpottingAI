export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: string[];
}

export interface SkillRecommendation {
  level: string; // 'bachelor' | 'master' | 'phd' | 'general'
  field?: string; // Optional specific field
  skills: string[];
  description: string;
}

// Comprehensive skills database organized by categories
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'programming',
    name: 'Programming Languages',
    description: 'Programming and scripting languages',
    skills: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Go', 'Rust', 'Swift',
      'Kotlin', 'PHP', 'Ruby', 'Scala', 'R', 'SQL', 'HTML', 'CSS', 'MATLAB', 'Perl',
      'Assembly', 'Shell/Bash', 'PowerShell', 'VBA', 'Dart', 'Objective-C', 'Haskell',
      'Erlang', 'Elixir', 'Clojure', 'F#', 'COBOL', 'Fortran', 'Ada', 'Prolog'
    ]
  },
  {
    id: 'web_development',
    name: 'Web Development',
    description: 'Frontend and backend web technologies',
    skills: [
      'React', 'Angular', 'Vue.js', 'Next.js', 'Nuxt.js', 'Svelte', 'jQuery', 'Bootstrap',
      'Tailwind CSS', 'Sass/SCSS', 'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI',
      'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'GraphQL', 'REST APIs',
      'WebSockets', 'Progressive Web Apps', 'Responsive Design', 'Cross-browser Compatibility',
      'Web Accessibility', 'SEO Optimization', 'Web Performance', 'Webpack', 'Vite'
    ]
  },
  {
    id: 'mobile_development',
    name: 'Mobile Development',
    description: 'Mobile app development technologies',
    skills: [
      'React Native', 'Flutter', 'iOS Development', 'Android Development', 'Xamarin',
      'Ionic', 'Cordova/PhoneGap', 'Unity 3D', 'Swift UI', 'Jetpack Compose',
      'Mobile UI/UX Design', 'App Store Optimization', 'Mobile Testing', 'Push Notifications'
    ]
  },
  {
    id: 'data_science',
    name: 'Data Science & Analytics',
    description: 'Data analysis, machine learning, and statistics',
    skills: [
      'Machine Learning', 'Deep Learning', 'Data Analysis', 'Statistical Modeling',
      'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV',
      'Natural Language Processing', 'Computer Vision', 'Time Series Analysis',
      'A/B Testing', 'Hypothesis Testing', 'Regression Analysis', 'Classification',
      'Clustering', 'Dimensionality Reduction', 'Feature Engineering', 'Data Visualization',
      'Tableau', 'Power BI', 'Matplotlib', 'Seaborn', 'Plotly', 'D3.js', 'Apache Spark',
      'Hadoop', 'ETL Processes', 'Data Mining', 'Predictive Analytics', 'Big Data'
    ]
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'Database management and technologies',
    skills: [
      'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Oracle Database', 'Microsoft SQL Server',
      'Redis', 'Cassandra', 'DynamoDB', 'Firebase', 'Elasticsearch', 'Neo4j',
      'Database Design', 'Query Optimization', 'Data Modeling', 'NoSQL', 'ACID Properties',
      'Database Security', 'Backup and Recovery', 'Replication', 'Sharding'
    ]
  },
  {
    id: 'cloud_devops',
    name: 'Cloud & DevOps',
    description: 'Cloud platforms and development operations',
    skills: [
      'AWS', 'Microsoft Azure', 'Google Cloud Platform', 'Docker', 'Kubernetes',
      'Jenkins', 'GitLab CI/CD', 'GitHub Actions', 'Terraform', 'Ansible', 'Chef', 'Puppet',
      'CI/CD Pipelines', 'Infrastructure as Code', 'Microservices', 'Serverless',
      'Load Balancing', 'Auto Scaling', 'Monitoring', 'Logging', 'Security', 'Networking'
    ]
  },
  {
    id: 'design',
    name: 'Design & Creativity',
    description: 'Visual design and creative skills',
    skills: [
      'UI/UX Design', 'Graphic Design', 'Web Design', 'Adobe Photoshop', 'Adobe Illustrator',
      'Adobe InDesign', 'Adobe XD', 'Figma', 'Sketch', 'Canva', 'Procreate', 'Blender',
      'AutoCAD', '3D Modeling', 'Animation', 'Video Editing', 'Adobe Premiere Pro',
      'Adobe After Effects', 'Final Cut Pro', 'Color Theory', 'Typography', 'Branding',
      'Logo Design', 'Print Design', 'Digital Art', 'Photography', 'Wireframing', 'Prototyping'
    ]
  },
  {
    id: 'business_management',
    name: 'Business & Management',
    description: 'Business operations and management skills',
    skills: [
      'Project Management', 'Agile Methodology', 'Scrum', 'Kanban', 'Leadership',
      'Team Management', 'Strategic Planning', 'Business Analysis', 'Process Improvement',
      'Change Management', 'Risk Management', 'Quality Assurance', 'Budget Management',
      'Financial Analysis', 'Market Research', 'Competitive Analysis', 'SWOT Analysis',
      'Business Development', 'Sales Management', 'Customer Relationship Management',
      'Supply Chain Management', 'Operations Management', 'Human Resources'
    ]
  },
  {
    id: 'marketing_sales',
    name: 'Marketing & Sales',
    description: 'Marketing, sales, and customer engagement',
    skills: [
      'Digital Marketing', 'Social Media Marketing', 'Content Marketing', 'Email Marketing',
      'SEO/SEM', 'Google Analytics', 'Google Ads', 'Facebook Ads', 'LinkedIn Marketing',
      'Influencer Marketing', 'Affiliate Marketing', 'Marketing Automation', 'CRM Systems',
      'Lead Generation', 'Sales Funnel', 'Customer Acquisition', 'Customer Retention',
      'Brand Management', 'Public Relations', 'Copywriting', 'Market Segmentation',
      'Campaign Management', 'Conversion Optimization', 'A/B Testing'
    ]
  },
  {
    id: 'communication',
    name: 'Communication & Languages',
    description: 'Communication skills and language proficiencies',
    skills: [
      'Public Speaking', 'Presentation Skills', 'Technical Writing', 'Creative Writing',
      'Content Creation', 'Storytelling', 'Interpersonal Communication', 'Negotiation',
      'Conflict Resolution', 'Active Listening', 'Cross-cultural Communication',
      'English (Native)', 'English (Fluent)', 'English (Conversational)', 'Greek (Native)',
      'German', 'French', 'Spanish', 'Italian', 'Russian', 'Chinese (Mandarin)',
      'Japanese', 'Arabic', 'Portuguese', 'Dutch', 'Swedish', 'Turkish'
    ]
  },
  {
    id: 'finance_accounting',
    name: 'Finance & Accounting',
    description: 'Financial management and accounting skills',
    skills: [
      'Financial Analysis', 'Financial Modeling', 'Budgeting', 'Forecasting',
      'Investment Analysis', 'Risk Assessment', 'Portfolio Management', 'Corporate Finance',
      'Accounting Principles', 'Bookkeeping', 'Tax Preparation', 'Auditing',
      'Financial Reporting', 'Cash Flow Management', 'Cost Accounting', 'Management Accounting',
      'Excel Advanced', 'QuickBooks', 'SAP', 'Oracle Financials', 'Bloomberg Terminal'
    ]
  },
  {
    id: 'healthcare_medical',
    name: 'Healthcare & Medical',
    description: 'Medical and healthcare-related skills',
    skills: [
      'Patient Care', 'Medical Research', 'Clinical Trials', 'Diagnosis', 'Treatment Planning',
      'Medical Writing', 'Healthcare Administration', 'Medical Coding', 'HIPAA Compliance',
      'Electronic Health Records', 'Telemedicine', 'Public Health', 'Epidemiology',
      'Pharmacology', 'Anatomy', 'Physiology', 'Medical Ethics', 'Emergency Medicine',
      'Surgery', 'Nursing', 'Physical Therapy', 'Mental Health Counseling'
    ]
  },
  {
    id: 'education_training',
    name: 'Education & Training',
    description: 'Teaching and educational skills',
    skills: [
      'Curriculum Development', 'Lesson Planning', 'Classroom Management', 'Educational Technology',
      'Online Teaching', 'Student Assessment', 'Learning Management Systems', 'Tutoring',
      'Training Design', 'Adult Learning', 'Special Education', 'Multilingual Education',
      'Educational Research', 'Pedagogy', 'Child Development', 'Educational Psychology'
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering',
    description: 'Engineering disciplines and technical skills',
    skills: [
      'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Chemical Engineering',
      'Software Engineering', 'Systems Engineering', 'Industrial Engineering', 'Aerospace Engineering',
      'Biomedical Engineering', 'Environmental Engineering', 'Materials Science', 'Robotics',
      'Control Systems', 'Signal Processing', 'Circuit Design', 'CAD Software', 'Simulation',
      'Quality Control', 'Manufacturing Processes', 'Project Engineering', 'Technical Documentation'
    ]
  },
  {
    id: 'science_research',
    name: 'Science & Research',
    description: 'Scientific research and laboratory skills',
    skills: [
      'Research Methodology', 'Data Collection', 'Statistical Analysis', 'Laboratory Techniques',
      'Scientific Writing', 'Grant Writing', 'Literature Review', 'Experimental Design',
      'Hypothesis Testing', 'Peer Review', 'Conference Presentations', 'Academic Publishing',
      'Field Research', 'Qualitative Research', 'Quantitative Research', 'Survey Design',
      'Interview Techniques', 'Ethics in Research', 'Collaboration', 'Critical Thinking'
    ]
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Legal and compliance skills',
    skills: [
      'Legal Research', 'Contract Analysis', 'Legal Writing', 'Case Management', 'Litigation',
      'Corporate Law', 'Intellectual Property', 'Employment Law', 'Tax Law', 'International Law',
      'Compliance', 'Regulatory Affairs', 'Legal Ethics', 'Negotiation', 'Mediation',
      'Arbitration', 'Due Diligence', 'Legal Technology', 'Document Review'
    ]
  },
  {
    id: 'arts_humanities',
    name: 'Arts & Humanities',
    description: 'Creative arts and humanities skills',
    skills: [
      'Art History', 'Cultural Studies', 'Philosophy', 'Literature Analysis', 'Creative Writing',
      'Poetry', 'Drama', 'Music Theory', 'Music Performance', 'Music Production',
      'Fine Arts', 'Sculpture', 'Painting', 'Drawing', 'Ceramics', 'Printmaking',
      'Digital Arts', 'Film Studies', 'Documentary Making', 'Archival Research',
      'Museum Studies', 'Cultural Heritage', 'Art Curation', 'Art Criticism'
    ]
  },
  {
    id: 'soft_skills',
    name: 'Soft Skills',
    description: 'Personal and interpersonal skills',
    skills: [
      'Critical Thinking', 'Problem Solving', 'Analytical Thinking', 'Creative Thinking',
      'Decision Making', 'Time Management', 'Organization', 'Multitasking', 'Adaptability',
      'Flexibility', 'Resilience', 'Stress Management', 'Self-motivation', 'Initiative',
      'Attention to Detail', 'Work Ethic', 'Reliability', 'Punctuality', 'Teamwork',
      'Collaboration', 'Emotional Intelligence', 'Empathy', 'Cultural Sensitivity',
      'Learning Agility', 'Continuous Learning', 'Innovation', 'Entrepreneurship'
    ]
  }
];

// Recommendations based on academic level and field
export const SKILL_RECOMMENDATIONS: SkillRecommendation[] = [
  // Bachelor's Level - General
  {
    level: 'bachelor',
    skills: [
      'Communication Skills', 'Teamwork', 'Problem Solving', 'Time Management', 'Critical Thinking',
      'Microsoft Office', 'Research Skills', 'Presentation Skills', 'Writing Skills', 'Learning Agility',
      'Adaptability', 'Organization', 'Attention to Detail', 'Work Ethic', 'Initiative'
    ],
    description: 'Essential skills for bachelor\'s level students entering the job market'
  },
  
  // Bachelor's - Computer Science
  {
    level: 'bachelor',
    field: 'computer-science',
    skills: [
      'Programming Fundamentals', 'JavaScript', 'Python', 'Java', 'HTML/CSS', 'SQL',
      'Data Structures', 'Algorithms', 'Version Control (Git)', 'Problem Solving',
      'Software Development', 'Web Development', 'Database Management', 'Testing',
      'Debugging', 'Technical Documentation', 'Agile Methodology'
    ],
    description: 'Technical skills commonly developed during computer science studies'
  },

  // Bachelor's - Business/Economics
  {
    level: 'bachelor',
    field: 'business',
    skills: [
      'Financial Analysis', 'Excel Advanced', 'Market Research', 'Business Analysis',
      'Project Management', 'Data Analysis', 'Presentation Skills', 'Strategic Thinking',
      'Customer Service', 'Sales', 'Marketing Basics', 'Leadership', 'Negotiation',
      'Business Communication', 'Report Writing'
    ],
    description: 'Business skills for economics and business administration students'
  },

  // Bachelor's - Engineering
  {
    level: 'bachelor',
    field: 'engineering',
    skills: [
      'Technical Drawing', 'CAD Software', 'MATLAB', 'Problem Solving', 'Mathematical Modeling',
      'Project Management', 'Quality Control', 'Safety Protocols', 'Technical Writing',
      'Data Analysis', 'Simulation Software', 'Laboratory Skills', 'Systems Thinking',
      'Engineering Ethics', 'Team Collaboration'
    ],
    description: 'Core engineering skills across different engineering disciplines'
  },

  // Master's Level - General
  {
    level: 'master',
    skills: [
      'Advanced Research', 'Data Analysis', 'Statistical Analysis', 'Academic Writing',
      'Literature Review', 'Methodology Design', 'Critical Analysis', 'Independent Learning',
      'Project Leadership', 'Mentoring', 'Conference Presentations', 'Peer Review',
      'Specialized Knowledge', 'Innovation', 'Strategic Thinking', 'Cross-functional Collaboration'
    ],
    description: 'Advanced skills developed during master\'s level studies'
  },

  // Master's - Data Science/Analytics
  {
    level: 'master',
    field: 'data-science',
    skills: [
      'Machine Learning', 'Python', 'R', 'Statistical Modeling', 'Data Visualization',
      'Big Data', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'Deep Learning',
      'A/B Testing', 'Predictive Analytics', 'Data Mining', 'Business Intelligence',
      'Tableau', 'Power BI', 'Apache Spark', 'Cloud Computing'
    ],
    description: 'Specialized data science and analytics skills for master\'s students'
  },

  // PhD Level - General
  {
    level: 'phd',
    skills: [
      'Advanced Research Methodology', 'Grant Writing', 'Academic Publishing', 'Peer Review',
      'Conference Speaking', 'Teaching', 'Supervision', 'Independent Research',
      'Literature Synthesis', 'Theoretical Development', 'Interdisciplinary Collaboration',
      'Research Ethics', 'Statistical Expertise', 'Scientific Communication', 'Innovation',
      'Thought Leadership', 'Academic Networking', 'Curriculum Development'
    ],
    description: 'Research and academic skills for PhD level students and researchers'
  },

  // Medical/Healthcare
  {
    level: 'bachelor',
    field: 'medicine',
    skills: [
      'Patient Care', 'Medical Terminology', 'Clinical Skills', 'Anatomy', 'Physiology',
      'Medical Ethics', 'Communication Skills', 'Empathy', 'Attention to Detail',
      'Stress Management', 'Teamwork', 'Critical Thinking', 'Problem Solving',
      'Time Management', 'Documentation', 'Research Skills'
    ],
    description: 'Essential skills for medical and healthcare students'
  },

  // Arts/Humanities
  {
    level: 'bachelor',
    field: 'arts',
    skills: [
      'Creative Thinking', 'Art History', 'Cultural Analysis', 'Critical Writing',
      'Research Skills', 'Visual Communication', 'Aesthetic Judgment', 'Cultural Sensitivity',
      'Presentation Skills', 'Digital Arts', 'Portfolio Development', 'Art Criticism',
      'Museum Studies', 'Curation', 'Creative Process', 'Interdisciplinary Thinking'
    ],
    description: 'Creative and analytical skills for arts and humanities students'
  },

  // Psychology/Social Sciences
  {
    level: 'bachelor',
    field: 'psychology',
    skills: [
      'Research Methods', 'Statistical Analysis', 'Data Collection', 'Interview Techniques',
      'Counseling Skills', 'Active Listening', 'Empathy', 'Cultural Competence',
      'Ethical Practice', 'Report Writing', 'Case Study Analysis', 'Group Dynamics',
      'Behavioral Analysis', 'Assessment Tools', 'Crisis Intervention'
    ],
    description: 'Psychological and social science skills for understanding human behavior'
  }
];

// Get all skills as a flat array for autocomplete
export function getAllSkills(): string[] {
  const allSkills = new Set<string>();
  
  SKILL_CATEGORIES.forEach(category => {
    category.skills.forEach(skill => allSkills.add(skill));
  });
  
  SKILL_RECOMMENDATIONS.forEach(rec => {
    rec.skills.forEach(skill => allSkills.add(skill));
  });
  
  return Array.from(allSkills).sort();
}

// Get skill recommendations based on level and field
export function getSkillRecommendations(level: string, field?: string): SkillRecommendation[] {
  const recommendations = SKILL_RECOMMENDATIONS.filter(rec => 
    rec.level === level && (!rec.field || !field || rec.field === field)
  );
  
  // Always include general recommendations for the level
  const generalRec = SKILL_RECOMMENDATIONS.find(rec => 
    rec.level === level && !rec.field
  );
  
  if (generalRec && !recommendations.includes(generalRec)) {
    recommendations.unshift(generalRec);
  }
  
  return recommendations;
}

// Search skills by query
export function searchSkills(query: string, limit: number = 20): string[] {
  if (!query || query.length < 1) return [];
  
  const allSkills = getAllSkills();
  const queryLower = query.toLowerCase();
  
  // Prioritize exact matches and starts-with matches
  const exactMatches = allSkills.filter(skill => 
    skill.toLowerCase() === queryLower
  );
  
  const startsWithMatches = allSkills.filter(skill => 
    skill.toLowerCase().startsWith(queryLower) && 
    !exactMatches.includes(skill)
  );
  
  const containsMatches = allSkills.filter(skill => 
    skill.toLowerCase().includes(queryLower) && 
    !exactMatches.includes(skill) && 
    !startsWithMatches.includes(skill)
  );
  
  return [...exactMatches, ...startsWithMatches, ...containsMatches].slice(0, limit);
}

// Map study fields to recommendation field keys
export function mapStudyFieldToRecommendationField(studyField: string): string | undefined {
  const fieldMapping: Record<string, string> = {
    'computer-science': 'computer-science',
    'software-engineering': 'computer-science',
    'information-technology': 'computer-science',
    'data-science': 'data-science',
    'artificial-intelligence': 'data-science',
    'machine-learning': 'data-science',
    'business-administration': 'business',
    'economics': 'business',
    'finance': 'business',
    'marketing': 'business',
    'management': 'business',
    'mechanical-engineering': 'engineering',
    'electrical-engineering': 'engineering',
    'civil-engineering': 'engineering',
    'chemical-engineering': 'engineering',
    'aerospace-engineering': 'engineering',
    'biomedical-engineering': 'engineering',
    'medicine': 'medicine',
    'nursing': 'medicine',
    'pharmacy': 'medicine',
    'dentistry': 'medicine',
    'psychology': 'psychology',
    'sociology': 'psychology',
    'social-work': 'psychology',
    'fine-arts': 'arts',
    'graphic-design': 'arts',
    'art-history': 'arts',
    'music': 'arts',
    'literature': 'arts'
  };
  
  return fieldMapping[studyField.toLowerCase()];
} 