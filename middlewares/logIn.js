const bcrypt = require('bcrypt');
const User = require('../models/User');

const logIn = async (email, password, req, res) => {
  const user = await User.findOne({ email });
  if (user) {
    if (bcrypt.compareSync(password, user.hashpass)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      req.flash('error', 'usuario o contraseña incorrectos');
      res.redirect('login');
    }
  } else {
    req.flash('error', 'usuario o contraseña incorrectos');
    res.redirect('login');
  }
};

const isLogged = (req, res, next) => {
  console.log('user', req.session.currentUser);
  if (req.session.currentUser) {
    next();
  } else {
    req.flash('info', 'Must be Logged to acces!');
    res.redirect('/login');
  }
};

module.exports = { logIn, isLogged };
