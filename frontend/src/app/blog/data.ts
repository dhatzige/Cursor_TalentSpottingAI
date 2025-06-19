import { BlogPost } from '@/types/blog';

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The Future of AI in Talent Acquisition',
    excerpt: 'Explore how artificial intelligence is transforming the recruitment process and what it means for employers and candidates.',
    category: 'AI Technology',
    author: 'Dr. Sarah Chen',
    authorRole: 'Chief AI Officer',
    date: 'May 10, 2025',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    featured: true
  },
  {
    id: 2,
    title: 'How to Create a Standout Resume That Gets You Noticed',
    excerpt: 'Learn the key elements of a powerful resume that will help you stand out in a competitive job market.',
    category: 'Career Advice',
    author: 'Michael Torres',
    authorRole: 'Career Development Specialist',
    date: 'May 2, 2025',
    readTime: '6 min read',
    image: '/images/blog/resume-tips.jpg'
  },
  {
    id: 3,
    title: 'Remote Work Hiring Strategies for 2025',
    excerpt: 'Best practices for finding and retaining top remote talent in an increasingly distributed workplace.',
    category: 'Hiring Trends',
    author: 'Jessica Wang',
    authorRole: 'Head of Talent Acquisition',
    date: 'April 28, 2025',
    readTime: '9 min read',
    image: '/images/blog/remote-work.jpg'
  },
  {
    id: 4,
    title: 'The Impact of Skills-Based Hiring',
    excerpt: 'Why more companies are moving away from traditional credentials and focusing on skills and abilities.',
    category: 'Hiring Trends',
    author: 'David Johnson',
    authorRole: 'Industry Analyst',
    date: 'April 21, 2025',
    readTime: '7 min read',
    image: '/images/blog/skills-hiring.jpg'
  },
  {
    id: 5,
    title: 'University Partnerships: Bridging the Education-Employment Gap',
    excerpt: 'How universities and employers can work together to prepare students for the modern workforce.',
    category: 'Education',
    author: 'Dr. Emily Rodriguez',
    authorRole: 'University Relations Director',
    date: 'April 15, 2025',
    readTime: '10 min read',
    image: '/images/blog/university-partnerships.jpg'
  },
  {
    id: 6,
    title: 'Diversity and Inclusion in Tech Recruitment',
    excerpt: 'Strategies for building more diverse technical teams and creating inclusive hiring processes.',
    category: 'Diversity',
    author: 'Aisha Patel',
    authorRole: 'D&I Consultant',
    date: 'April 8, 2025',
    readTime: '11 min read',
    image: '/images/blog/diversity-tech.jpg'
  }
];

const categoryCounts = blogPosts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
}, {} as Record<string, number>);

export const categories = [
  { name: 'All', count: blogPosts.length },
  ...Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
];
