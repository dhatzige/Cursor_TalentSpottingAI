import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { BlogPost } from '@/types/blog';

interface PostCardProps {
  post: BlogPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          width={400}
          height={200}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <span className="px-3 py-1 bg-black/40 text-white text-xs font-semibold rounded-full backdrop-blur-sm border border-white/20">{post.category}</span>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{post.title}</h3>
        <span className="text-gray-400 text-sm">{format(new Date(post.createdAt), 'MMMM d, yyyy')} · {post.readTime}</span>
        <p className="text-gray-300 text-sm mb-4 flex-grow">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2 shadow-sm ring-1 ring-gray-600">
              {post.author.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{post.author.name}</p>
            </div>
          </div>
          <Link
            href={`/blog/${post.id}`}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center group-hover:underline"
          >
            Read more
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;