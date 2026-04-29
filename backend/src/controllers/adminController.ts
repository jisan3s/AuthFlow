import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';

const userProjection = 'name email role isBlocked createdAt';

// MAIN_ADMIN creates ADMIN
export const createAdmin = async (req: any, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'ADMIN'
        });

        res.status(201).json(admin);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getAdmins = async (_req: Request, res: Response) => {
    const admins = await User.find({
        role: { $in: ['MAIN_ADMIN', 'ADMIN'] }
    })
        .select(userProjection)
        .sort({ role: 1, createdAt: -1 });

    res.json(admins);
};

// Get all users (MAIN_ADMIN only)
export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await User.find({ role: 'USER' })
        .select(userProjection)
        .sort({ createdAt: -1 });

    res.json(users);
};

export const toggleAdminBlock = async (req: Request, res: Response) => {
    const admin = await User.findById(req.params.id);

    if (!admin || !['MAIN_ADMIN', 'ADMIN'].includes(admin.role)) {
        return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.role === 'MAIN_ADMIN') {
        return res.status(403).json({ message: 'MAIN_ADMIN cannot be blocked' });
    }

    admin.isBlocked = !admin.isBlocked;
    await admin.save();

    return res.json(admin);
};

export const deleteAdmin = async (req: Request, res: Response) => {
    const admin = await User.findById(req.params.id);

    if (!admin || !['MAIN_ADMIN', 'ADMIN'].includes(admin.role)) {
        return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.role === 'MAIN_ADMIN') {
        return res.status(403).json({ message: 'MAIN_ADMIN cannot be deleted' });
    }

    await admin.deleteOne();
    return res.json({ message: 'Admin deleted successfully' });
};

export const toggleUserBlock = async (req: Request, res: Response) => {
    const user = await User.findOne({ _id: req.params.id, role: 'USER' });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
    const user = await User.findOne({ _id: req.params.id, role: 'USER' });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    return res.json({ message: 'User deleted successfully' });
};