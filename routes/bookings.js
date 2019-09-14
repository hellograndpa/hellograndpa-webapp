const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

// details one of my bookings
router.get('/:id', (req, res, next) => {
  res.render('bookings/show');
});

// fet form to review a booking
router.get('/:id/r&r', (req, res, next) => {
  res.render('bookings/r&r');
});

// create a review
router.post('/:id/r&r', (req, res, next) => {
  res.redirect('/user/bookings/:id');
});

module.exports = router;
