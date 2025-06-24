import express from 'express';
import { clerkAuth } from '../middleware/clerkAuth';
import * as adminController from '../controllers/admin.controller';

const router = express.Router();

// All routes require Clerk authentication
router.use(clerkAuth);

// Admin dashboard routes
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/activity', adminController.getRecentActivity);

// TODO: Implement user management routes
// router.get('/users', adminController.getUsers);
// router.post('/users', adminController.createUser);
// router.put('/users/:id', adminController.updateUser);
// router.delete('/users/:id', adminController.deleteUser);

export default router;
