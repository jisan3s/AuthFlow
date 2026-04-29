import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import User from '../models/User';

dotenv.config();

const seedProducts = [
    {
        name: 'Urban Carry Tote',
        description: 'Structured everyday tote with durable handles and a roomy interior.',
        price: 89,
        stock: 18,
        category: 'Accessories',
        imageUrl: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80',
        isActive: true
    },
    {
        name: 'Everyday Knit Set',
        description: 'Soft matching knit essentials designed for clean daily styling.',
        price: 124,
        stock: 11,
        category: 'Apparel',
        imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80',
        isActive: true
    },
    {
        name: 'Minimal Desk Lamp',
        description: 'Compact metal desk lamp with warm light for focused workspaces.',
        price: 76,
        stock: 24,
        category: 'Home',
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
        isActive: true
    }
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        const owner = await User.findOne({ role: { $in: ['MAIN_ADMIN', 'ADMIN'] } });
        if (!owner) {
            console.log('Create a MAIN_ADMIN or ADMIN before seeding products');
            process.exit(1);
        }

        for (const product of seedProducts) {
            await Product.updateOne(
                { name: product.name },
                { $set: { ...product, createdBy: owner._id } },
                { upsert: true }
            );
        }

        console.log('Products seeded successfully');
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

run();
