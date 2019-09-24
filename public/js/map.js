mapboxgl.accessToken = 'pk.eyJ1IjoiaXR0ZW5lcyIsImEiOiJjazB0eGg5NmkwOHR4M2hwZGhxemtoeHRiIn0.A8MkCxfecgxrjj-hYODfjA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-2.0000, 40.0000],
  zoom: 5,
});


const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl,
});

// map.addControl(geocoder, 'top-left');


map.on('load', () => {
  // Listen for the `geocoder.input` event that is triggered when a user
  // makes a selection
  geocoder.on('result', (ev) => {
    const styleSpec = ev.result;

    const [geo1Value, geo2Value] = styleSpec.geometry.coordinates;
    console.log(geo1Value, geo2Value);

    document.getElementById('geo1').value = geo1Value;
    document.getElementById('geo2').value = geo2Value;
  });
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
