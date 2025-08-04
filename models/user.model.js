const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,

    },
    lastName: {
        type: String,
        required: true
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
    // confirmPassword: {
    //     type: String,
    //     required: true,
    //     validate: {
    //         validator: function (value) {
    //             return value === this.password;
    //         },
    //         message: 'Passwords do not match'
    //     }
    // },
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
        
    }
});

module.exports = mongoose.model('User', userSchema);