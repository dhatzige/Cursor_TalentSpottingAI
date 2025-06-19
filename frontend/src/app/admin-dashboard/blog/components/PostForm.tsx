'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Define the Post type for the form
interface Post {
  id?: string;
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

interface PostFormProps {
  post?: Post | null;
}

const PostForm = ({ post }: PostFormProps) => {
  const [formData, setFormData] = useState<Post>({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    image: post?.image || '',
    category: post?.category || '',
    authorName: post?.authorName || '',
    readTime: post?.readTime || '',
    featured: post?.featured || false,
    status: post?.status || 'DRAFT',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isEditMode = !!post;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: 'DRAFT' | 'PUBLISHED') => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiEndpoint = isEditMode ? `/api/posts/${post?.id}` : '/api/posts';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} post`);
      }

      router.push('/admin-dashboard/blog');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={10} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" name="image" value={formData.image} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="authorName">Author Name</Label>
          <Input id="authorName" name="authorName" value={formData.authorName} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="readTime">Read Time (e.g., '5 min read')</Label>
          <Input id="readTime" name="readTime" value={formData.readTime} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={handleSelectChange} defaultValue={formData.status}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Checkbox id="featured" checked={formData.featured} onCheckedChange={handleCheckboxChange} />
          <Label htmlFor="featured">Featured Post</Label>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
