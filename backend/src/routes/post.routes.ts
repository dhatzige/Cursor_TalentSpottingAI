import express from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  getComments
} from '../controllers/post.controller';
import { clerkAuth } from '../middleware/clerkAuth';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.get('/:id/comments', getComments);

// Protected routes - require Clerk authentication
router.post('/', clerkAuth, createPost);
router.put('/:id', clerkAuth, updatePost);
router.delete('/:id', clerkAuth, deletePost);
router.post('/:id/like', clerkAuth, likePost);
router.delete('/:id/like', clerkAuth, unlikePost);
router.post('/:id/comments', clerkAuth, addComment);

export default router;
