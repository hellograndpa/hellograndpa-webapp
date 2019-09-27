const servicesArray = [{
    serviceType: 'Walking the dog',
    points: 10,
    description: 'Try to walk the dog at least 2 times a day',
    logo: 'pets',
  },
  {
    serviceType: 'Accompany me to the doctor',
    points: 20,
    description: 'I have to visit the doctor at least once a week',
    logo: 'local_hospital',
  },
  {
    serviceType: 'Dine with me',
    points: 30,
    description: 'yami yamiI would like you to accompany me at dinner at least once a week',
    logo: 'restaurant',
  },
  {
    serviceType: 'Help me do the laundry',
    points: 40,
    description: 'It is very difficult for me to hang clothes, can you help at least 2 times a week?',
    logo: 'toys',
  },
  {
    serviceType: 'Help me with general cleaning',
    points: 50,
    description: 'It is very difficult for me to do certain cleaning tasks, can you help me once a week?',
    logo: 'person_add',
  },
  {
    serviceType: 'Go to the supermarket',
    points: 50,
    description: 'I find it very difficult to go shopping because I can\'t with the bags, once a week',
    logo: 'person_add',
  },
  {
    serviceType: 'Take a walk',
    points: 20,
    description: 'I love to walk around the neighborhood and see people, would you accompany me once a week?',
    logo: 'person_add',
  },
  {
    serviceType: 'Go to the theatre',
    points: 20,
    description: 'I am a theater enthusiast, I would like to go once a month',
    logo: 'person_add',
  },
];

const featuresArray = {
  calefaccion: false,
  ac: false,
  piscina: false,
  terraza: false,
  ascensor: false,
  wifi: false,
};

const electroArray = {
  cocina: false,
  nevera: false,
  lavadora: false,
  secadora: false,
  secadorDePelo: false,
  horno: false,
  microondas: false,
  aspiradora: false,
  batidora: false,
  tostadora: false,
};

const sevicesIncludedArray = {
  agua: false,
  aguaCaliene: false,
  electricidad: false,
  internet: false,
  utensiliosBano: false,
  desayuno: false,
  cenas: false,
  utensiliosCocina: false,
  cama: false,
};

let socketsUsers = [];

module.exports = {
  servicesArray,
  featuresArray,
  electroArray,
  sevicesIncludedArray,
  socketsUsers,
};