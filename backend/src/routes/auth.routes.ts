import express from 'express';
import { register, login, getUserProfile } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getUserProfile);

export default router;
