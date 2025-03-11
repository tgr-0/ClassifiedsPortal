const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Listing = require('../models/Listing');

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.flash('error_msg', 'Please log in to access this feature');
    res.redirect('/users/login');
};

// Get all listings
router.get('/', async (req, res) => {
    try {
        const listings = await Listing.find()
            .sort({ createdAt: -1 })
            .populate('author', 'name');
        res.render('listings/index', { listings });
    } catch (error) {
        req.flash('error_msg', 'Error loading listings');
        res.redirect('/');
    }
});

// Create new listing form
router.get('/new', isAuthenticated, (req, res) => {
    res.render('listings/new');
});

// Create new listing
router.post('/', isAuthenticated, upload.array('images', 5), async (req, res) => {
    try {
        const { title, description, price, category, location, phone, email } = req.body;
        const images = req.files.map(file => `/uploads/${file.filename}`);
        
        const listing = new Listing({
            title,
            description,
            price,
            category,
            location,
            images,
            author: req.session.user._id,
            contact: { phone, email }
        });

        await listing.save();
        req.flash('success_msg', 'Listing created successfully');
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        req.flash('error_msg', 'Error creating listing');
        res.redirect('/listings/new');
    }
});

// View single listing
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('author', 'name email');
        if (!listing) {
            req.flash('error_msg', 'Listing not found');
            return res.redirect('/listings');
        }
        res.render('listings/show', { listing });
    } catch (error) {
        req.flash('error_msg', 'Error loading listing');
        res.redirect('/listings');
    }
});

// Edit listing form
router.get('/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash('error_msg', 'Listing not found');
            return res.redirect('/listings');
        }
        if (listing.author.toString() !== req.session.user._id) {
            req.flash('error_msg', 'Not authorized');
            return res.redirect('/listings');
        }
        res.render('listings/edit', { listing });
    } catch (error) {
        req.flash('error_msg', 'Error loading listing');
        res.redirect('/listings');
    }
});

// Update listing
router.put('/:id', isAuthenticated, upload.array('images', 5), async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash('error_msg', 'Listing not found');
            return res.redirect('/listings');
        }
        if (listing.author.toString() !== req.session.user._id) {
            req.flash('error_msg', 'Not authorized');
            return res.redirect('/listings');
        }

        const { title, description, price, category, location, phone, email, status } = req.body;
        const images = req.files.map(file => `/uploads/${file.filename}`);

        listing.title = title;
        listing.description = description;
        listing.price = price;
        listing.category = category;
        listing.location = location;
        listing.contact = { phone, email };
        listing.status = status;
        if (images.length > 0) {
            listing.images = images;
        }

        await listing.save();
        req.flash('success_msg', 'Listing updated successfully');
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        req.flash('error_msg', 'Error updating listing');
        res.redirect('/listings');
    }
});

// Delete listing
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash('error_msg', 'Listing not found');
            return res.redirect('/listings');
        }
        if (listing.author.toString() !== req.session.user._id) {
            req.flash('error_msg', 'Not authorized');
            return res.redirect('/listings');
        }
        await listing.remove();
        req.flash('success_msg', 'Listing deleted successfully');
        res.redirect('/listings');
    } catch (error) {
        req.flash('error_msg', 'Error deleting listing');
        res.redirect('/listings');
    }
});

module.exports = router; 