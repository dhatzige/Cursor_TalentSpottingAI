export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    authorRole: string;
    date: string;
    readTime: string;
    image: string;
    featured?: boolean;
}

export interface Category {
    name: string;
    count: number;
}
