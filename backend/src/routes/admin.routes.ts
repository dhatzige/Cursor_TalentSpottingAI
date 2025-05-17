import express from 'express';
import { getDashboardStats, getRecentActivity } from '../controllers/admin.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken, authorizeRoles(['admin']));

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activity', getRecentActivity);

export default router;
