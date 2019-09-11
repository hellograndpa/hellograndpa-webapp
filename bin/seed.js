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

mongoose.connect('mongodb://localhost/hellograndpa', { useNewUrlParser: true });

const users = Array.from({ length: 50 }, () => ({
  username: { firstname: faker.name.firstName(), lastname: faker.name.lastName() },
  email: faker.internet.email(),
  bio: faker.lorem.paragraph(2),
  avatar: '/images/avatars/avatar.jpg',
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
            rooms: faker.random.number({ max: 9 }),
            m2: faker.random.number({ min: 50, max: 500 }),
            description: faker.lorem.paragraph(2),
            address: {
              street: faker.address.streetName(),
              city: faker.address.city(),
              state: faker.address.state(),
              country: 'España',
              zip: faker.address.zipCode('#####'),
            },
            features: [
              'Calefaccion',
              'A/C',
              'Piscina',
              'Terraza',
              'Ascensor',
              'WIFI',
            ],
            electro: [
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
            ],
            sevicesincluded: [
              'Agua',
              'agua caliene',
              'Electricidad',
              'Internet',
              'Utensilios baño',
              'desayuno',
              'cenas',
              'Utensilios cocina',
              'Cama',
            ],
            sevicestohoster: [
              {
                typesevice: 'ad',
                points: 10,
                requirement: true,
                mandatory: true,
                description: faker.lorem.paragraph(2),
              },
              {
                typesevice: 'ab',
                points: 20,
                requirement: true,
                mandatory: true,
                description: faker.lorem.paragraph(2),
              },
              {
                typesevice: 'af',
                points: 30,
                requirement: true,
                mandatory: false,
                description: faker.lorem.paragraph(2),
              },
              {
                typesevice: 'ag',
                points: 40,
                requirement: true,
                mandatory: false,
                description: faker.lorem.paragraph(2),
              },
              {
                typesevice: 'az',
                points: 50,
                requirement: true,
                mandatory: false,
                description: faker.lorem.paragraph(2),
              },
            ],
            photos: ['/images/photo1.jpg', '/images/photo2.jpg'],
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
              othersThings: faker.lorem.paragraph(2),
            },
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
