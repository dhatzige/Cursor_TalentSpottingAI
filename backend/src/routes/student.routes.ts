import express from 'express';
import { getRecommendedJobs, getApplicationStatus, getStudentStats } from '../controllers/student.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and student role
router.use(authenticateToken, authorizeRoles(['student']));

// Dashboard routes
router.get('/dashboard/stats', getStudentStats);
router.get('/recommended-jobs', getRecommendedJobs);
router.get('/applications', getApplicationStatus);

export default router;
