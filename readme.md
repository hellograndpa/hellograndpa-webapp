# HELLOGRANDPA

## Description

Rooms booking platform from older people for youth in exchange of accompaniment services.

## User Stories

**404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault

**500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

**Homepage** - Como usuario puedo buscar alojamientos libres segun la localidad y el mes.

**Listado Alojamientos** - Como usuario puedo listar los alojamientos, filtrar por localizacion, filtrar por fechas, filtrar por servicios de acompañamiento y ver en el mapa.

**Detalle de alojamiento** - Como usuario puedo ver el detalle de un alojamiento, sus reviews y el perfil del abuelo.

**Reservas** - Como usuario loggeado puedo seleccionar los servicios de acompañamiento que me comprometo a hacer, las fechas, ver el precio sin descuento y con descuento dependiendo de los servicios comprometidos, y realizar una petición de reserva, que debe ser validada por el abuelo / mentor.

**Sign up** - Como usuario me puedo registrar en la aplicación y seleccionar si soy usario, abuelo, mentor

**Login** - Como usuario me puedo loggear para acceder a mi zona de administración y poder reservar casas.

**Users Admin** - Como usuario normal puedo ver/gestionar mis reservas, casas preferidas, reviews realizadas y mi perfil. - Como usuario abuelo puedo ver/modificar/eliminar mis casas, reservas, peticiones de reserva y editar mi perfil con los requisitos de servicios obligatorios y opcionales. - Como usuario mentor puedo ver,modificar y eliminar mis datos y los de mis abuelos.

**Crear Casas** - Como usuario mentor / abuelo, puedo dar de alta una casa y habitacion

**Logout** - Como usuario puedo cerrar mi sesión.

**Repotes** - Como usuario registrado puedo hacer reportes de mal uso, comportamiento indebido, incidencias...

**Gestion Pagos** - Una vez aceptada la reserva por el abuelo, el usuario debera ir a una pasarela de pago para realizar el pago de la primera mensualidad. La plataforma se encargará de gestionar los cobros mes a mes. Hasta que el usuario indique que ha dejado el apartamento.

## ROUTES:

| Log In               | Post | /login                  |     |                 |                                  |
| -------------------- | ---- | ----------------------- | --- | --------------- | -------------------------------- |
| Sign Up Form         | GET  | /signup                 |     |                 |                                  |
| Sign Up              | Post | /users                  |     | /users/:id      |                                  |
| Log Out              | Post | /logout                 |     | /               |                                  |
| Home                 | GET  | /                       |     |                 |                                  |
| List Houses          | GET  | /houses                 |     |                 |                                  |
| House details        | GET  | /houses/:id             |     |                 |                                  |
| Profile              | GET  | /users/:id              |     |                 |                                  |
| Create House Form    | GET  | /houses/create          |     |                 |                                  |
| Create House         | POST | /houses                 |     | /houses/:id     |                                  |
| Bookings FORM        | GET  | /bookings?              |     |                 | Parámetros por get de mes y casa |
| Create Booking       | POST | /bookings               |     | /users/bookings |                                  |
| List my Bookings     | GET  | /users/bookings         |     |                 | El id del user va por session    |
| My booking detail    | GET  | /users/bookings/:id     |     |                 |                                  |
| MY bookings R&R FORM | GET  | /users/bookings/:id/r&r |     |                 |                                  |
| My Booking R&R       | POST | /users/bookings/:id/r&r |     |                 |                                  |
|                      |      |                         |     |                 |                                  |

## MODELS

### HOUSE

```
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
      },const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      firstname: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true,
      },
      lastname: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true,
      },
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    bio: String,
    avatar: String,
    birthday: Date,
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    address: {
      street: String,
      city: String,
      estate: String,
      country: String,
      zip: Number,
    },
    admin: Boolean,
    hashpass: String,
    dni: Number,
    tel: [Number],
    created: {
      type: Date,
      default: Date.now,
    },
    active: Boolean,
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
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
```

### USER

```
const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: {
      firstname: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true,
      },
      lastname: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true,
      },
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    bio: String,
    avatar: String,
    birthday: Date,
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    address: {
      street: String,
      city: String,
      estate: String,
      country: String,
      zip: Number,
    },
    admin: Boolean,
    hashpass: String,
    dni: Number,
    tel: [Number],
    created: {
      type: Date,
      default: Date.now,
    },
    active: Boolean,
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
```

### BOOKINGS

```
const mongoose = require('mongoose');

const { Schema } = mongoose;

const sevicesArray = ['llevar al medico'];

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
    dateIn: Date,
    dateOut: Date,
    status: {
      type: String,
      enum: ['reserve', 'pay', 'cancel'],
    },
    priceInit: Number,
    discount: Number,
    priceEnd: Number,
    sevicestoHosterCompromise: [
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
  },
  { timestamps: true },
);

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
```
