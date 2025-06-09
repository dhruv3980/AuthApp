const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type:String,
        enum: ['Student', 'admin', 'visitor'],
    },
});

module.exports = mongoose.model('User', userSchema);
// This code defines a Mongoose schema for a User model in a Node.js application.