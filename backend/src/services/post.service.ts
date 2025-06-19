import { PrismaClient, Post, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> => {
  return prisma.post.create({ data });
};

export const getAllPosts = async (): Promise<Post[]> => {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  });
};

export const getPublishedPosts = async (): Promise<Post[]> => {
  return prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  });
};

export const getPostById = async (id: string): Promise<Post | null> => {
  return prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });
};

export const updatePost = async (id: string, data: Partial<Post>): Promise<Post> => {
  return prisma.post.update({
    where: { id },
    data,
  });
};

export const deletePost = async (id: string): Promise<Post> => {
  return prisma.post.delete({ where: { id } });
};
