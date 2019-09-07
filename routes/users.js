const express = require('express');

const router = express.Router();

// Get profile (if logged)
// de hecho si esta loggeado no necesitamos el id por la url
// lo pillamos de la sessión
router.get('/', (req, res, next) => {
  res.render('user/show');
});

// Create a new user
router.post('/', (req, res, next) => {
  res.redirect('/user');
});

module.exports = router;
