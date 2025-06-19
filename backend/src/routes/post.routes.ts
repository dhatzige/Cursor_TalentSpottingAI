import { Router } from 'express';
import {
  createPostHandler,
  getAllPostsHandler,
  getPublishedPostsHandler,
  getPostByIdHandler,
  updatePostHandler,
  deletePostHandler,
} from '../controllers/post.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// --- Public Routes ---
// Get all published posts
router.get('/', getPublishedPostsHandler);

// Get a single post by ID
router.get('/:id', getPostByIdHandler);


// --- Admin-Only Routes ---
// Get all posts (including drafts)
router.get(
  '/all',
  authenticateToken,
  authorizeRoles(['ADMIN']),
  getAllPostsHandler
);

// Create a new post
router.post(
  '/',
  authenticateToken,
  authorizeRoles(['ADMIN']),
  createPostHandler
);

// Update a post
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(['ADMIN']),
  updatePostHandler
);

// Delete a post
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(['ADMIN']),
  deletePostHandler
);

export default router;
