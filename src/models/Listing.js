const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Vehicles', 'Property', 'Jobs', 'Services', 'Others']
    },
    location: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contact: {
        phone: String,
        email: String
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'expired'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Listing', listingSchema); 