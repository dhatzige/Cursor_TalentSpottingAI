import express from 'express';
import { getOrganizationStats, getActiveJobs, getTopCandidates } from '../controllers/employer.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and employer role
router.use(authenticateToken, authorizeRoles(['employer']));

// Dashboard routes
router.get('/dashboard/stats', getOrganizationStats);
router.get('/jobs/active', getActiveJobs);
router.get('/candidates/top', getTopCandidates);

export default router;
