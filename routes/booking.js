const express = require('express');

const router = express.Router();

const House = require('../models/House');

const Booking = require('../models/Booking');

const Message = require('../models/Message');

const { isLogged } = require('../middlewares/logIn');

const { servicesArray } = require('../middlewares/enumerables');

const { socketsUsers } = require('../middlewares/enumerables');

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
          service.requirement === true,
      );
      let sumPointsMandatory = 0;

      mandatoryServices.forEach(
        (element) => sumPointsMandatory += element.points
      );


      sumPointsMandatory *= 2;
      const finalFisrtPrice = house.rentroom.costpermonth - sumPointsMandatory;
      const dateInText = new Date(dateIn.substring(0, 4), dateIn.substring(4, 6)-1, '01').toDateString();
      const dateOutText = new Date(dateOut.substring(0, 4), dateOut.substring(4, 6), '01').toDateString();

      res.render('bookings/create', {
        house,
        mandatoryServices,
        optionalServices,
        dateIn,
        dateOut,
        dateInText,
        dateOutText,
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
  const houseSearch = await House.findById(house).populate('user');

  const newBooking = {
    userFrom: user,
    userTo: houseSearch.user._id,
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

  const today = new Date();
  const date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const dateTime = date + ' ' + time;

  const newMessage = {
    userTo: houseSearch.user._id,
    userFrom: user,
    booking: bookingCreated._id,
    message: 'SomeOne wants to join you!',
    sentDateHour: dateTime,
    readed: false,
  };

  await Message.create(newMessage);

  const socketId = socketsUsers[houseSearch.user._id];
  global.io.to(socketId).emit('newMessage', 'You have a new message!<br/> <a href="/user/messages/inbox">View my Inbox</a>');

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
