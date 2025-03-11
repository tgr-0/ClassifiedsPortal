const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Listing = require('../models/Listing');

// Middleware to check if user is NOT authenticated
const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    res.redirect('/');
};

// Login page
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('users/login');
});

// Register page
router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('users/register');
});

// Register handle
router.post('/register', isNotAuthenticated, async (req, res) => {
    try {
        const { name, email, password, password2 } = req.body;
        const errors = [];

        // Validation
        if (!name || !email || !password || !password2) {
            errors.push({ msg: 'Please fill in all fields' });
        }
        if (password !== password2) {
            errors.push({ msg: 'Passwords do not match' });
        }
        if (password.length < 6) {
            errors.push({ msg: 'Password should be at least 6 characters' });
        }

        if (errors.length > 0) {
            return res.render('users/register', {
                errors,
                name,
                email
            });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            errors.push({ msg: 'Email is already registered' });
            return res.render('users/register', {
                errors,
                name,
                email
            });
        }

        // Create new user
        user = new User({
            name,
            email,
            password
        });

        await user.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/users/login');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error in registration');
        res.redirect('/users/register');
    }
});

// Login handle
router.post('/login', isNotAuthenticated, async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Invalid email or password');
            return res.redirect('/users/login');
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid email or password');
            return res.redirect('/users/login');
        }

        // Set session
        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };
        
        req.flash('success_msg', 'You are now logged in');
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error in login');
        res.redirect('/users/login');
    }
});

// Logout handle
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        }
        res.redirect('/users/login');
    });
});

// Profile page
router.get('/profile', async (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Please log in to view profile');
        return res.redirect('/users/login');
    }

    try {
        // Get user's listings
        const userListings = await Listing.find({ author: req.session.user._id })
            .sort({ createdAt: -1 });

        // Get complete user data
        const user = await User.findById(req.session.user._id);
        
        res.render('users/profile', { 
            user: user,
            userListings: userListings
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error loading profile');
        res.redirect('/');
    }
});

module.exports = router; 