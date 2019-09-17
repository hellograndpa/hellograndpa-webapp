const express = require('express');

const formidable = require('formidable');

const {
  isLogged,
} = require('../middlewares/logIn');
const {
  checkUserTypeGranpa,
  checkUserHaveOneHouse,
} = require('../middlewares/validationsign');

const User = require('../models/User');

const House = require('../models/House');

const router = express.Router();
const HouseDetails = require('../models/House');

const {
  servicesArray,
  featuresArray,
  electroArray,
  sevicesIncludedArray,
} = require('../middlewares/enumerables');

// Get a list of houses available
router.get('/', async (req, res, next) => {
  const {
    city,
  } = req.query;

  try {
    const houses = await House.find({
      'address.city': city,
    }).populate('mentor user');
    res.render('houses/list', {
      houses,
    });
  } catch (error) {
    next(error);
  }
});

// insert a house (if logged)
router.post('/create/step-1', checkUserTypeGranpa, async (req, res, next) => {
  const {
    title,
    street,
    city,
    state,
    country,
    zip,
  } = req.body;
  try {
    const user = req.session.currentUser._id;
    const {
      ObjectId,
    } = require('mongoose').Types;
    const query = {
      user: new ObjectId(req.session.currentUser._id),
    };
    const house = await House.findOne(query);
    // create house
    if (house) {
      await House.findByIdAndUpdate(house._id, {
        address: {
          street,
          city,
          state,
          country,
          zip,
        },
      });

      req.flash('info', 'Address house UUPDATE');
    } else {
      await House.create({
        user,
        address: {
          street,
          city,
          state,
          country,
          zip,
        },
      });
      req.flash('info', 'Address house CREATE');
    }
    res.redirect('/houses/create/step-1');
  } catch (error) {
    req.flash('error', 'Some error happen - Please try again');
    res.redirect('/');
  }
});
router.post('/create/step-2', checkUserTypeGranpa, async (req, res, next) => {
  const {
    title,
    rooms,
    m2,
    description,
    features,
    electro,
    sevicesincluded,
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
  } = req.body;
  try {
    // const house = await House.find({ user: req.session.currentUser._id });
    const user = req.session.currentUser._id;
    const {
      ObjectId,
    } = require('mongoose').Types;
    const query = {
      user: new ObjectId(req.session.currentUser._id),
    };
    const house = await House.findOne(query);
    await House.findByIdAndUpdate(house._id, {
      title,
      rooms,
      m2,
      description,
      features,
      electro,
      sevicesincluded,
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
      },
    });
    req.flash('info', 'FEATURES house created');
    res.redirect('/houses/create/step-2');
  } catch (error) {
    req.flash('error', 'Some error happen - Please try again');
    res.redirect('/houses/create/step-2');
  }
});

router.post('/create/step-3', checkUserTypeGranpa, async (req, res, next) => {
  const services = [];

  servicesArray.forEach((service) => {
    const requirement = (req.body[service.serviceType] === 'req');
    const mandatory = (req.body[service.serviceType] === 'mandatory');
    services.push({
      serviceType: service.serviceType,
      points: service.points,
      requirement,
      mandatory,
      description: service.description,
    });
  });
  console.log('services', services);
  const {
    restricciones,
    costpermonth,
    deposit,
  } = req.body;
  const newConst = parseInt(costpermonth);
  try {
    // const house = await House.find({ user: req.session.currentUser._id });
    const {
      ObjectId,
    } = require('mongoose').Types;
    const query = {
      user: new ObjectId(req.session.currentUser._id),
    };
    const house = await House.findOne(query);
    // create house
    await House.findByIdAndUpdate(house._id, {
      sevicestohoster: services,
      restricciones,
      rentroom: {
        costpermonth: newConst,
        deposit,
      },
      canActive: true,
    });
    req.flash('info', 'SERVICES HSOTER CREATED');
    res.redirect('/houses/create/step-3');
  } catch (error) {
    req.flash('error', 'Some error happen - Please try again');
    res.redirect('/houses/create/step-3');
  }
});

// UPLOAD FILES
router.post('/create/step-upload', isLogged, checkUserTypeGranpa, async (req, res) => {
  const {
    ObjectId,
  } = require('mongoose').Types;
  const query = {
    user: new ObjectId(req.session.currentUser._id),
  };
  const house = await House.findOne(query);
  const {
    photos,
  } = house;

  // formidable is a npm package
  const form = new formidable.IncomingForm();

  form.parse(req);
  // you need control where you put the file
  form.on('fileBegin', (name, file) => {
    file.path = `${__dirname}/../public/images/pictures/${house.id}_house_${photos.length + 1}`; // __dirname now is the router path
  });

  // save the file path into de date base
  form.on('file', async (name, file) => {
    req.flash('info', 'upload ');
    photos.push(`/images/pictures/${house.id}_house_${photos.length + 1}`); // the path estart inside of public/
    await House.findByIdAndUpdate(house._id, {
      photos,
    });
    res.redirect('/houses/create/step-upload');
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

// Show form to create a house (if logged)
router.get('/create', isLogged, checkUserTypeGranpa, checkUserHaveOneHouse, (req, res) => {
  res.render('houses/create');
});
router.get('/create/step-1', isLogged, checkUserTypeGranpa, async (req, res, next) => {
  const house = await House.findOne({
    user: req.session.currentUser._id,
  });
  req.flash('info', 'house created step 1');
  res.render('houses/create/step-1', {
    house,
  });
});
router.get('/create/step-2', isLogged, checkUserTypeGranpa, async (req, res) => {
  const house = await House.findOne({
    user: req.session.currentUser._id,
  });
  req.flash('info', 'house created step 2');
  res.render('houses/create/step-2', {
    house,
    featuresArray,
    electroArray,
    sevicesIncludedArray,
  });
});
router.get('/create/step-3', isLogged, checkUserTypeGranpa, async (req, res) => {
  const house = await House.findOne({
    user: req.session.currentUser._id,
  });
  req.flash('info', 'house created step 3');
  res.render('houses/create/step-3', {
    house,
    servicesArray,
  });
});
router.get('/create/step-upload', isLogged, checkUserTypeGranpa, async (req, res) => {
  const house = await House.findOne({
    user: req.session.currentUser._id,
  });
  req.flash('info', 'photo uploaded');
  res.render('houses/create/step-upload', {
    house,
  });
});

// Show details of a house
// Get id from url
router.get('/:id', async (req, res, next) => {
  // get info from ddbb
  const {
    id,
  } = req.params;
  try {
    const house = await HouseDetails.findById(id).populate('user');
    if (house) {
      res.render('houses/show', {
        house,
      });
    } else {
      const error = new Error('Error 404');
      Error.status = 404;
      // next(error);
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
