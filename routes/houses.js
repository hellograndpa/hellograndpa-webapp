const express = require('express');

const router = express.Router();
const HouseDetails = require('../models/House');

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
// Get id from url
router.get('/:id', async (req, res, next) => {
  // get info from ddbb
  const { id } = req.params;
  try {
    const house = await HouseDetails.findById(id);
    if (house) {
      res.render('houseDetail', house);
    } else {
      const error = new Error('Error 404');
      Error.status = 404;
      // next(error);
      throw error;
    }
  } catch (error) {
    next(error);
  }
  // send info to view

  res.render('houses/show');
});

module.exports = router;
