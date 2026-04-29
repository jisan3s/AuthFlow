import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.get(
    '/stats',
    verifyToken,
    authorizeRoles('MAIN_ADMIN'),
    getDashboardStats
);

export default router;