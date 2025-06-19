import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

import { BlogPost } from '@/types/blog';

interface FeaturedPostCardProps {
  post: BlogPost;
}

const FeaturedPostCard: React.FC<FeaturedPostCardProps> = ({ post }) => {
  return (
    <div className="group relative grid md:grid-cols-2 items-center bg-gray-800/50 rounded-lg overflow-hidden shadow-2xl transition-all duration-300">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
        <div className="relative grid md:grid-cols-2 items-center bg-gray-800 rounded-lg overflow-hidden w-full h-full col-span-2">
            <div className="relative h-full min-h-[300px] md:min-h-full">
                <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 backdrop-blur-sm border border-white/20">
                {post.category}
                </div>
                <Image
                src={post.image}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 transform group-hover:scale-105"
                />
            </div>
            <div className="p-6 md:p-8 flex flex-col">
                <span className="text-gray-400 text-sm">{format(new Date(post.createdAt), 'MMMM d, yyyy')} · {post.readTime}</span>
                <h3 className="text-2xl font-bold mt-2 mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-colors duration-300">{post.title}</h3>
                <p className="text-gray-300 mb-6 flex-grow">{post.excerpt}</p>
                <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold mr-3 shadow-sm ring-2 ring-gray-600">
                    {post.author.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                    <p className="font-semibold text-white">{post.author.name}</p>
                </div>
                </div>
                <div className="mt-auto">
                    <Link
                    href={`/blog/${post.id}`}
                    className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-purple-500 rounded-md shadow-md group"
                    >
                        <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-600 group-hover:translate-x-0 ease">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </span>
                        <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">Read Article</span>
                        <span className="relative invisible">Read Article</span>
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
};

export default FeaturedPostCard;