import PostForm from '@/app/admin-dashboard/blog/components/PostForm';
import { notFound } from 'next/dist/client/components/not-found';

// Define the Post type for the page
interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  authorName: string;
  readTime: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
}

// Fetch a single post by its ID
async function getPost(id: string): Promise<Post | null> {
  // Use the environment variable for the API URL, with a fallback for local development
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  const res = await fetch(`${apiUrl}/posts/${id}`, {
    cache: 'no-store', // Ensure we get the latest data
  });

  if (!res.ok) {
    // If the post is not found, the API should return a 404
    if (res.status === 404) {
      return null;
    }
    // For other errors, we can throw an exception
    throw new Error('Failed to fetch post');
  }

  return res.json();
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex-1">
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-100">Edit Post</h1>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <PostForm post={post} />
        </div>
      </div>
    </main>
  );
}
