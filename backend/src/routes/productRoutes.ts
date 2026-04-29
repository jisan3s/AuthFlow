import express from 'express';
import { authorizeRoles, verifyToken } from '../middleware/authMiddleware';
import {
    createProduct,
    deleteProduct,
    listManagedProducts,
    listProducts,
    updateProduct
} from '../controllers/productController';

const router = express.Router();

router.get('/', listProducts);
router.get('/manage', verifyToken, authorizeRoles('MAIN_ADMIN', 'ADMIN'), listManagedProducts);
router.post('/', verifyToken, authorizeRoles('MAIN_ADMIN', 'ADMIN'), createProduct);
router.put('/:id', verifyToken, authorizeRoles('MAIN_ADMIN', 'ADMIN'), updateProduct);
router.delete('/:id', verifyToken, authorizeRoles('MAIN_ADMIN', 'ADMIN'), deleteProduct);

export default router;
