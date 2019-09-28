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


const photosArr =['/images/img/1.jpg',
'/images/img/2.jpg',
'/images/img/5.jpg',
'/images/img/4.jpg',
'/images/img/5.jpg']

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
  length: 10,
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
    city: 'Barcelona',
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

User.collection.drop()
  .then(()=>{
    console.log('data deleted')
  })
  .catch((err)=>{
    console.log(err)
  })
  .then(()=>
    User.insertMany(users)
  )
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
            title: u.username.firstname + ' House',
            m2: faker.random.number({
              min: 50,
              max: 500,
            }),
            photos: photosArr.sort(() => Math.random() - 0.5),
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
              serviceType: 'Walking the dog',
              points: 10,
              requirement: false,
              mandatory: true,
              description: 'Try to walk the dog at least 2 times a day',
            },
            {
              serviceType: 'Accompany me to the doctor',
              points: 20,
              requirement: false,
              mandatory: true,
              description: 'I have to visit the doctor at least once a week',
            },
            {
              serviceType: 'Go to the supermarket',
              points: 50,
              requirement: false,
              mandatory: true,
              description:'I find it very difficult to go shopping because I can\'t with the bags, once a week',
            },
            {
              serviceType: 'Dine with me',
              points: 30,
              requirement: true,
              mandatory: false,
              description: 'I would like you to accompany me at dinner at least once a week',
            },
            {
              serviceType: 'Help me do the laundry',
              points: 40,
              requirement: true,
              mandatory: false,
              description: 'It is very difficult for me to hang clothes, can you help at least 2 times a week?',
            },
            {
              serviceType: 'Take a walk',
              points: 20,
              requirement: true,
              mandatory: false,
              description: 'I love to walk around the neighborhood and see people, would you accompany me once a week?',
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
              costpermonth: Math.floor(Math.random() * (900 - 400) + 400),
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
            featuresGeo:{geometry:[Math.random() * (2.22 - 2.10) + 2.10, Math.random() * (41.44 - 41.38) + 41.38]}
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
