import { Request, Response } from 'express';
import User from '../models/User';
import Activity from '../models/Activity';
import Product from '../models/Product';

export const getDashboardStats = async (_req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'USER' });
        const totalAdmins = await User.countDocuments({ role: 'ADMIN' });
        const totalMainAdmins = await User.countDocuments({ role: 'MAIN_ADMIN' });
        const totalAllUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ isActive: true });

        const totalActivities = await Activity.countDocuments();

        const recentActivities = await Activity.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email role isBlocked');

        res.json({
            totalUsers,
            totalAdmins,
            totalMainAdmins,
            totalAllUsers,
            totalProducts,
            activeProducts,
            totalActivities,
            recentActivities
        });

    } catch (err) {
        res.status(500).json(err);
    }
};
