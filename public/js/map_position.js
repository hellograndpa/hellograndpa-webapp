
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

let stores;

axios
  .get('/map/houses')
  .then((response) => {
    // handle success
    const { data } = response;
    console.log('TCL: data', data);
    stores = data;
  })
  .then(() => {
    map.on('load', (e) => {
      // This is where your '.addLayer()' used to be, instead add only the source without styling a layer
      map.addSource('places', {
        type: 'geojson',
        data: stores,
      });
      // Initialize the list
      buildLocationList(stores);

      geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl,
        marker: false,
        bbox: [-2, 35, 3, 45],
      });

      // map.addControl(geocoder, 'top-left');
      document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

      map.addSource('single-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [], // Notice that initially there are no features
        },
      });

      map.addLayer({
        id: 'point',
        source: 'single-point',
        type: 'circle',
        paint: {
          'circle-radius': 10,
          'circle-color': '#007cbf',
          'circle-stroke-width': 3,
          'circle-stroke-color': '#fff',
        },
      });

      geocoder.on('result', (ev) => {
        const searchResult = ev.result.geometry;
        map.getSource('single-point').setData(searchResult);

        const options = { units: 'miles' };
        stores.features.forEach((store) => {
          Object.defineProperty(store.properties, 'distance', {
            value: turf.distance(searchResult, store.geometry, options),
            writable: true,
            enumerable: true,
            configurable: true,
          });
        });

        stores.features.sort((a, b) => {
          if (a.properties.distance > b.properties.distance) {
            return 1;
          }
          if (a.properties.distance < b.properties.distance) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        const listings = document.getElementById('listings');
        while (listings.firstChild) {
          listings.removeChild(listings.firstChild);
        }

        buildLocationList(stores);

        function sortLonLat(storeIdentifier) {
          const lats = [stores.features[storeIdentifier].geometry.coordinates[1], searchResult.coordinates[1]];
          const lons = [stores.features[storeIdentifier].geometry.coordinates[0], searchResult.coordinates[0]];

          const sortedLons = lons.sort((a, b) => {
            if (a > b) { return 1; }
            if (a.distance < b.distance) { return -1; }
            return 0;
          });
          const sortedLats = lats.sort((a, b) => {
            if (a > b) { return 1; }
            if (a.distance < b.distance) { return -1; }
            return 0;
          });

          map.fitBounds([
            [sortedLons[0], sortedLats[0]],
            [sortedLons[1], sortedLats[1]],
          ], {
            padding: 100,
          });
        }

        sortLonLat(0);
        createPopUp(stores.features[0]);
      });
    });
    stores.features.forEach((marker, i) => {
      // Create an img element for the marker
      const el = document.createElement('div');
      el.id = `marker-${i}`;
      el.className = 'marker';

      // Add markers to the map at all points
      new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

      el.addEventListener('click', (e) => {
        // 1. Fly to the point
        flyToStore(marker);

        // 2. Close all other popups and display popup for clicked store
        createPopUp(marker);

        // 3. Highlight listing in sidebar (and remove highlight for all other listings)
        const activeItem = document.getElementsByClassName('active');

        e.stopPropagation();
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }

        const listing = document.getElementById(`listing-${i}`);
        listing.classList.add('active');
      });
    });
  })
  .catch((error) => {
    // handle error
    console.log('error', error);
  });


function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15,
  });
}

function createPopUp(currentFeature) {
  const popUps = document.getElementsByClassName('mapboxgl-popup');
  if (popUps[0]) popUps[0].remove();


  const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(`<div class="card">
                    <div class="card-image">
                     <a href="/houses/${currentFeature.properties.houseId}">
                       <img src="${currentFeature.properties.photo}">
                      </a>
                      
                       <a class="btn-floating halfway-fab waves-effect waves-light white" href="/user/${currentFeature.properties.userId}">
                      <img src="${currentFeature.properties.avatar}" class="circle center-align">
                    </a>
                    </div>
                    <span class="card-title">${currentFeature.properties.title}</span>
                    <div class="card-content">
                     <p class="street">${currentFeature.properties.address} ${currentFeature.properties.city}</p> <br>
                      <p class="price">${currentFeature.properties.price}€/month</p> <br>
                    </div>
                  </div>`)
    .addTo(map);
}

function buildLocationList(data) {
  for (let i = 0; i < data.features.length; i++) {
    const currentFeature = data.features[i];
    const prop = currentFeature.properties;

    const listings = document.getElementById('listings');
    const listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';
    listing.id = `listing-${i}`;

    const details = listing.appendChild(document.createElement('div'));
    details.innerHTML = ` <div class="row">
                <div class="col s12 m12 l12">
                  <div class="card horizontal">
                    <div class="card-image">
                      <img src="${prop.photo}">
                      </div>
                      <div class="card-stacked">
                      <div id="content-card" class="card-content">
                        <div id="contcard-${i}">
                        <a class="btn-floating halfway-fab waves-effect waves-light white" href="/user/${prop.userId}">
                          <img src="${prop.avatar}" class="circle center-align">
                        </a>
                        </div>
                        <div  class="content-card">
                        < class="street">${prop.address} ${prop.city} <br>
                        ${prop.price}€/month <br>
                        ${prop.roomm2} m2 <br>
                        <a href="/houses/${prop.houseId}"> See the house </a>
                        </p>
                        </div>
                      </div>
                </div>
              </div>`;

    const cardTitle = document.getElementById(`contcard-${i}`);
    const link = cardTitle.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title card-title';
    link.dataPosition = i;
    link.innerHTML = prop.title;


    if (prop.distance) {
      const roundedDistance = Math.round(prop.distance * 100) / 100;
      details.innerHTML += `<p><strong>${roundedDistance} miles away</strong></p>`;
    }


    link.addEventListener('click', function (e) {
      // Update the currentFeature to the store associated with the clicked link
      const clickedListing = data.features[this.dataPosition];

      // 1. Fly to the point
      flyToStore(clickedListing);

      // 2. Close all other popups and display popup for clicked store
      createPopUp(clickedListing);

      // 3. Highlight listing in sidebar (and remove highlight for all other listings)
      const activeItem = document.getElementsByClassName('active');

      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');
    });
  }
}
