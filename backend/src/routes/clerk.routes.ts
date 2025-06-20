import express from 'express';
import { syncClerkUser } from '../controllers/clerk.controller';

const router = express.Router();

// POST /api/clerk/sync
import { clerkAuth } from '../middleware/clerkAuth';

router.post('/sync', clerkAuth, syncClerkUser);

export default router;
