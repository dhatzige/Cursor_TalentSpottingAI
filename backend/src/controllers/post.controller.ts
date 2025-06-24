import { RequestHandler } from 'express';
import * as postService from '../services/post.service';

export const createPostHandler: RequestHandler = async (req, res) => {
  try {
    const authorId = (req as any).user?.id;
    if (!authorId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const postData = { ...req.body, authorId };
    const post = await postService.createPost(postData);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

export const getAllPostsHandler: RequestHandler = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
};

export const getPublishedPostsHandler: RequestHandler = async (req, res) => {
  try {
    const posts = await postService.getPublishedPosts();
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch published posts', error: error.message });
  }
};

export const getPostByIdHandler: RequestHandler = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
};

export const updatePostHandler: RequestHandler = async (req, res) => {
  try {
    const post = await postService.updatePost(req.params.id, req.body);
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
};

export const deletePostHandler: RequestHandler = async (req, res) => {
  try {
    await postService.deletePost(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete post', error: error.message });
  }
};

// Aliases for route compatibility
export const getAllPosts = getAllPostsHandler;
export const getPostById = getPostByIdHandler;
export const createPost = createPostHandler;
export const updatePost = updatePostHandler;
export const deletePost = deletePostHandler;

// Placeholder functions for missing post features
export const likePost: RequestHandler = async (req, res) => {
  res.status(501).json({ message: 'Like functionality not implemented yet' });
};

export const unlikePost: RequestHandler = async (req, res) => {
  res.status(501).json({ message: 'Unlike functionality not implemented yet' });
};

export const addComment: RequestHandler = async (req, res) => {
  res.status(501).json({ message: 'Comment functionality not implemented yet' });
};

export const getComments: RequestHandler = async (req, res) => {
  res.status(501).json({ message: 'Comments functionality not implemented yet' });
};
