const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const moment = require('moment');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/classifiedPortal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// EJS Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method Override
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.session.user || null;
    res.locals.moment = moment; // Make moment available in all views
    next();
});

// Routes
app.use('/', require('./src/routes/index'));
app.use('/listings', require('./src/routes/listings'));
app.use('/users', require('./src/routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 