import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    drink: {
        canReceived: {
            type: Boolean,
            default : true
        },
        canSend: {
            type: Boolean,
            default: true,
        },
        drinked: {
            type: Boolean,
            // default: false, Cause pussy from start?
        },
        date: {
            type: Number
        }
    },
    shotNumber: {
        type: Number,
        default : 17
    }
}, { timestamps: true });

const User = mongoose.model('user', userSchema);

export { User };
