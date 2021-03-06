const mongoose = require('mongoose');

const { Schema } = mongoose;

const { sevicesArray } = require('../middlewares/enumerables');

const BookingSchema = new Schema(
  {
    userFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userTo: {
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
      enum: ['pending', 'reserved', 'payed', 'cancelled'],
    },
    priceInit: Number,
    discount: { type: Number, default: 0 },
    priceEnd: { type: Number, default: 0 },
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
