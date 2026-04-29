import { Request, Response } from 'express';
import Activity from '../models/Activity';

// Create activity log
export const createActivity = async (req: any, res: Response) => {
    try {
        const activity = await Activity.create({
            userId: req.user.id,
            action: req.body.action,
            meta: req.body.meta || {}
        });

        res.status(201).json(activity);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get ALL activities (Admin)
export const getAllActivities = async (_req: Request, res: Response) => {
    const data = await Activity.find()
        .populate('userId', 'name email role')
        .sort({ createdAt: -1 });
    res.json(data);
};

// Get USER activities
export const getUserActivities = async (req: any, res: Response) => {
    const data = await Activity.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(data);
};
