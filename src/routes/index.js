const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// Home page route
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find({ status: 'active' })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('author', 'name');
        
        res.render('home', {
            title: 'Classified Portal - Home',
            listings
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error loading listings');
        res.redirect('/');
    }
});

// Search route
router.get('/search', async (req, res) => {
    try {
        const { q, category } = req.query;
        const query = { status: 'active' };
        
        if (q) {
            query.$or = [
                { title: new RegExp(q, 'i') },
                { description: new RegExp(q, 'i') }
            ];
        }
        
        if (category) {
            query.category = category;
        }
        
        const listings = await Listing.find(query)
            .sort({ createdAt: -1 })
            .populate('author', 'name');
            
        res.render('search', {
            title: 'Search Results',
            listings,
            searchQuery: q,
            category
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error performing search');
        res.redirect('/');
    }
});

module.exports = router; 