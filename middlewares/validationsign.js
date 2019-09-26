const User = require('../models/User');
const House = require('../models/House');

const checkfieldsEmpty = (req, res, next) => {
  const {
    email, firstname, lastname, month, day, year, pass,
  } = req.body;

  if (
    email === ''
    || firstname === ''
    || lastname === ''
    || month === ''
    || day === ''
    || year === ''
    || pass === ''
  ) {
    req.flash('error', 'los campos con * no pueden estar vacios');
    res.redirect('/');
  } else {
    res.locals.auth = req.body;
    req.flash('info', 'no están vacios');
    next();
  }
};

const checkUploadNotEmpty = (req, res, next) => {
  const { upload } = req.body;
  if (upload === false) {
    req.flash('error', 'No has seleccioado ningna imagen');
    res.redirect('/houses/create/step-upload');
  } else {
    req.flash('info', 'no están vacios');
    next();
  }
};

const checkCorretFormatEmail = (req, res, next) => {
  const { email } = req.body;

  function emailValidator(e) {
    const regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return !!regex.test(email);
  }
  const corretEmail = emailValidator(email);
  if (corretEmail) {
    // res.locals.auth = req.body;
    req.flash('info', 'ok email');
    next();
  } else {
    req.flash('error', 'el emial no tiene formato correcto');
    res.redirect('/signup');
  }
};

const checkUserTypeGranpa = async (req, res, next) => {
  const user = await User.findById(req.session.currentUser._id);
  if (user.grandpaUser) {
    next();
  } else {
    req.flash('error', `you are not a grandpa ${user._id} ${user.grandpaUser}`);
    res.redirect('/user/step-3');
  }
};

const checkUserHaveOneHouse = async (req, res, next) => {
  const HaveHouse = await House.findOne({ user: req.session.currentUser._id });
  if (HaveHouse) {
    req.flash('error', 'you have One House please edit your house');
    res.redirect('/user');
  } else {
    req.flash('info', `it is grandpa ${HaveHouse}`);
    next();
  }
};

module.exports = {
  checkfieldsEmpty,
  checkCorretFormatEmail,
  checkUserTypeGranpa,
  checkUserHaveOneHouse,
  checkUploadNotEmpty,
};
