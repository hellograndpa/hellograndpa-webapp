const mongoose = require('mongoose');

const { Schema } = mongoose;

const sevicesArray = ['llevar al medico'];

const featuresArray = [
  'Calefaccion',
  'A/C',
  'Piscina',
  'Terraza',
  'Ascensor',
  'WIFI',
];

const electroArray = [
  'cocina',
  'nevera',
  'lavadora',
  'secadora',
  'secador de pelo',
  'horno',
  'microondas',
  'aspiradora',
  'batidora',
  'tostadora',
];

const seviciosIncludedArray = [
  'Agua',
  'agua caliene',
  'Electricidad',
  'Internet',
  'Utensilios baño',
  'desayuno',
  'cenas',
  'Utensilios cocina',
  'Cama',
];

const HouseSchema = new Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rooms: Number,
    m2: Number,
    description: String,
    address: {
      street: String,
      city: String,
      state: String,
      zip: Number,
    },
    features: [
      {
        featuretype: {
          type: String,
          enum: featuresArray,
        },
      },
    ],
    electro: [
      {
        electrotype: {
          type: String,
          enum: electroArray,
        },
      },
    ],
    seviciosincluded: [
      {
        servicetype: {
          type: String,
          enum: seviciosIncludedArray,
        },
      },
    ],
    sevicestohoster: [
      {
        servicesnecessary: {
          typesevice: {
            type: String,
            enum: sevicesArray,
          },
          points: Number,
          requirement: Boolean,
          mandatory: Boolean,
        },
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
      balcony: Boolean,
      heat: Boolean,
      ac: Boolean,
      wc: {
        type: String,
        enum: ['private bathroom', 'share bathroom'],
      },
      tv: Boolean,
      table: Boolean,
      chair: Boolean,
      costpermonth: Number,
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
  },
  { timestamps: true },
);

const House = mongoose.model('House', HouseSchema);

module.exports = House;
