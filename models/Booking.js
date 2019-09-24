const mongoose = require('mongoose');

const { Schema } = mongoose;

const { sevicesArray } = require('../middlewares/enumerables');

const BookingSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'House',
      required: true,
    },
    dateIn: String,
    dateOut: String,
    status: {
      type: String,
      enum: ['pending', 'reserve', 'pay', 'cancel'],
    },
    priceInit: Number,
    discount: Number,
    priceEnd: Number,
    sevicestoHosterCompromise: [
      {
        serviceType: String,
        points: Number,
      },
    ],
  },
  { timestamps: true },
);

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
