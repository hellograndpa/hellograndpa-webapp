const express = require('express');
const bcrypt = require('bcrypt');
const formidable = require('formidable');
const fs = require('fs');

const { isLogged } = require('../middlewares/logIn');
const {
  checkfieldsEmpty,
  checkCorretFormatEmail,
} = require('../middlewares/validationsign');

const User = require('../models/User');

const Booking = require('../models/Booking');

const router = express.Router();

const bcryptSalt = 10;

// Get profile (if logged)
// de hecho si esta loggeado no necesitamos el id por la url
// lo pillamos de la sessión
router.get('/step-1', isLogged,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.session.currentUser._id);
      let male = false;
      let female = false;

      if (user.gender === 'male') {
        male = true;
        female = false;
      } else if (user.gender === 'female') {
        male = false;
        female = true;
      } else {
        male = false;
        female = false;
      }
      req.flash('info', 'Usuario ok');
      res.render('user/user-step-1', { user, male, female });
    } catch (error) {
      req.flash('error', 'Some error happen - Please try again');
      res.render('/');
    }
  });

// Create a new user
router.post(
  '/',
  checkfieldsEmpty,
  checkCorretFormatEmail,
  async (req, res, next) => {
    const {
      email,
      firstname,
      lastname,
      month,
      day,
      year,
      pass,
    } = res.locals.auth;
    try {
      const existEmail = await User.findOne({ email });
      if (existEmail) {
        req.flash('error', 'Usuario ya existe');
        res.redirect('/signup');
      } else {
        const birthday = `${year}-${month}-${day}`;
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashpass = bcrypt.hashSync(pass, salt);

        // create date
        await User.create({
          username: { firstname, lastname },
          email,
          hashpass,
          birthday,
        });
        req.flash('info', 'user created');
        res.redirect('/');
      }
    } catch (error) {
      req.flash('error', 'Some error happen - Please try again');
      res.redirect('/signup');
    }
  },
);
// update the data  // use req.body
router.post('/update',
  async (req, res, next) => {
    const {
      firstname,
      lastname,
      month,
      day,
      year,
      bio,
      gender,
      street,
      city,
      state,
      country,
      zip,
      idCard,
      phone,
      typeUser,
    } = req.body;
    try {
      let grandpaUser = false;
      let mentorUser = false;
      if (typeUser === 'Grandpa') {
        grandpaUser = true;
      } else if (typeUser === 'Mentor') {
        mentorUser = true;
      } else if (typeUser === 'Normal') {
        grandpaUser = false;
        mentorUser = false;
      }
      await User.findByIdAndUpdate(req.session.currentUser._id, {
        username: { firstname, lastname },
        month,
        day,
        year,
        bio,
        gender,
        address: {
          street, city, state, country, zip,
        },
        idCard,
        phone,
        grandpaUser,
        mentorUser,
      });
      req.flash('info', `user ${req.session.currentUser._id} has been update`);
      res.redirect('/user/step-1');
    } catch (error) {
      req.flash('error', 'Some error happen - Please try again');
      res.redirect('/user/step-1');
    }
  });
router.get('/bookings', isLogged, async (req, res, next) => {
  try {
    // TODO: buscar en bookings todos los que tengan el userId de currentUser
    const userBookings = await Booking.find({user: req.session.currentUser._id});
    // TODO: Comprobar si me ha devuelto algo
    if (userBookings.length === 0) {
      req.flash('info', 'Not a booking yet');
    }
    res.render('bookings/list', { userBookings });
  } catch (error) {
    req.flash('error', 'Some error happen - Please try again');
    res.render('/');
  }
});

router.post('/avatar-upload', isLogged, async (req, res) => {
  const user = await User.findById(req.session.currentUser._id);

  // formidable is a npm package
  const form = new formidable.IncomingForm();

  form.parse(req);
  // you need control where you put the file
  form.on('fileBegin', (name, file) => {
    file.path = `${__dirname}/../public/images/avatar/${user.id}_avatar`;// __dirname now is the router path
  });

  // save the file path into de date base
  form.on('file', async (name, file) => {
    req.flash('info', 'upload ');
    const avatar = `/images/avatar/${user.id}_avatar`;// the path estart inside of public/
    await User.findByIdAndUpdate(user._id,
      { avatar });
    res.redirect('/user/avatar-upload');
  });
  // error control
  form.on('error', (err) => {
    req.resume();
    req.flash('error', `Some error happen ${err}`);
  });
  // aborted control
  form.on('aborted', () => {
    console.log('user aborted upload');
  });
});

router.post('/update-type',
  async (req, res, next) => {
    const {
      typeUser,
    } = req.body;
    try {
      let grandpaUser = false;
      let mentorUser = false;
      if (typeUser === 'Grandpa') {
        grandpaUser = true;
      } else if (typeUser === 'Mentor') {
        mentorUser = true;
      } else if (typeUser === 'Normal') {
        grandpaUser = false;
        mentorUser = false;
      }
      await User.findByIdAndUpdate(req.session.currentUser._id, {
        grandpaUser,
        mentorUser,
      });
      req.flash('info', `user ${req.session.currentUser._id} has been update`);
      res.redirect('/user/step-1');
    } catch (error) {
      req.flash('error', 'Some error happen - Please try again');
      res.redirect('/user/step-1');
    }
  });
router.get('/avatar-upload', isLogged, async (req, res) => {
  const user = await User.findById(req.session.currentUser._id);
  req.flash('info', 'photo uploaded');
  res.render('user/avatar-upload', { user });
});
router.get('/step-3', isLogged, async (req, res) => {
  const user = await User.findById(req.session.currentUser._id);
  req.flash('info', 'photo uploaded');
  res.render('user/user-step-3', { user });
});
module.exports = router;
