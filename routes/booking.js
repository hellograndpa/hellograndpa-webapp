const express = require('express');

const router = express.Router();

const House = require('../models/House');

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
        (service) => service.requirement === true,
      );
      let sumPointsMandatory = mandatoryServices.reduce(
        (prev, current) => prev.points + current.points,
      );
      sumPointsMandatory *= 2;
      const finalFisrtPrice = house.rentroom.costpermonth - sumPointsMandatory;

      res.render('bookings/create', {
        house, mandatoryServices, optionalServices, dateIn, dateOut, sumPointsMandatory, finalFisrtPrice,
      });
    } else {
      // error no hay casa
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;
