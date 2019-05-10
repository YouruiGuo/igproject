
var numValleys = 6;
var coords = [
  [
   {lat: 30.020048, lng: 31.497416},
   {lat: 30.020572, lng: 31.498844},
   {lat: 30.019027, lng: 31.500264},
   {lat: 30.018405, lng: 31.498258},
   {lat: 30.020048, lng: 31.497416},
  ],
  [
   {lat: 30.019867, lng: 31.499512},
   {lat: 30.020431, lng: 31.500290},
   {lat: 30.020048, lng: 31.500875},
   {lat: 30.019288, lng: 31.500114},
   {lat: 30.019867, lng: 31.499512},
 ],
 [
   {lat: 53.519072, lng: -113.522007},
   {lat: 53.518962, lng: -113.517668},
   {lat: 53.517355, lng: -113.517522},
   {lat: 53.517063, lng: -113.523125},
   {lat: 53.519072, lng: -113.522007},
 ],
  [
   {lat: 53.490038, lng: -113.544320},
   {lat: 53.489572, lng: -113.544310},
   {lat: 53.489498, lng: -113.547872},
   {lat: 53.490044, lng: -113.548882},
   {lat: 53.490038, lng: -113.544320},
 ],

 [
   {lat: 53.489572, lng: -113.544310},
   {lat: 53.488146, lng: -113.544097},
   {lat: 53.488175, lng: -113.547743},
   {lat: 53.489498, lng: -113.547872},
   {lat: 53.489572, lng: -113.544310},
 ],

 [
   {lat: 53.490038, lng: -113.544320},
   {lat: 53.490041, lng: -113.543142},
   {lat: 53.488228, lng: -113.542997},
   {lat: 53.488146, lng: -113.544097},
   {lat: 53.490038, lng: -113.544320},
 ],
];
var user_position; // which valley the user is at.


// get polygons according to coords.
function drawPolygons() {
  // Construct the polygon.
  var v = [];
  for (var i = 0; i < numValleys; i++) {
    v[i] = new google.maps.Polygon({
      paths: coords[i],
      strokeColor: '#008000',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: '#008000',
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
    disableDefaultUI: true,
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


async function setMarkers(map) {
  var temp = allInfo();
  var info = [];
  await temp.then(function (value) {info = value;});
  console.log(temp);
  for (var i = 0; i < info.length; i++) {
    var marker = new google.maps.Marker({
      position: {lat:info[i].latitude, lng:info[i].longitude},
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 2.5,
        strokeColor: '#FFA07A',
      },
      zIndex : 999,
    });
  }
}


// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

function initMap() {
//  var map, infoWindow;
  var pos;
  var initialPosition = {lat: 53.527213,lng: -113.524544};
  const map = createMap(initialPosition);
  var icon = {
    url: "/images/direction.png", // url
    scaledSize: new google.maps.Size(30, 30), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };
  marker = new google.maps.Marker({
        clickable : false,
        icon: icon,
        shadow : null,
        zIndex : 999,
        map : map
    });

  var prev = -1;
  setMarkers(map);
  //if ('ondeviceorientationabsolute' in window) {
    // Chrome 50+ specific
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
  //} else if ('ondeviceorientation' in window) {
    //window.addEventListener('deviceorientation', handleOrientation);
  //}
  // Use the new trackLocation function.
  let watchId = trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
      pos = {lat, lng};
      // Find out which valley user is at.
      user_position = findValley(pos);
      //console.log(user_position);
      if (user_position != -1) {
        if (prev != user_position){
          stopAudio();
          //console.log(audio);
          introPage(user_position, true);}
        else if (prev == -1){ introPage(user_position, false);}
        //stopAudio();
        //var paths = welcomeValley(user_position);
        //handleFilesSelect(paths);
        /*
        if (prev == -1) {
          console.log("first play");
          //introPage(user_position);
          var paths = welcomeValley(user_position);
          firstHandleFilesSelect(paths);
        }
        else if (prev != user_position) {
          console.log(prev, user_position);
          stopAudio();
          // fetch tracks from audio database.
          // fetchtracks.js
          var paths = welcomeValley(user_position);
         // test();
          handleFilesSelect(paths);
        }*/
      }
      else {
          stopAudio();
          console.log("user position -1");
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
}

function handleOrientation (event) {
  var alpha = null;
  //Check for iOS property
  if (event.absolute) {
   alpha = 360 - event.alpha;
  }
  else if (event.hasOwnProperty('webkitCompassHeading')) {
   alpha = 360 - event.webkitCompassHeading;
  }
  else {
    alpha = 360 - event.alpha;
  }
  var locationIcon = marker.get('icon');
  locationIcon.rotation = alpha;
  marker.set('icon', locationIcon);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
