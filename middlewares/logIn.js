const bcrypt = require('bcrypt');
const User = require('../models/User');
const { socketsUsers } = require('../middlewares/enumerables');

const logIn = async (email, password, req, res) => {
  const user = await User.findOne({ email });
  if (user) {
    if (bcrypt.compareSync(password, user.hashpass)) {
      req.session.currentUser = user;

      global.io.sockets.on('connect', function(socket) {
          socketsUsers[user._id] = socket.id;
      });

      res.redirect('/');
    } else {
      req.flash('error', 'User or password incorrect');
      res.redirect('/');
    }
  } else {
    req.flash('error', 'User or password incorrect');
    res.redirect('/');
  }
};

const isLogged = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    req.flash('info', 'Must be Logged to acces!');
    res.redirect('/');
  }
};

module.exports = { logIn, isLogged };
