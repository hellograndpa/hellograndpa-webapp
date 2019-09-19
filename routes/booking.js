const express = require('express');

const router = express.Router();

const House = require('../models/House');

const Booking = require('../models/Booking');

const Message = require('../models/Message');

const { isLogged } = require('../middlewares/logIn');

const { servicesArray } = require('../middlewares/enumerables');

// start a new booking
router.get('/:id', isLogged, async (req, res, next) => {
  const { id } = req.params;
  const { rGroup } = req.query;
  const dateIn = rGroup[0];
  const dateOut = rGroup[1];
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

  const services = [];

  servicesArray.forEach((service) => {
    if (req.body[service.serviceType]) {
      services.push({
        serviceType: service.serviceType,
        points: service.points,
      });
    }
  });

  const newBooking = {
    user,
    house,
    dateIn: req.body.dateIn,
    dateOut: req.body.dateOut,
    status: 'pending',
    priceInit: req.body.priceInitHidden,
    discount: req.body.discountHidden,
    priceEnd: req.body.priceEndHidden,
    sevicestoHosterCompromise: services,
  };

  const bookingCreated = await Booking.create(newBooking);

  let { bookedDates } = await House.findById(house, 'bookedDates');
  let dateAct = new Date(
    newBooking.dateIn.substring(0, 4),
    newBooking.dateIn.substring(4, 6) - 1,
    '01',
  );
  const dateOut = new Date(
    newBooking.dateOut.substring(0, 4),
    newBooking.dateOut.substring(4, 6) - 1,
    '01',
  );

  while (dateAct <= dateOut) {
    bookedDates.push(
      parseInt(
        dateAct.getFullYear().toString() +
          ('0' + (dateAct.getMonth() + 1)).slice(-2),
      ),
    );
    dateAct.setMonth(dateAct.getMonth() + 1);
  }

  await House.findByIdAndUpdate(house, { bookedDates });

  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const dateTime = date + ' ' + time;

  const houseSelected = await House.findById(house).populate('user');

  const newMessage = {
    userTo: user,
    userFrom: houseSelected.user._id,
    booking: bookingCreated._id,
    message: 'SomeOne wants to join you',
    sentDateHour: dateTime,
    readed: false,
  };

  await Message.create(newMessage);

  res.redirect('/user/bookings');
});

function pad(num, size) {
  let s = `${num}`;
  while (s.length < size) s = `0${s}`;
  return s;
}

const arrMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

router.get('/calendar/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const { bookedDates } = await House.findById(id);
    let calText = '';
    const actualMonthYear = 201909;

    for (let i = 2019; i < 2025; i++) {
      calText +=
        '<div class="carousel-item  grey lighten-5 white-text checkboxes" href="#one!">';
      calText += '<div class="calendar-year-wrapper">';
      calText += `<div class="year-title">${i}</div>`;
      calText += '<div class="row">';
      for (let m = 1; m < 13; m++) {
        const yearMonth = i + pad(m, 2);

        calText += '<div class="col s6 m3">';

        if (
          parseInt(yearMonth) <= actualMonthYear ||
          bookedDates.filter((date) => date === parseInt(yearMonth)).length > 0
        ) {
          calText += `<label class="none lbldate" for="${yearMonth}">${
            arrMonths[m - 1]
          }</label>`;
        } else {
          calText += `<input type="checkbox" name="rGroup" class="chkDate" value="${yearMonth}" id="${yearMonth}"  />`;
          calText += `<label class="whatever lbldate" for="${yearMonth}">${
            arrMonths[m - 1]
          }</label>`;
        }

        calText += '</div>';
      }
      calText += '</div></div></div>';
    }
    res.send(calText);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
