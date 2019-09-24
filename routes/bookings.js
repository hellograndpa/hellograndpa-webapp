const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();
const { isLogged } = require('../middlewares/logIn');


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

//BOOKINGS LIST
router.get('/', async (req, res, next) => {
  try {
    // TODO: buscar en bookings todos los que tengan el userId de currentUser

    const { ObjectId } = require('mongoose').Types;
    const userBookings = await Booking.find({
      user: new ObjectId(req.session.currentUser._id)
    }).populate('house');
    userBookings.forEach((booking) => {

      const dateInDate = new Date(booking.dateIn.substring(0, 4), booking.dateIn.substring(4, 6), '01').toDateString();
      booking.dateInDate = dateInDate;

      const dateOutDate = new Date(booking.dateOut.substring(0, 4), booking.dateOut.substring(4, 6), '01').toDateString();
      booking.dateOutDate = dateOutDate;

    });
    // TODO: Comprobar si me ha devuelto algo
    if (userBookings.length === 0) {
      req.flash('info', 'Not a booking yet');
    }
    res.render('bookings/list', { userBookings });
  } catch (error) {
    req.flash('error', `Some error happen - Please try again ${error}`);
    res.render('/');
  }
});

//TO DO  - Find over find over and over...
// router.get('/inbox', isLogged, async (req, res, next) => {
//   try {
//     const { ObjectId } = require('mongoose').Types;
//     const grandPaBookingList = await Booking.find({
//       'house.user': new ObjectId(req.session.currentUser._id),
//     }).populate('user house');
//     res.render('user/bookings/', { grandPaBookingList });
//   } catch (error) {
//     res.render('/');
//   }
// });

module.exports = router;
