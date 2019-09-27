const express = require('express');

const { logIn } = require('../middlewares/logIn');

const router = express.Router();

const House = require('../models/House');

// Get home page
router.get('/', async (req, res) => {
  await House.find().distinct('address.city', (error, cities) => {
    res.render('index', { cities });
  });
});

// LogOut
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// get form to sign up
router.get('/signup', (req, res) => {
  res.render('signup');
});

// get form for booking (if logged)
router.get('/booking', (req, res) => {
  res.render('bookings/create');
});

// create a booking
router.post('/booking', (req, res) => {
  res.redirect('/user/bookings');
});

// login form
router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    logIn(email, password, req, res);
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/');
  }
});

// about
router.get('/about', (req, res) => {
  res.render('about');
});

module.exports = router;
