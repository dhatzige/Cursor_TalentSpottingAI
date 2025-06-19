import { Metadata } from 'next';
import { notFound } from 'next/dist/client/components/not-found';
import Image from 'next/image';
import { format } from 'date-fns';
import Navbar from '@/components/layout/Navbar';
import { BlogPost } from '@/types/blog';

// Define explicit type for the page props
interface PostPageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function getPost(id: string): Promise<BlogPost> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  const res = await fetch(`${apiUrl}/posts/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.id);

  return {
    title: `${post.title} | TalentSpottingAI Blog`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.id);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-16">
      <Navbar transparent={false} />

      <article className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <header className="mb-8 md:mb-12 text-center">
          <p className="text-blue-400 font-semibold mb-2">{post.category}</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
          <div className="text-gray-400 text-sm md:text-base">
            <span>By {post.author.name}</span>
            <span className="mx-2">·</span>
            <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
            <span className="mx-2">·</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8 md:mb-12 shadow-2xl">
          <Image
            src={post.image}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none mx-auto text-gray-300 prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
        />
      </article>
    </div>
  );
}
