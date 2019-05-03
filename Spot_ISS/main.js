const ISSCoordinatesEndpoint = "https://api.wheretheiss.at/v1/satellites/25544";
const map = L.map("map",{
  doubleClickZoom: false,
   minZoom: 2,
   maxZoom: 2,
   scrollWheelZoom: false,
   zoomControl: false
});
map.setView([0, 0], 0);

const streetLayer = L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// const streetLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
//   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   subdomains: 'abcd',
//   minZoom: 1,
//   maxZoom: 16,
//   ext: 'jpg'
// }).addTo(map);

// day and night overlay
// L.terminator().addTo(map);

const ISSIcon = L.icon({
  iconUrl: "space-station.svg",
  iconSize: [40, 40], // size of the icon
  iconAnchor: [30, 30], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -20] // point of the popup relative to icon's center
});

const pin = L.icon({
  iconUrl: "astronaut.svg",
  iconSize: [25, 25], 
  iconAnchor: [20, 30], 
  popupAnchor: [0, -30] 
});

function getISSData(callback) {
  const url = ISSCoordinatesEndpoint + "?" + "units=kilometers";
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => callback(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

/*set the initial map view with the ISS centered*/
function setInitialView(data) {
  let lat = data.latitude;
  let lon = data.longitude;
  map.setView([lat, lon], 4);
}

/*add the ISS icon to the map*/
function generateIcon(data) {
  let lat = data.latitude.toFixed(4);
  let lon = data.longitude.toFixed(4);
  let clat = 12.9716;
  let clon = 77.5946;
  let velocity = data.velocity.toFixed(2);
  let altitude = data.altitude.toFixed(2);
  $("img.leaflet-marker-icon").addClass("fade");
  /*assign the ISS icon to a variable, then add it to the map with the current ISS coordinates, along with a popup that displays data*/

  let issIcon = L.marker([lat, lon], {
    icon: ISSIcon,
    alt: "Icon of the International Space Station",
    keyboard: true
  });
  let currentLoc = L.marker([clat, clon], {
    icon: pin,
    alt: "Icon of the current location",
    keyboard: true
  });
  issIcon
    .addTo(map)
    .bindPopup(
      `Latitude: ${lat}<br>Longitude: ${lon}<br>Velocity: ${velocity} km/hr<br>Altitude: ${altitude} km`
    );
  currentLoc
    .addTo(map)
    .bindPopup(
      `hello there!`
    );
}

function apiCall() {
  getISSData(generateIcon);
}

/*run the app at page load. Call getISSData first to set the intial view, second to add the ISS icon on page load, 
then call setInterval to run getISS data every 2 seconds*/
$(function runApp() {
  getISSData(setInitialView);
  getISSData(generateIcon);
  setInterval(apiCall, 2000);
});
