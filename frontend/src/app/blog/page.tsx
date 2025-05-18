import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import Image from 'next/image';

// Sample blog post data
const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI in Talent Acquisition',
    excerpt: 'Explore how artificial intelligence is transforming the recruitment process and what it means for employers and candidates.',
    category: 'AI Technology',
    author: 'Dr. Sarah Chen',
    authorRole: 'Chief AI Officer',
    date: 'May 10, 2025',
    readTime: '8 min read',
    image: '/images/blog/ai-talent.jpg',
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

// Categories for filter sidebar
const categories = [
  { name: 'All', count: blogPosts.length },
  { name: 'AI Technology', count: 2 },
  { name: 'Career Advice', count: 3 },
  { name: 'Hiring Trends', count: 4 },
  { name: 'Education', count: 1 },
  { name: 'Diversity', count: 2 },
];

export default function BlogPage() {
  // Get featured post
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16">
      <Navbar transparent={false} />
      
      {/* Header */}
      <header className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 z-0"></div>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">TalentSpottingAI Blog</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto text-center">
            Insights, trends, and expert advice on talent acquisition, career development, and the future of work
          </p>
        </div>
      </header>
      
      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/05 to-purple-500/05 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-2xl font-bold mb-8">Featured Article</h2>
            <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 shadow-lg flex flex-col md:flex-row">
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-30" />
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {featuredPost.category}
                </div>
                <Image 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                  width={600}
                  height={400}
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <span className="text-gray-400 text-sm">{featuredPost.date} · {featuredPost.readTime}</span>
                <h3 className="text-2xl font-bold mt-2 mb-4">{featuredPost.title}</h3>
                <p className="text-gray-300 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                    {featuredPost.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{featuredPost.author}</p>
                    <p className="text-sm text-gray-400">{featuredPost.authorRole}</p>
                  </div>
                </div>
                <Link 
                  href={`/blog/${featuredPost.id}`} 
                  className="px-5 py-2 bg-blue-500 rounded-md inline-block hover:bg-blue-600 transition-colors shadow-sm"
                >
                  Read Article
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Main Content */}
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/30 to-gray-900/30 z-0"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-1/4 mb-8 md:mb-0 md:pr-8">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 shadow-md sticky top-20">
                <h3 className="text-xl font-bold mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map(category => (
                    <li key={category.name}>
                      <Link 
                        href={`/blog?category=${category.name === 'All' ? '' : category.name}`}
                        className="flex justify-between items-center text-gray-300 hover:text-white transition-colors"
                      >
                        <span>{category.name}</span>
                        <span className="bg-gray-700/70 text-xs px-2 py-1 rounded-full">{category.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="text-xl font-bold mb-4">Subscribe</h3>
                  <p className="text-gray-300 text-sm mb-4">Get the latest articles and insights delivered to your inbox.</p>
                  <div className="flex">
                    <input 
                      type="email" 
                      placeholder="Your email" 
                      className="px-3 py-2 bg-gray-900/70 border border-gray-700 rounded-l-md focus:outline-none focus:border-blue-500 w-full"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors shadow-sm">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Blog Posts */}
            <div className="md:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularPosts.map(post => (
                  <div key={post.id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 shadow-md">
                    <div className="relative h-48">
                      <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                        {post.category}
                      </div>
                      <Image 
                        src={post.image} 
                        alt={post.title} 
                        width={400} 
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-gray-400 text-sm">{post.date} · {post.readTime}</span>
                      <h3 className="font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-300 text-sm mb-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mr-2 shadow-sm">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{post.author}</p>
                            <p className="text-xs text-gray-400">{post.date}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{post.readTime}</span>
                      </div>
                      <Link 
                        href={`/blog/${post.id}`} 
                        className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                      >
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="mt-10 flex justify-center">
                <div className="flex space-x-1">
                  <Link 
                    href="#" 
                    className="px-4 py-2 bg-[#131b39] border border-gray-800 rounded-md hover:bg-[#1e2a4a] transition-colors"
                  >
                    Previous
                  </Link>
                  <Link 
                    href="#" 
                    className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    1
                  </Link>
                  <Link 
                    href="#" 
                    className="px-4 py-2 bg-[#131b39] border border-gray-800 rounded-md hover:bg-[#1e2a4a] transition-colors"
                  >
                    2
                  </Link>
                  <Link 
                    href="#" 
                    className="px-4 py-2 bg-[#131b39] border border-gray-800 rounded-md hover:bg-[#1e2a4a] transition-colors"
                  >
                    3
                  </Link>
                  <Link 
                    href="#" 
                    className="px-4 py-2 bg-[#131b39] border border-gray-800 rounded-md hover:bg-[#1e2a4a] transition-colors"
                  >
                    Next
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
