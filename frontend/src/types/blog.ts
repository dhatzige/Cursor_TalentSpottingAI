export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  readTime: string;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  author: {
    name: string;
  };
}

export interface Category {
    name: string;
    count: number;
}
