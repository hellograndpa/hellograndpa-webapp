mapboxgl.accessToken = 'pk.eyJ1IjoiaXR0ZW5lcyIsImEiOiJjazB0eGg5NmkwOHR4M2hwZGhxemtoeHRiIn0.A8MkCxfecgxrjj-hYODfjA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-2.0000, 40.0000],
  zoom: 5,
  hash: true,
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

    // wrtite de JSON ====================
    // const styleSpecBox = document.getElementById('json-response');
    // const styleSpecText = JSON.stringify(styleSpec, null, 2);
    // const syntaxStyleSpecText = syntaxHighlight(styleSpecText);
    // styleSpecBox.innerHTML = syntaxStyleSpecText;

    const [geo1Value, geo2Value] = styleSpec.geometry.coordinates;
    console.log(geo1Value, geo2Value);

    document.getElementById('geo1').value = geo1Value;
    document.getElementById('geo2').value = geo2Value;
  });
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// WRITE JSON ==========================
// function syntaxHighlight(json) {
//   json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
//   return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
//     let cls = 'number';
//     if (/^"/.test(match)) {
//       if (/:$/.test(match)) {
//         cls = 'key';
//       } else {
//         cls = 'string';
//       }
//     } else if (/true|false/.test(match)) {
//       cls = 'boolean';
//     } else if (/null/.test(match)) {
//       cls = 'null';
//     }
//     return `<span class="${cls}">${match}</span>`;
//   });
// }
