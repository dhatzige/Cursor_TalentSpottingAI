/**
 * Talent Search Routes
 * 
 * API endpoints for employers to search for available talent
 */
import express from 'express';
import {
  searchProfiles,
  getFilters,
  getProfile,
  saveSearch
} from '../controllers/talent-search.controller';
import { clerkAuth } from '../middleware/clerkAuth';

const router = express.Router();

// All routes require Clerk authentication
router.use(clerkAuth);

// Talent search routes
router.get('/profiles', searchProfiles as express.RequestHandler);
router.get('/filters', getFilters as express.RequestHandler);
router.get('/profiles/:id', getProfile as express.RequestHandler);
router.post('/saved-searches', saveSearch as express.RequestHandler);

export default router;
