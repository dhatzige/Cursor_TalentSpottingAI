import express from 'express';
import {
  getOrganizationStats,
  getActiveJobs,
  getTopCandidates,
  getJobApplications,
  getApplicationDetails,
  updateApplicationStatus,
  addApplicationNote
} from '../controllers/employer.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and employer role
router.use(authenticateToken as express.RequestHandler, authorizeRoles(['employer']) as express.RequestHandler);

// Dashboard routes
router.get('/dashboard/stats', getOrganizationStats as express.RequestHandler);
router.get('/jobs/active', getActiveJobs as express.RequestHandler);
router.get('/candidates/top', getTopCandidates as express.RequestHandler);

// Application management routes
router.get('/jobs/:jobId/applications', getJobApplications as express.RequestHandler);
router.get('/applications/:applicationId', getApplicationDetails as express.RequestHandler);
router.patch('/applications/:applicationId/status', updateApplicationStatus as express.RequestHandler);
router.post('/applications/:applicationId/notes', addApplicationNote as express.RequestHandler);

export default router;
