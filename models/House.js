const mongoose = require('mongoose');

const { Schema } = mongoose;

const {
  sevicesArray,
  featuresArray,
  electroArray,
  sevicesIncludedArray,
} = require('../middlewares/enumerables');

const HouseSchema = new Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: String,
  rooms: Number,
  m2: Number,
  description: String,
  address: {
    street: String,
    city: String,
    country: String,
    state: String,
    zip: Number,
  },
  features: {
    calefaccion: Boolean,
    ac: Boolean,
    piscina: Boolean,
    terraza: Boolean,
    ascensor: Boolean,
    wifi: Boolean,
  },
  electro: {
    cocina: Boolean,
    nevera: Boolean,
    lavadora: Boolean,
    secadora: Boolean,
    secadorDePelo: Boolean,
    horno: Boolean,
    microondas: Boolean,
    aspiradora: Boolean,
    batidora: Boolean,
    tostadora: Boolean,
  },
  sevicesincluded: {
    agua: Boolean,
    aguaCaliene: Boolean,
    electricidad: Boolean,
    internet: Boolean,
    utensiliosBano: Boolean,
    desayuno: Boolean,
    cenas: Boolean,
    utensiliosCocina: Boolean,
    cama: Boolean,
  },
  sevicestohoster: [{
    serviceType: String,
    points: Number,
    requirement: Boolean,
    mandatory: Boolean,
    description: String,
  }],
  photos: { type: [String], default: '/images/pictures/default.jpg' },
  restricciones: String,
  rentroom: {
    m2: Number,
    description: String,
    address: {
      street: String,
      city: String,
      country: String,
      state: String,
      zip: Number,
    },
    features: {
      calefaccion: Boolean,
      ac: Boolean,
      piscina: Boolean,
      terraza: Boolean,
      ascensor: Boolean,
      wifi: Boolean,
    },
    electro: {
      cocina: Boolean,
      nevera: Boolean,
      lavadora: Boolean,
      secadora: Boolean,
      secadorDePelo: Boolean,
      horno: Boolean,
      microondas: Boolean,
      aspiradora: Boolean,
      batidora: Boolean,
      tostadora: Boolean,
    },
    sevicesincluded: {
      agua: Boolean,
      aguaCaliene: Boolean,
      electricidad: Boolean,
      internet: Boolean,
      utensiliosBano: Boolean,
      desayuno: Boolean,
      cenas: Boolean,
      utensiliosCocina: Boolean,
      cama: Boolean,
    },
    sevicestohoster: [
      {
        serviceType: String,
        points: Number,
        requirement: Boolean,
        mandatory: Boolean,
        description: String,
      },
    ],
    photos: [String],
    restricciones: String,
    rentroom: {
      m2: Number,
      wardrobes: {
        type: String,
        enum: ['uno', 'dos', 'tres'],
      },
      window: {
        type: String,
        enum: ['uno', 'dos', 'tres'],
      },
      wc: {
        type: String,
        enum: ['private bathroom', 'share bathroom'],
      },
      balcony: Boolean,
      heat: Boolean,
      roomac: Boolean,
      tv: Boolean,
      table: Boolean,
      chair: Boolean,
      costpermonth: Number,
      deposit: Number,
      othersThings: String,
      booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
      rateandreview: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          detail: String,
          ratings: [
            {
              ratetype: {
                type: String,
                enum: ['uno', 'dos'],
              },
              valuerate: Number,
            },
          ],
          created: {
            type: Date,
            default: Date.now,
          },
          active: Boolean,
        },
      ],
    },
    dateStart: {
      month: String,
      year: String,
    },
    visibleByUsers: Boolean,
    active: Boolean,
    canActive: Boolean,
    bookedDates: [Number],
  },
  {
    timestamps: true,
  },
);

const House = mongoose.model('House', HouseSchema);

module.exports = House;
