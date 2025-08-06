const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [3, 'First name must be at least 3 characters long'],
        maxlength: [20, 'First name must be at most 20 characters long'],
        trim: true

    },
    lastName: {
        type: String,
        required: true,
        minlength: [3, 'Last name must be at least 3 characters long'],
        maxlength: [20, 'Last name must be at most 20 characters long'],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email address'],

    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],

    },
    otp: {
        type: String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    exp: {
        type: Date,
        
    },
    token: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        default: 'profile.png',
    }
}, 
{
    timestamps: true
}
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);