import { Router, RequestHandler } from 'express';
import {
  getUniversities,
  getUniversityById,
  verifyUniversityEmail,
  getUniversityStats
} from '../controllers/university/university.controller';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getUniversities);
router.get('/:id', getUniversityById);
router.post('/verify-email', verifyUniversityEmail);

// Protected routes
router.get('/stats', authenticate as RequestHandler, getUniversityStats as RequestHandler);

export default router;
