var numValleys = 3;
var coords = [
  /*
 [
   {lat: 53.527863, lng: -113.526269}, // top left
   {lat: 53.527866, lng: -113.525153}, // top right
   {lat: 53.526725, lng: -113.525073}, // timhortons
   {lat: 53.526709, lng: -113.526262}, // athabasca
   {lat: 53.527863, lng: -113.526269}, // top left
 ],
 [
   {lat: 53.526709, lng: -113.526262}, // athabasca
   {lat: 53.526725, lng: -113.525073}, // timhortons
   {lat: 53.526201, lng: -113.524993}, // middle right
   {lat: 53.526315, lng: -113.526254}, // middle left
   {lat: 53.526709, lng: -113.526262}, // athabasca
 ],*/
 /*
 [
   {lat: 53.526315, lng: -113.526254}, // middle left
   {lat: 53.526201, lng: -113.524993}, // middle right
   {lat: 53.525485, lng: -113.525020}, // bottom right
   {lat: 53.525477, lng: -113.526248}, // bottom left
   {lat: 53.526315, lng: -113.526254}, // middle left
 ],*/
 [
   {lat: 53.527034, lng: -113.526722}, //athabasca hall
   {lat: 53.527037, lng: -113.526345},
   {lat: 53.526418, lng: -113.526333},
   {lat: 53.526419, lng: -113.526730},
   {lat: 53.527034, lng: -113.526722},
 ],
 [
   {lat: 53.526811, lng: -113.525087}, //cab
   {lat: 53.526817, lng: -113.524387},
   {lat: 53.526326, lng: -113.524496},
   {lat: 53.526329, lng: -113.525060},
   {lat: 53.526811, lng: -113.525087},
 ],
 [
   {lat: 53.527882, lng: -113.524934}, //chemistry
   {lat: 53.527856, lng: -113.524266},
   {lat: 53.526928, lng: -113.524305},
   {lat: 53.526912, lng: -113.524980},
   {lat: 53.527882, lng: -113.524934},
 ]
];
var user_position; // which valley the user is at.

function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Play music';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {

    // fetch tracks from audio database.
    // fetchtracks.js
    track(user_position);
  });

}

// get polygons according to coords.
function drawPolygons() {
  // Construct the polygon.
  var v = [];
  for (var i = 0; i < numValleys; i++) {
    v[i] = new google.maps.Polygon({
      paths: coords[i],
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#FF0000',
      fillOpacity: 0.35
    });
  }
  return v;
}

// check if the point is inside polygon.
// https://stackoverflow.com/questions/22521982/check-if-point-inside-a-polygon
function inside(point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  var x = point.lat, y = point.lng;

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i].lat, yi = vs[i].lng;
    var xj = vs[j].lat, yj = vs[j].lng;

    var intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

function findValley (pos) {
  var val = -1;
  for (var i = 0; i < numValleys; i++) {
    vs = coords[i];
    ret = inside(pos, vs);
    if (ret) {
      val = i;
      break;
    }
  }
  return val;
}

//https://bagja.net/blog/track-user-location-google-maps.html
var createMap = ({ lat, lng }) => {
  return new google.maps.Map(document.getElementById('map'), {
    center: { lat, lng },
    zoom: 16
  });
};

var createMarker = ({ map, position }) => {
  return new google.maps.Marker({ map, position });
};

var getCurrentPosition = ({ onSuccess, onError = () => { } }) => {
  if ('geolocation' in navigator === false) {
    return onError(new Error('Geolocation is not supported by your browser.'));
  }
  return navigator.geolocation.getCurrentPosition(onSuccess, onError);
};

// New function to track user's location.
var trackLocation = ({ onSuccess, onError = () => { } }) => {
  if ('geolocation' in navigator === false) {
    return onError(new Error('Geolocation is not supported by your browser.'));
  }
  // Use watchPosition instead.
  return navigator.geolocation.watchPosition(onSuccess, onError);
};


// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

function initMap() {
//  var map, infoWindow;
  var pos;
  var initialPosition = {lat: 53.527213,lng: -113.524544};
  const map = createMap(initialPosition);
  const marker = createMarker({ map, position: initialPosition });
  var prev = -1;

  // Use the new trackLocation function.
  let watchId = trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
      pos = {lat, lng};
      // Find out which valley user is at.
      user_position = findValley(pos);
      if (prev == -1 || prev != user_position) {
        console.log(prev, user_position);
        stopAudio();
        track(user_position);
      }
      prev = user_position;
      marker.setPosition({ lat, lng });
      map.panTo({ lat, lng });
    },
    onError: err =>
      alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`)
  });

  //infoWindow = new google.maps.InfoWindow;

  // draw polygons.
  var v = drawPolygons()
  for (var i = 0; i < numValleys; i++) {
    v[i].setMap(map);
  }


  // infoWindow = new google.maps.InfoWindow;
  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
