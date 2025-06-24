import { BlogPost } from '@/types/blog';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Talent Acquisition',
    excerpt: 'Explore how artificial intelligence is transforming the recruitment process and what it means for employers and candidates.',
    content: 'Full content would go here...',
    category: 'AI Technology',
    author: {
      name: 'Dr. Sarah Chen'
    },
    createdAt: '2025-05-10T00:00:00Z',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    featured: true,
    status: 'PUBLISHED' as const
  },
  {
    id: '2',
    title: 'How to Create a Standout Resume That Gets You Noticed',
    excerpt: 'Learn the key elements of a powerful resume that will help you stand out in a competitive job market.',
    content: 'Full content would go here...',
    category: 'Career Advice',
    author: {
      name: 'Michael Torres'
    },
    createdAt: '2025-05-02T00:00:00Z',
    readTime: '6 min read',
    image: '/images/blog/resume-tips.jpg',
    featured: false,
    status: 'PUBLISHED' as const
  },
  {
    id: '3',
    title: 'Remote Work Hiring Strategies for 2025',
    excerpt: 'Best practices for finding and retaining top remote talent in an increasingly distributed workplace.',
    content: 'Full content would go here...',
    category: 'Hiring Trends',
    author: {
      name: 'Jessica Wang'
    },
    createdAt: '2025-04-28T00:00:00Z',
    readTime: '9 min read',
    image: '/images/blog/remote-work.jpg',
    featured: false,
    status: 'PUBLISHED' as const
  },
  {
    id: '4',
    title: 'The Impact of Skills-Based Hiring',
    excerpt: 'Why more companies are moving away from traditional credentials and focusing on skills and abilities.',
    content: 'Full content would go here...',
    category: 'Hiring Trends',
    author: {
      name: 'David Johnson'
    },
    createdAt: '2025-04-21T00:00:00Z',
    readTime: '7 min read',
    image: '/images/blog/skills-hiring.jpg',
    featured: false,
    status: 'PUBLISHED' as const
  },
  {
    id: '5',
    title: 'University Partnerships: Bridging the Education-Employment Gap',
    excerpt: 'How universities and employers can work together to prepare students for the modern workforce.',
    content: 'Full content would go here...',
    category: 'Education',
    author: {
      name: 'Dr. Emily Rodriguez'
    },
    createdAt: '2025-04-15T00:00:00Z',
    readTime: '10 min read',
    image: '/images/blog/university-partnerships.jpg',
    featured: false,
    status: 'PUBLISHED' as const
  },
  {
    id: '6',
    title: 'Diversity and Inclusion in Tech Recruitment',
    excerpt: 'Strategies for building more diverse technical teams and creating inclusive hiring processes.',
    content: 'Full content would go here...',
    category: 'Diversity',
    author: {
      name: 'Aisha Patel'
    },
    createdAt: '2025-04-08T00:00:00Z',
    readTime: '11 min read',
    image: '/images/blog/diversity-tech.jpg',
    featured: false,
    status: 'PUBLISHED' as const
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
