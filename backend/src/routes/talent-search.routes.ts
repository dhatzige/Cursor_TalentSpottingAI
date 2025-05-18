/**
 * Talent Search Routes
 * 
 * API endpoints for employers to search for available talent
 */
import express, { Router } from 'express';
import { searchTalent, getSearchFilters, viewCandidateProfile } from '../controllers/talent-search.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication and employer role
router.use(authenticateToken as express.RequestHandler, authorizeRoles(['employer']) as express.RequestHandler);

// Search for talent based on criteria
router.post('/search', searchTalent as express.RequestHandler);

// Get filter options (universities, cities, skills)
router.get('/filters', getSearchFilters as express.RequestHandler);

// View a specific candidate's profile
router.get('/candidates/:candidateId', viewCandidateProfile as express.RequestHandler);

export default router;
