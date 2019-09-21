const express = require('express');

const formidable = require('formidable');
const fs = require('fs');

const { isLogged } = require('../middlewares/logIn');
const {
  checkUserTypeGranpa,
  checkUserHaveOneHouse,
  checkUploadNotEmpty,
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
    calefaccion,
    ac,
    piscina,
    terraza,
    ascensor,
    wifi,
    priceMin,
    priceMax,
  } = req.query;

  try {
    let houses;
    let minPrice=0;
    let maxPrice=1500;

    if(priceMin){
      minPrice=priceMin;
    }

    if(priceMax){
      maxPrice=priceMax;
    }
    const cities = await House.find().distinct('address.city');

    if (city) {
      houses = await House.find({ $and: [{ 'address.city': city }, { 'rentroom.costpermonth': { $gt: minPrice } }, { 'rentroom.costpermonth': { $lt: maxPrice } }] }).sort({ createdAt: -1 }).populate('mentor user');
    } else {
      houses = await House.find({ $and: [{ 'rentroom.costpermonth': { $gt: minPrice } }, { 'rentroom.costpermonth': { $lt: maxPrice } }] }).populate('mentor user').sort({ createdAt: -1 });
    }

    if (calefaccion) { houses = houses.filter((house) => house.features.calefaccion === true); }
    if (wifi) { houses = houses.filter((house) => house.features.wifi === true); }
    if (ac) { houses = houses.filter((house) => house.features.ac === true); }
    if (piscina) { houses = houses.filter((house) => house.features.piscina === true); }
    if (terraza) { houses = houses.filter((house) => house.features.terraza === true); }
    if (ascensor) { houses = houses.filter((house) => house.features.ascensor === true); }

    houses.forEach((el) => {
      let newPrice = 0;

      el.priceDiscounted = el.sevicestohoster
        .filter((service) => service.mandatory === true)
        .forEach((service) => (newPrice += service.points));

      el.priceDiscounted = el.rentroom.costpermonth - newPrice * 2;

      const mandatoryServices = el.sevicestohoster.filter(
        (service) => service && service.mandatory === true,
      );
      
      mandatoryServices.forEach((service) => {
        let newLogo= servicesArray.find(
          (element) => { return element.serviceType === service.serviceType; },
        ).logo;
        service.logo = newLogo;
      });
      el.mandatoryServices = mandatoryServices;
    });

    res.render('houses/list', {
      houses,
      city,
      calefaccion,
      ac,
      piscina,
      terraza,
      ascensor,
      wifi,
      cities,
    });
  } catch (error) {
    next(error);
  }
});

