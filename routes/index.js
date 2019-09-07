const express = require('express');

const router = express.Router();

// Get home page
router.get('/', (req, res) => {
  res.render('index');
});

// LogOut
router.post('/logout', (req, res) => {
  res.render('/');
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

// login post
router.post('/login', (req, res) => {
  res.redirect('/user');
});

module.exports = router;
