import express from 'express';
import { authorizeRoles, verifyToken } from '../middleware/authMiddleware';
import { createCheckoutSession, getMyOrders } from '../controllers/orderController';

const router = express.Router();

router.post('/checkout-session', verifyToken, authorizeRoles('USER'), createCheckoutSession);
router.get('/my-orders', verifyToken, authorizeRoles('USER'), getMyOrders);

export default router;
