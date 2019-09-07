const express = require('express');

const router = express.Router();

// get a list of my bookings
router.get('/', (req, res, next) => {
  res.render('bookings/list');
});

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
