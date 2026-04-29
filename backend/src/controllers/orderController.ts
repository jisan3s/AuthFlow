import { Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';

interface CheckoutItem {
    productId: string;
    quantity: number;
}

const appUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

const createStripeSession = async (orderId: string, items: any[]) => {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
        return {
            id: `local_${orderId}`,
            url: `${appUrl}/checkout/success?orderId=${orderId}&local=true`
        };
    }

    const body = new URLSearchParams();
    body.set('mode', 'payment');
    body.set('success_url', `${appUrl}/checkout/success?orderId=${orderId}`);
    body.set('cancel_url', `${appUrl}/checkout/cancel?orderId=${orderId}`);
    body.set('metadata[orderId]', orderId);

    items.forEach((item, index) => {
        body.set(`line_items[${index}][quantity]`, String(item.quantity));
        body.set(`line_items[${index}][price_data][currency]`, 'usd');
        body.set(`line_items[${index}][price_data][unit_amount]`, String(Math.round(item.price * 100)));
        body.set(`line_items[${index}][price_data][product_data][name]`, item.name);
        body.set(`line_items[${index}][price_data][product_data][images][0]`, item.imageUrl);
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${stripeSecret}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Stripe checkout session failed');
    }

    return response.json() as Promise<{ id: string; url: string }>;
};

export const createCheckoutSession = async (req: any, res: Response) => {
    try {
        const cartItems = (req.body.items || []) as CheckoutItem[];
        if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

        const productIds = cartItems.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds }, isActive: true });

        const orderItems = cartItems.map((item) => {
            const quantity = Number(item.quantity);
            const product = products.find(current => current._id.toString() === item.productId);

            if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
                return null;
            }

            return {
                product: product._id,
                name: product.name,
                price: product.price,
                quantity,
                imageUrl: product.imageUrl
            };
        });

        if (orderItems.some(item => !item)) {
            return res.status(400).json({ message: 'Cart contains unavailable products or invalid quantities' });
        }

        const validItems = orderItems as NonNullable<(typeof orderItems)[number]>[];
        const totalAmount = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await Order.create({
            user: req.user.id,
            items: validItems,
            totalAmount,
            currency: 'usd'
        });

        const session = await createStripeSession(order._id.toString(), validItems);
        order.stripeSessionId = session.id;
        order.checkoutUrl = session.url;
        await order.save();

        res.status(201).json({
            orderId: order._id,
            sessionId: session.id,
            checkoutUrl: session.url,
            totalAmount
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to start checkout' });
    }
};

export const getMyOrders = async (req: any, res: Response) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch {
        res.status(500).json({ message: 'Failed to load orders' });
    }
};
