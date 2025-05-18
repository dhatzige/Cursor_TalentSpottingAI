import express from 'express';
import { 
  getRecommendedJobs, 
  getApplicationStatus, 
  getStudentStats,
  applyForJob,
  getApplicationDetails
} from '../controllers/student.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

// All routes require authentication and student role
router.use(authenticateToken as express.RequestHandler, authorizeRoles(['student']) as express.RequestHandler);

// Dashboard routes
router.get('/dashboard/stats', getStudentStats as express.RequestHandler);
router.get('/recommended-jobs', getRecommendedJobs as express.RequestHandler);

// Application routes
router.get('/applications', getApplicationStatus as express.RequestHandler);
router.get('/applications/:id', getApplicationDetails as express.RequestHandler);
router.post('/jobs/:jobId/apply', upload.single('resume'), applyForJob as express.RequestHandler);

export default router;
