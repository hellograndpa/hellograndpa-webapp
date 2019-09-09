const express = require('express');
const bcrypt = require('bcrypt');
const { isLogged } = require('../middlewares/logIn');

const {
  checkfieldsEmpty,
  checkCorretFormatEmail,
} = require('../middlewares/validationsign');
const User = require('../models/User');

const router = express.Router();
const bcryptSalt = 10;

// Get profile (if logged)
// de hecho si esta loggeado no necesitamos el id por la url
// lo pillamos de la sessión
router.get('/', isLogged, (req, res, next) => {
  res.render('user/show');
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

module.exports = router;
