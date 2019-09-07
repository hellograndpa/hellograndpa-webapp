const express = require('express');

const router = express.Router();

// Get a list of houses available
router.get('/', (req, res) => {
  // get params from querystring
  // Get info from ddbb and sendit to the view
  res.render('houses/list');
});

// insert a house (if logged)
router.post('/', (req, res) => {
  // get parameters from body
  // insert into ddbb
  res.redirect('/houses/:id');
});

// Show form to create a house (if logged)
router.get('/create', (req, res) => {
  res.render('houses/create');
});

// Show details of a house
router.get('/:id', (req, res) => {
  // Get id from url
  // get info from ddbb
  // send info to view
  res.render('houses/show');
});

module.exports = router;
