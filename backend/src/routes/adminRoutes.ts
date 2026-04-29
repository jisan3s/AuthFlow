import express from 'express';
import {
    createAdmin,
    deleteAdmin,
    deleteUser,
    getAdmins,
    getAllUsers,
    toggleAdminBlock,
    toggleUserBlock,
} from '../controllers/adminController';
import { verifyToken, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

// Only MAIN_ADMIN can create admins
router.post(
    '/create-admin',
    verifyToken,
    authorizeRoles('MAIN_ADMIN'),
    createAdmin
);

router.get(
    '/admins',
    verifyToken,
    authorizeRoles('MAIN_ADMIN'),
    getAdmins
);

router.get(
    '/users',
    verifyToken,
    authorizeRoles('MAIN_ADMIN'),
    getAllUsers
);

router.patch(
    '/admins/:id/block',
    verifyToken,
    authorizeRoles('MAIN_ADMIN'),
    toggleAdminBlock
);

router.delete(
    '/admins/:id',
    verifyToken,
    authorizeRoles('MAIN_ADMIN'),
    deleteAdmin
);

router.patch(
    '/users/:id/block',
    verifyToken,
    authorizeRoles('MAIN_ADMIN'),
    toggleUserBlock
);

router.delete(
    '/users/:id',
    verifyToken,
    authorizeRoles('MAIN_ADMIN'),
    deleteUser
);

export default router;