const express = require('express');


const router = express.Router();
const House = require('../models/House');


router.get('/houses', async (req, res) => {
  try {
    const houses = await House.find();
    const dataHouseLocation = {
      type: 'FeatureCollection',
      features: [
      ],
    };

    houses.forEach((e) => {
      dataHouseLocation.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-77.034084142948,
            38.909671288923,
          ],
        },
        properties: {
          title: e.title,
          phoneFormatted: '(202) 234-7336',
          phone: '2022347336',
          address: e.address.street,
          city: e.address.city,
          country: e.address.country,
          crossStreet: '',
          postalCode: e.address.postalCode,
          state: 'D.C.',
        },
      });
    });


    res.json(dataHouseLocation);
  } catch (error) {
    next(error);
  }
});
router.get('/busqueda', async (req, res) => {
  try {
    const houses = await House.find();
    const dataHouseLocation = {
      type: 'FeatureCollection',
      features: [
      ],
    };

    houses.forEach((e) => {
      dataHouseLocation.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-77.034084142948,
            38.909671288923,
          ],
        },
        properties: {
          title: e.title,
          phoneFormatted: '(202) 234-7336',
          phone: '2022347336',
          address: e.address.street,
          city: e.address.city,
          country: e.address.country,
          crossStreet: '',
          postalCode: e.address.postalCode,
          state: 'D.C.',
        },
      });
    });


    res.render('map');
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const houses = await House.find();
    const dataHouseLocation = {
      type: 'FeatureCollection',
      features: [
      ],
    };

    houses.forEach((e) => {
      dataHouseLocation.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [-77.034084142948,
            38.909671288923,
          ],
        },
        properties: {
          title: e.title,
          phoneFormatted: '(202) 234-7336',
          phone: '2022347336',
          address: e.address.street,
          city: e.address.city,
          country: e.address.country,
          crossStreet: '',
          postalCode: e.address.postalCode,
          state: 'D.C.',
        },
      });
    });


    res.render('map');
  } catch (error) {
    next(error);
  }
});


// create a booking
router.post('/booking', (req, res) => {
  res.redirect('/user/bookings');
});

module.exports = router;
