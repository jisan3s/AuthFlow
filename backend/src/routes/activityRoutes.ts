import express from 'express';
import {
    createActivity,
    getAllActivities,
    getUserActivities
} from '../controllers/activityController';

import { verifyToken, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

// log activity (any logged-in user)
router.post('/log', verifyToken, createActivity);

// admin view all
router.get('/all', verifyToken, authorizeRoles('MAIN_ADMIN', 'ADMIN'), getAllActivities);

// user view own
router.get('/me', verifyToken, getUserActivities);

export default router;