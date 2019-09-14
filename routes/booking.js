const express = require('express');

const router = express.Router();

const House = require('../models/House');

const Booking = require('../models/Booking');

const { isLogged } = require('../middlewares/logIn');

// start a new booking
router.get('/:id', isLogged, async (req, res, next) => {
  const { id } = req.params;
  const { dateIn, dateOut } = req.query;
  try {
    const house = await House.findById(id);
    if (house) {
      const mandatoryServices = house.sevicestohoster.filter(
        (service) => service.mandatory === true,
      );
      const optionalServices = house.sevicestohoster.filter(
        (service) =>
          service.requirement === true && service.mandatory === false,
      );
      let sumPointsMandatory = mandatoryServices.reduce(
        (prev, current) => prev.points + current.points,
      );
      sumPointsMandatory *= 2;
      const finalFisrtPrice = house.rentroom.costpermonth - sumPointsMandatory;

      res.render('bookings/create', {
        house,
        mandatoryServices,
        optionalServices,
        dateIn,
        dateOut,
        sumPointsMandatory,
        finalFisrtPrice,
      });
    } else {
      // error no hay casa
    }
  } catch (error) {
    next(error);
  }
});

router.post('/:id', isLogged, async (req, res, next) => {
  const house = req.params.id;
  const user = req.session.currentUser._id;

  const newBooking = {
    user,
    house,
    dateIn: req.body.dateIn,
    dateOut: req.body.dateOut,
    status: 'pending',
    priceInit: req.body.priceInitHidden,
    discount: req.body.discountHidden,
    priceEnd: req.body.priceEndHidden,
    sevicestoHosterCompromise: [
      { typesevice: 'ad', points: req.body.ad },
      { typesevice: 'ab', points: req.body.ab },
      { typesevice: 'af', points: req.body.af },
      { typesevice: 'ag', points: req.body.ag },
      { typesevice: 'az', points: req.body.az },
    ],
  };
  await Booking.create(newBooking);

  res.redirect('/user/bookings');
});
module.exports = router;
