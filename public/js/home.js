
mapboxgl.accessToken = 'pk.eyJ1IjoiaXR0ZW5lcyIsImEiOiJjazB0eGg5NmkwOHR4M2hwZGhxemtoeHRiIn0.A8MkCxfecgxrjj-hYODfjA';

// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}


// This adds the map
const map = new mapboxgl.Map({
  // container id specified in the HTML
  container: 'map',
  // style URL
  style: 'mapbox://styles/mapbox/light-v10',
  // initial position in [long, lat] format
  center: [2, 40],
  // initial zoom
  zoom: 5,
  hash: true,

});

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl,
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


map.on('load', () => {
  // Listen for the `geocoder.input` event that is triggered when a user
  // makes a selection
  geocoder.on('result', (ev) => {
    const styleSpec = ev.result;

    console.log('TCL: ev', ev.result);

    const [geo1Value, geo2Value] = styleSpec.geometry.coordinates;
    window.open(`map#7/${geo2Value}/${geo1Value}`, '_self');
  });
});
