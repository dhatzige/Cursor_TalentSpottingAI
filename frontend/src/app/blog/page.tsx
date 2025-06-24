import { Metadata } from 'next';

import Link from 'next/link';
import FeaturedPostCard from '@/components/blog/FeaturedPostCard';
import PostCard from '@/components/blog/PostCard';
import CategorySidebar from '@/components/blog/CategorySidebar';
import SearchBar from '@/components/blog/SearchBar';
import { BlogPost, Category } from '@/types/blog';

async function getPosts(): Promise<BlogPost[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  const res = await fetch(`${apiUrl}/posts`, { cache: 'no-store' });

  if (!res.ok) {
    console.error('Failed to fetch blog posts');
    // In a real app, you'd want to handle this more gracefully.
    // For now, we'll return an empty array to prevent the page from crashing.
    return [];
  }

  return res.json();
}

export const metadata: Metadata = {
  title: 'Blog | TalentSpottingAI',
  description: 'Explore expert insights, industry trends, and actionable advice on talent acquisition, career development, and the future of work. Stay ahead with the TalentSpottingAI blog.',
  keywords: ['talent acquisition', 'AI recruiting', 'career advice', 'hiring trends', 'future of work'],
};

interface BlogPageProps {
    searchParams: Promise<{
        category?: string;
        search?: string;
    }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const { category, search } = await searchParams;

    const allPosts = await getPosts();

    // Dynamically generate categories from the fetched posts
    const categories: Category[] = Array.from(new Set(allPosts.map(p => p.category)))
      .map(cat => ({
        name: cat,
        count: allPosts.filter(p => p.category === cat).length
      }));

    const filteredPosts = allPosts.filter((post: BlogPost) => {
        const matchesCategory = category ? post.category === category : true;
        const matchesSearch = search ? post.title.toLowerCase().includes(search.toLowerCase()) || post.excerpt.toLowerCase().includes(search.toLowerCase()) : true;
        return matchesCategory && matchesSearch;
    });

    const featuredPost = filteredPosts.find((post: BlogPost) => post.featured);
    const regularPosts = filteredPosts.filter((post: BlogPost) => !post.featured);

    return (
        <div className="min-h-screen bg-gray-900 text-white">

            <header className="py-20 relative text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-gray-900 z-0"></div>
                <div className="container mx-auto px-4 relative">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        The <span className="animated-gradient-text">TalentSpottingAI</span> Blog
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Expert insights, industry trends, and actionable advice on the future of work.
                    </p>
                    <div className="mt-8">
                        <SearchBar />
                    </div>
                </div>
            </header>

            {featuredPost && !category && !search && (
                <section className="py-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/5 to-gray-900 z-0"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <h2 className="text-3xl font-bold mb-8 text-center">Featured Article</h2>
                        <FeaturedPostCard post={featuredPost} />
                    </div>
                </section>
            )}

            <section className="py-12 relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8">
                        <aside className="md:w-1/4 lg:w-1/5">
                            <CategorySidebar categories={categories} currentCategory={category} />
                        </aside>

                        <main className="md:w-3/4 lg:w-4/5">
                            {regularPosts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {regularPosts.map((post: BlogPost) => (
                                        <PostCard key={post.id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <h3 className="text-2xl font-bold text-white">No Articles Found</h3>
                                    <p className="text-gray-400 mt-2">Try adjusting your search or category filters.</p>
                                    <Link href="/blog" className="mt-6 inline-block px-6 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-md text-white font-semibold">
                                        Clear Filters
                                    </Link>
                                </div>
                            )}

                            {/* TODO: Implement actual pagination logic */}
                            <div className="mt-12 flex justify-center">
                                <div className="flex items-center space-x-2">
                                    <Link href="#" className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors text-gray-400">Previous</Link>
                                    <Link href="#" className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors text-white font-bold">1</Link>
                                    <Link href="#" className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">2</Link>
                                    <Link href="#" className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">Next</Link>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </section>
        </div>
    );
}
