import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },

    role: {
        type: String,
        enum: ['MAIN_ADMIN', 'ADMIN', 'USER'],
        default: 'USER'
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);