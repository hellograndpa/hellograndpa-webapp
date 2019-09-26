const express = require('express');

const Booking = require('../models/Booking');
const House = require('../models/House');

const router = express.Router();
const { socketsUsers } = require('../middlewares/enumerables');
const { isLogged } = require('../middlewares/logIn');


// accept or decline an action
router.get('/:id/gest', async (req, res, next) => {
  const { id } = req.params;
  const { action, dateIn, dateOut, houseId } = req.query;

  let status = '';

  if (action === 'accept') {
    status = 'reserved';
  } else {
    status = 'cancelled';
  }
  try {
    if (action === 'accept') {
      const houseSearch = await House.findById(houseId).populate('user');
      const { bookedDates } = houseSearch;

      const dateAct = new Date(
        dateIn.substring(0, 4),
        dateIn.substring(4, 6) - 1,
        '01',
      );
      const dateOutDate = new Date(
        dateOut.substring(0, 4),
        dateOut.substring(4, 6) - 1,
        '01',
      );
      while (dateAct <= dateOutDate) {
        bookedDates.push(
          parseInt(
            dateAct.getFullYear().toString() +
              ('0' + (dateAct.getMonth() + 1)).slice(-2),
          ),
        );
        dateAct.setMonth(dateAct.getMonth() + 1);
      }
    
      await House.findByIdAndUpdate(houseId, { bookedDates });
    }
    const booking = await Booking.findByIdAndUpdate(id, { status }).populate('user');

    if (booking) {
      const socketId = socketsUsers[booking.userFrom._id];
     
      if (status === 'reserved') {
        global.io.to(socketId).emit('newMessage', 'Your booking has been accepted!! <a href="/user/bookings/">GO</a>');
      } else {
        global.io.to(socketId).emit('newMessage', 'Your booking has been declined!! <a href="/user/bookings/">GO</a>');
      }
    }
    res.send('ok');
  } catch (error) {
    res.send('ko');
  }
});

router.get('/inbox', async (req, res, next) => {
  try {
    // TODO: buscar en bookings todos los que tengan el userId de currentUser

    const { ObjectId } = require('mongoose').Types;

    const userBookings = await Booking.find({
      userTo: new ObjectId(req.session.currentUser._id)
    }).populate('house userTo userFrom');
    userBookings.forEach((booking) => {
      const dateInDate = new Date(booking.dateIn.substring(0, 4), booking.dateIn.substring(4, 6), '01').toDateString();
      booking.dateInDate = dateInDate;

      const dateOutDate = new Date(booking.dateOut.substring(0, 4), booking.dateOut.substring(4, 6), '01').toDateString();
      booking.dateOutDate = dateOutDate;
    });

    if (userBookings.length === 0) {
      req.flash('info', 'No bookings yet');
    }
    res.render('bookings/list', { userBookings });
  } catch (error) {
    req.flash('error', `Some error happen - Please try again ${error}`);
    res.render('/');
  }
});

//BOOKINGS LIST
router.get('/', async (req, res, next) => {
  try {
    // TODO: buscar en bookings todos los que tengan el userId de currentUser
    const view = 'sent';

    const { ObjectId } = require('mongoose').Types;
    const userBookings = await Booking.find({
      userFrom: new ObjectId(req.session.currentUser._id)
    }).populate('house userTo userFrom');
    userBookings.forEach((booking) => {
      const dateInDate = new Date(booking.dateIn.substring(0, 4), booking.dateIn.substring(4, 6), '01').toDateString();
      booking.dateInDate = dateInDate;

      const dateOutDate = new Date(booking.dateOut.substring(0, 4), booking.dateOut.substring(4, 6), '01').toDateString();
      booking.dateOutDate = dateOutDate;
    });

    if (userBookings.length === 0) {
      req.flash('info', 'Not a booking yet');
    }
    res.render('bookings/list', { userBookings, view });
  } catch (error) {
    req.flash('error', `Some error happen - Please try again ${error}`);
    res.render('/');
  }
});


module.exports = router;
