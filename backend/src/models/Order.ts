import mongoose, { InferSchemaType } from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'usd' },
    status: {
        type: String,
        enum: ['PENDING_PAYMENT', 'PAID', 'CANCELLED'],
        default: 'PENDING_PAYMENT'
    },
    stripeSessionId: { type: String },
    checkoutUrl: { type: String }
}, { timestamps: true });

export type OrderDocument = InferSchemaType<typeof orderSchema>;

export default mongoose.model('Order', orderSchema);
