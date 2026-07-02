import { Router } from 'express';
import { trackAnalytics, getDashboardStats } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Ingestion endpoint for frontend tracking
router.post('/track', trackAnalytics);

// Admin dashboard endpoint
router.get('/dashboard', authenticate, getDashboardStats);

export default router;
