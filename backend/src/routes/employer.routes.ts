import express, { RequestHandler } from 'express';
import {
  getAllJobs,
  createJob,
  getActiveJobs,
  getOrganizationStats,
  updateApplicationStatus
} from '../controllers/employer';
import { clerkAuth } from '../middleware/clerkAuth';

const router = express.Router();

// All routes require authentication
router.use(clerkAuth);

// Job management routes
router.get('/jobs', getAllJobs as RequestHandler);
router.post('/jobs', createJob as RequestHandler);
// router.put('/jobs/:id', updateJob); // Not implemented yet
// router.delete('/jobs/:id', deleteJob); // Not implemented yet

// Application management routes
// router.get('/jobs/:jobId/applications', getApplications as RequestHandler); // Temporarily disabled
router.put('/applications/:id/status', updateApplicationStatus as RequestHandler);

// Dashboard routes
router.get('/dashboard/stats', getOrganizationStats as RequestHandler);
router.get('/dashboard/active-jobs', getActiveJobs as RequestHandler);

export default router;
