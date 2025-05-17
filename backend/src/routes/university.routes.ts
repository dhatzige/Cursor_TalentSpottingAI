import express from 'express';
import { getUniversityStats, getStudentPlacement, getEmployerPartners } from '../controllers/university.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and university role
router.use(authenticateToken, authorizeRoles(['university']));

// Dashboard routes
router.get('/dashboard/stats', getUniversityStats);
router.get('/placements', getStudentPlacement);
router.get('/employer-partners', getEmployerPartners);

export default router;