// insert a house (if logged)
// TODO: CREATE WITH MAPS
// CREATE HOUSE STEP 1 - DIRECTION AND
router.post('/create/step-1', checkUserTypeGranpa, async (req, res, next) => {
  const {
    title, street, city, state, country, zip,
  } = req.body;
  try {
    const user = req.session.currentUser._id;
    const { ObjectId } = require('mongoose').Types;
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

      req.flash('info', 'Address house UPDATE');
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

// CREATE HOUSE STEP 2 - HOUSE AND ROOM DESCRIPTION
router.post('/create/step-2', checkUserTypeGranpa, async (req, res, next) => {
  const {
    title,
    rooms,
    houseM2,
    description,
    calefaccion,
    ac,
    piscina,
    terraza,
    ascensor,
    wifi,
    cocina,
    nevera,
    lavadora,
    secadora,
    secadorDePelo,
    horno,
    microondas,
    aspiradora,
    batidora,
    tostadora,
    agua,
    aguaCaliene,
    electricidad,
    internet,
    utensiliosBano,
    desayuno,
    cenas,
    utensiliosCocina,
    cama,
    roomm2,
    wardrobes,
    window,
    wc,
    balcony,
    heat,
    roomac,
    tv,
    table,
    chair,
    othersThings,
  } = req.body;
  console.log(req.body);

  const newM2 = parseInt(houseM2);
  const newRoomm2 = parseInt(roomm2);
  const newRooms = parseInt(rooms);

  try {
    // const house = await House.find({ user: req.session.currentUser._id });
    const user = req.session.currentUser._id;
    const { ObjectId } = require('mongoose').Types;
    const query = {
      user: new ObjectId(req.session.currentUser._id),
    };
    const house = await House.findOne(query);
    await House.findByIdAndUpdate(house._id, {
      title,
      rooms: newRooms,
      m2: newM2,
      description,
      features: {
        calefaccion,
        ac,
        piscina,
        terraza,
        ascensor,
        wifi,
      },
      electro: {
        cocina,
        nevera,
        lavadora,
        secadora,
        secadorDePelo,
        horno,
        microondas,
        aspiradora,
        batidora,
        tostadora,
      },
      sevicesincluded: {
        agua,
        aguaCaliene,
        electricidad,
        internet,
        utensiliosBano,
        desayuno,
        cenas,
        utensiliosCocina,
        cama,
      },
      rentroom: {
        m2: newRoomm2,
        wardrobes,
        window,
        wc,
        balcony,
        heat,
        roomac,
        tv,
        table,
        chair,
        othersThings,
      },
    });
    req.flash('info', 'FEATURES house created');
    res.redirect('/houses/create/step-2');
  } catch (error) {
    console.log(error);
    req.flash('error', `Some error happen - Please try again${error}`);
    res.redirect('/houses/create/step-2');
  }
});
// CREATE HOUSE STEP 3 - SERVICES AND COST AND DEPOSIT
router.post('/create/step-3', checkUserTypeGranpa, async (req, res, next) => {
  const services = [];

  servicesArray.forEach((service) => {
    const requirement = req.body[service.serviceType] === 'req';
    const mandatory = req.body[service.serviceType] === 'mandatory';
    services.push({
      serviceType: service.serviceType,
      points: service.points,
      requirement,
      mandatory,
      description: service.description,
    });
  });
  console.log('services', services);
  const { restricciones, costpermonth, deposit } = req.body;
  const newConst = parseInt(costpermonth);
  try {
    // const house = await House.find({ user: req.session.currentUser._id });
    const { ObjectId } = require('mongoose').Types;
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
router.post(
  '/create/step-upload',
  isLogged,
  checkUserTypeGranpa,
  checkUploadNotEmpty,
  async (req, res) => {
    const { ObjectId } = require('mongoose').Types;
    const query = {
      user: new ObjectId(req.session.currentUser._id),
    };
    const house = await House.findOne(query);
    const { photos } = house;
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
  },
);

// DELETE IMAGES
router.post('/create/delete-images', isLogged, checkUserTypeGranpa, async (req, res) => {
  const { imagesDelete } = req.body;
  const path = `${__dirname}/../public`;
  console.log(`ruta ok : ${path}${imagesDelete}`);
  try {
    console.log(imagesDelete);
    const house = await House.findOne({
      user: req.session.currentUser._id,
    });
    const index = house.photos.indexOf(imagesDelete);

    if (index !== -1) {
      house.photos.splice(index, 1);
      const { photos } = house;
      await House.findByIdAndUpdate(house._id, {
        photos,
      });
      fs.unlinkSync(`${path}${imagesDelete}`);
    }
    req.flash('info', 'removed image');
    res.redirect('/houses/create/step-upload');
  } catch (err) {
    req.flash('error', 'NO removed image');
  }
});

// Show form to create a house (if logged)
// THIS ROUTE IS DEPRECATED
router.get('/create', isLogged, checkUserTypeGranpa, checkUserHaveOneHouse, (req, res) => {
  res.render('houses/create');
});
// ALL STEPS
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
  const { id } = req.params;
  try {
    const house = await HouseDetails.findById(id).populate('user');
    if (house) {
      const mandatoryServices = house.sevicestohoster.filter((service) => service.mandatory === true);
      let points = 0;
      mandatoryServices.forEach((service) => points += service.points);
      house.discountPrice = points * 2;
      house.finalPrice = house.rentroom.costpermonth - house.discountPrice;

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
