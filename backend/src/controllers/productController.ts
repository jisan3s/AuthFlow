import { Request, Response } from 'express';
import Product from '../models/Product';

const toProductPayload = (body: any) => ({
    name: body.name,
    description: body.description,
    price: Number(body.price),
    imageUrl: body.imageUrl,
    stock: Number(body.stock),
    category: body.category || 'General',
    isActive: body.isActive ?? true
});

const isValidProduct = (payload: ReturnType<typeof toProductPayload>) => (
    payload.name &&
    payload.description &&
    payload.imageUrl &&
    Number.isFinite(payload.price) &&
    payload.price >= 0 &&
    Number.isInteger(payload.stock) &&
    payload.stock >= 0
);

export const listProducts = async (_req: Request, res: Response) => {
    try {
        const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(products);
    } catch {
        res.status(500).json({ message: 'Failed to load products' });
    }
};

export const listManagedProducts = async (_req: Request, res: Response) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch {
        res.status(500).json({ message: 'Failed to load products' });
    }
};

export const createProduct = async (req: any, res: Response) => {
    try {
        const payload = toProductPayload(req.body);
        if (!isValidProduct(payload)) {
            return res.status(400).json({ message: 'Valid name, description, image, price, and stock are required' });
        }

        const product = await Product.create({
            ...payload,
            createdBy: req.user.id
        });

        res.status(201).json(product);
    } catch {
        res.status(500).json({ message: 'Failed to create product' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const payload = toProductPayload(req.body);
        if (!isValidProduct(payload)) {
            return res.status(400).json({ message: 'Valid name, description, image, price, and stock are required' });
        }

        const product = await Product.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true
        });

        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch {
        res.status(500).json({ message: 'Failed to update product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch {
        res.status(500).json({ message: 'Failed to delete product' });
    }
};
