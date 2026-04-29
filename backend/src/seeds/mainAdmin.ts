import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const createMainAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        const adminEmail = process.env.MAIN_ADMIN_EMAIL;
        const adminPassword = process.env.MAIN_ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.log('MAIN_ADMIN_EMAIL and MAIN_ADMIN_PASSWORD are required');
            process.exit(1);
        }

        const existingAdmin = await User.findOne({
            role: 'MAIN_ADMIN'
        });

        if (existingAdmin) {
            console.log('MAIN_ADMIN already exists');
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        await User.create({
            name: 'Main Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'MAIN_ADMIN'
        });

        console.log('MAIN_ADMIN created successfully');
        process.exit();

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

createMainAdmin();
