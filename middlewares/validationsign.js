const checkfieldsEmpty = (req, res, next) => {
  const {
 email, firstname, lastname, month, day, year, pass 
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
    res.redirect('/signup');
  } else {
    res.locals.auth = req.body;
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

module.exports = {
  checkfieldsEmpty,
  checkCorretFormatEmail,
};
