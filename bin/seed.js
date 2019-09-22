require('dotenv').config();

const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const faker = require('faker');

const User = require('../models/User');

const House = require('../models/House');

const bcryptSalt = 10;

const {
  sevicesArray,
  featuresArray,
  electroArray,
  seviciosIncludedArray,
} = require('../middlewares/enumerables');

// mongoose.connect(
//   'mongodb+srv://grandPa:hellohello@grandpacluster-qrflq.gcp.mongodb.net/test?retryWrites=true&w=majority',
//   { useNewUrlParser: true },
// );
mongoose.connect(process.env.DB_HOST, {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
});

const users = Array.from({
  length: 50,
}, () => ({
  username: {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
  },
  email: faker.internet.email(),
  bio: faker.lorem.paragraph(2),
  birthday: '19-01-1981',
  gender: 'male',
  address: {
    street: faker.address.streetName(),
    city: faker.address.city(),
    state: faker.address.state(),
    country: 'España',
    zip: faker.address.zipCode(),
  },
  idCard: faker.random.alphaNumeric(10),
  phone: [faker.phone.phoneNumberFormat()],
  adminUser: false,
  mentorUser: false,
  grandpaUser: false,
  hashpass: bcrypt.hashSync('1234', bcrypt.genSaltSync(bcryptSalt)),
  active: true,
}));

User.collection
  .drop()
  .then(() => {
    console.log('deleted db');
  })
  .catch((err) => {
    console.log(err);
  })
  .then(() => User.insertMany(users))
  .then(() => {
    console.log('inserted data');
    User.find()
      .then((usersBd) => {
        House.collection.drop();
        for (const u of usersBd) {
          House.create({
            user: u._id,
            rooms: faker.random.number({
              max: 9,
            }),
            title: faker.lorem.sentences(),
            m2: faker.random.number({
              min: 50,
              max: 500,
            }),
            description: faker.lorem.paragraph(2),
            address: {
              street: faker.address.streetName(),
              city: 'Barcelona',
              state: faker.address.state(),
              country: 'España',
              zip: faker.address.zipCode('#####'),
            },
            features: {
              calefaccion: true,
              ac: true,
              piscina: true,
              terraza: true,
              ascensor: true,
              wifi: true,
            },
            electro: {
              cocina: true,
              nevera: true,
              lavadora: true,
              secadora: true,
              secadorDePelo: true,
              horno: true,
              microondas: true,
              aspiradora: true,
              batidora: true,
              tostadora: true,
            },
            sevicesincluded: {
              agua: true,
              aguaCaliene: true,
              electricidad: true,
              internet: true,
              utensiliosBano: true,
              desayuno: true,
              cenas: true,
              utensiliosCocina: true,
              cama: true,
            },
            sevicestohoster: [{
              serviceType: 'Pasear al Perro',
              points: 10,
              requirement: true,
              mandatory: true,
              description: faker.lorem.paragraph(2),
            },
            {
              serviceType: 'Llevar al médico',
              points: 20,
              requirement: true,
              mandatory: true,
              description: faker.lorem.paragraph(2),
            },
            {
              serviceType: 'Preparar la cena',
              points: 30,
              requirement: true,
              mandatory: false,
              description: faker.lorem.paragraph(2),
            },
            {
              serviceType: 'Hacer la colada',
              points: 40,
              requirement: true,
              mandatory: false,
              description: faker.lorem.paragraph(2),
            },
            {
              serviceType: 'Acompañar a la plaza',
              points: 50,
              requirement: true,
              mandatory: false,
              description: faker.lorem.paragraph(2),
            },
            ],
            restricciones: faker.lorem.paragraph(1),
            rentroom: {
              m2: 20,
              wardrobes: 'uno',
              window: 'dos',
              balcony: true,
              heat: false,
              ac: true,
              wc: 'private bathroom',
              tv: true,
              table: true,
              chair: true,
              costpermonth: 500,
              deposit: 500,
              othersThings: faker.lorem.paragraph(2),
            },
            dateStart: {
              month: 'January',
              year: '2019',
            },
            visibleByUsers: true,
            active: true,
            canActive: true,
          })
            .then(() => {
              console.log('house inserted', u._id);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log('error', err);
        mongoose.connection.close();
      });
  })
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });
