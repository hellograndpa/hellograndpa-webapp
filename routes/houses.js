const express = require('express');
const { isLogged } = require('../middlewares/logIn');
const { checkUserTypeGranpa, checkUserHaveOneHouse } = require('../middlewares/validationsign');
const User = require('../models/User');
const House = require('../models/House');

const router = express.Router();
const HouseDetails = require('../models/House');

// Get a list of houses available
router.get('/', async (req, res, next) => {
  const { city } = req.query;

  try {
    const houses = await House.find({
      'address.city': city,
    }).populate('mentor user');
    res.render('houses/list', { houses });
  } catch (error) {
    next(error);
  }
});

// insert a house (if logged)
router.post('/', checkUserTypeGranpa, checkUserHaveOneHouse, async (req, res, next) => {
  const {
    rooms,
    m2,
    description,
    street,
    city,
    state,
    country,
    zip,
    features,
    electro,
    sevicesincluded,
    adr,
    abr,
    afr,
    agr,
    azr,
    adm,
    abm,
    afm,
    agm,
    azm,
    restricciones,
    roomm2,
    wardrobes,
    window,
    wc,
    balcony,
    heat,
    ac,
    tv,
    table,
    chair,
    costpermonth,
    othersThings,
  } = req.body;
  try {
    const user = req.session.currentUser._id;
    // create house
    await House.create({
      user,
      rooms,
      m2,
      description,
      address: {
        street,
        city,
        state,
        country,
        zip,
      },
      features,
      electro,
      sevicesincluded,
      sevicestohoster: [
        {
          typesevice: 'ad',
          points: 10,
          requirement: adr,
          mandatory: adm,
        },
        {
          typesevice: 'ab',
          points: 20,
          requirement: abr,
          mandatory: abm,
        },
        {
          typesevice: 'af',
          points: 30,
          requirement: afr,
          mandatory: afm,
        },
        {
          typesevice: 'ag',
          points: 40,
          requirement: agr,
          mandatory: agm,
        },
        {
          typesevice: 'az',
          points: 50,
          requirement: azr,
          mandatory: azm,
        },
      ],
      restricciones,
      rentroom: {
        m2: roomm2,
        wardrobes,
        window,
        wc,
        balcony,
        heat,
        ac,
        tv,
        table,
        chair,
        costpermonth,
      },
      othersThings,
    });
    req.flash('info', 'house created');
    res.redirect('/');
  } catch (error) {
    req.flash('error', `Some error happen - Please try again  ${window} ${wc}`);
    res.redirect('/');
  }
});

// Show form to create a house (if logged)
router.get('/create', isLogged, checkUserTypeGranpa, checkUserHaveOneHouse, (req, res) => {
  res.render('houses/create');
});

// Show details of a house
// Get id from url
router.get('/:id', async (req, res, next) => {
  // get info from ddbb
  const { id } = req.params;
  console.log(id);
  try {
    const house = await HouseDetails.findById(id).populate('user');
    if (house) {
      res.render('houses/show', { house });
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
  //res.render('houses/show');
});

module.exports = router;
