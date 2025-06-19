import Link from 'next/link';

import { Category } from '@/types/blog';

interface CategorySidebarProps {
    categories: Category[];
    currentCategory?: string;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, currentCategory }) => {
    return (
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 shadow-md sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-white">Categories</h3>
            <ul className="space-y-2">
                {categories.map(category => {
                    const isActive = (currentCategory || 'All') === category.name;
                    return (
                        <li key={category.name}>
                            <Link
                                href={`/blog?category=${category.name === 'All' ? '' : category.name}`}
                                className={`flex justify-between items-center text-gray-300 hover:text-white transition-colors rounded-md px-3 py-2 ${isActive ? 'bg-blue-600/30 text-white' : 'hover:bg-gray-700/50'}`}>
                                <span className="font-medium">{category.name}</span>
                                <span className={`${isActive ? 'bg-blue-500' : 'bg-gray-700/70'} text-xs px-2 py-1 rounded-full`}>{category.count}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-white">Subscribe</h3>
                <p className="text-gray-300 text-sm mb-4">Get the latest articles and insights delivered to your inbox.</p>
                <form className="flex">
                    <input
                        type="email"
                        placeholder="Your email"
                        className="px-3 py-2 bg-gray-900/70 border border-gray-700 rounded-l-md focus:outline-none focus:border-blue-500 w-full text-white"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors shadow-sm font-semibold">
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategorySidebar;