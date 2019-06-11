var coords = [
  [
   {lat: 53.527218, lng: -113.523288},
   {lat: 53.527212, lng: -113.522352},
   {lat: 53.526306, lng: -113.522341},
   {lat: 53.526324, lng: -113.523212},
   {lat: 53.527218, lng: -113.523288},
  ],
  [
   {lat: 53.527239, lng: -113.522346},
   {lat: 53.527249, lng: -113.520967},
   {lat: 53.526281, lng: -113.520979},
   {lat: 53.526293, lng: -113.522342},
   {lat: 53.527239, lng: -113.522346},
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
 [
   {lat: 53.519072, lng: -113.522007},
   {lat: 53.518962, lng: -113.517668},
   {lat: 53.517355, lng: -113.517522},
   {lat: 53.517063, lng: -113.523125},
   {lat: 53.519072, lng: -113.522007},
 ],
 [
   {lat: 53.40750, lng: -113.7605},
   {lat: 53.40765, lng: -113.7598},
   {lat: 53.40671, lng:  -113.75825},
   {lat: 53.40640, lng: -113.759229},
   {lat: 53.40750, lng: -113.7605},
  ],
  [
   {lat: 53.407192, lng: -113.758528},
   {lat: 53.407331, lng: -113.758090},
   {lat: 53.407024, lng: -113.757338},
   {lat: 53.40671, lng: -113.75791},
   {lat: 53.407192, lng: -113.758528},
  ],

 [
   {lat: 53.407024, lng: -113.757240},
   {lat: 53.40749, lng: -113.75667},
   {lat: 53.40779, lng:  -113.75747},
   {lat: 53.40744, lng: -113.75807},
   {lat: 53.407024, lng: -113.757240},
  ],  
  [
   {lat: 53.407414, lng: -113.756310},
   {lat: 53.407638, lng: -113.756407},
   {lat: 53.408102, lng: -113.755513},
   {lat: 53.408022, lng: -113.755197},
   {lat: 53.407414, lng: -113.756310},
  ],
  [
   {lat: 53.408842, lng: -113.756437},
   {lat: 53.408164, lng: -113.755121},
   {lat: 53.408997, lng: -113.754455},
   {lat: 53.409227, lng: -113.756060},
   {lat: 53.408842, lng: -113.756437},
  ],
  [
   {lat: 53.407820, lng: -113.756911},
   {lat: 53.408114, lng: -113.757427},
   {lat: 53.408773, lng: -113.756584},
   {lat: 53.408482, lng: -113.755925},
   {lat: 53.407820, lng: -113.756911},
  ],
   [
   {lat: 53.4075, lng: -113.75955},
   {lat: 53.4078, lng: -113.75955},
   {lat: 53.4079, lng: -113.75787},
   {lat: 53.40750, lng: -113.7581},
   {lat: 53.4075, lng: -113.75955},
  ],
];
var allinfo = [];
var numValleys = 14;
var user_position; // which valley the user is at.
var user_marker;
var marker = user_marker;
var pos, prevpos = -1;
var prev = -1;
var maps;

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
var responses = {};
 async function loadAllFiles(fP) {
   let filePaths = fP;
   for (let f of filePaths) {
     var arrayBuffer;
     var e = false;
     var audioBuffer;
//     console.log(responses[f]);
     if (!responses[f]) {
        console.log(f);
        let response = await fetch(f);
        let arrayBuffer = await response.arrayBuffer();
        let audioBuffer = await decodeAudioDataAsync(arrayBuffer);
/*        response = await fetch(f).then(function (res) {
          if (res.ok) {
            // throw Error(res.statusText);
             arrayBuffer =  res.arrayBuffer().then(function (ab) {
                audioBuffer = decodeAudioDataAsync(ab);
             });
           }
           //arrayBuffer =  res.arrayBuffer().then(function (ab) {
 	//	audioBuffer = decodeAudioDataAsync(ab);
          // });
          // audioBuffer = await decodeAudioDataAsync(arrayBuffer);
        }).catch(function(error) {
           filePaths.push(f);
           console.log(error);
           e = true;
        });*/
        responses[f] = audioBuffer;
     }
 }
 console.log(responses);
}


async function setMarkers(map) {
  var temp = allInfo();
  var info = [];
  await temp.then(function (value) {allinfo = value;});
  info = allinfo;
  var allpaths = [];
  for (var i = 0; i < info.length; i++) {
    allpaths.push(info[i].filePath);
  }
  loadAllFiles(allpaths);
  for (var i = 0; i < info.length; i++) {
   if (info[i].generalDesc !== ''){
     var newmarker = new google.maps.Marker({
      position: {lat:info[i].latitude, lng:info[i].longitude},
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 2.5,
        strokeColor: '#FFA07A',
      },
      zIndex : 999,
    });
    contentString = '<div id="content"><div id="siteNotice"></div>'+
                    '<div><h3>'+ info[i].TrackName  +'</h3></div>';
                   // '<div><p>Description: </p><div id="marker'+ i.toString() +'"></div></div></div>';
    attachSecretMessage(newmarker, contentString);
   }
  }
}

function attachSecretMessage(marker, secretMessage) {
  var infowindow = new google.maps.InfoWindow({
    content: secretMessage
  });

  marker.addListener('click', function() {
    infowindow.open(marker.get('map'), marker);
  });
}

function validateLocation(prevloc, pos) {

  lat1 = prevloc.lat;
  lon1 = prevloc.lng;
  lat2 = pos.lat;
  lon2 = pos.lng;
//  console.log(lat1, lon1, lat2, lon2);
  var R = 6378.137; // Radius of earth in KM
  var delta_Y = 1000*R*(lat2-lat1)*Math.PI/180;
  var delta_X = 1000*R*(lon2-lon1)*Math.cos(lat1)*Math.PI/180;
  var distance = Math.sqrt(delta_X*delta_X + delta_Y*delta_Y);
  if (distance > 5) return false;
  if (prevloc == -1) return true;
  return true;
}

var numnonvalid = 0;
function autoUpdate() {
  navigator.geolocation.getCurrentPosition(
              ({ coords: { latitude: lat, longitude: lng } }) => {
    //var newPoint = new google.maps.LatLng(position.coords.latitude,
    //                                      position.coords.longitude);
    pos = {lat, lng};
//    console.log(pos);
    user_position = findValley(pos);
   // console.log(user_position);
   var valid = validateLocation(prevpos, pos);

    if (user_position != -1) {
      if(valid){
        numnonvalid = 0;
//        console.log("set panner");
//        console.log(soloon);
        if (!soloon) {
          setPanner(pos, user_position);
        }
      }
      else {numnonvalid += 1;}
      if (prev != user_position){
        stopAudio();
  //      console.log([prev, user_position]);
        introPage(pos, user_position, true);
      }
      else if (prev == -1){ console.log("here");introPage(user_position, false);}
      else {birdSongs();}
    }
    else {
        stopAudio();
//`        console.log("user position -1");
    }
    if (valid || (numnonvalid > 5)) {
      numnonvalid = 0;
      prevpos = pos;
    }
    prev = user_position;
    marker.setPosition({ lat, lng });
    maps.panTo(new google.maps.LatLng(lat, lng));
//    maps.setCenter(new google.maps.LatLng(lat, lng));
  });
  setTimeout(autoUpdate, 1000);
}

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

function initMap() {
//  var map, infoWindow;
  //var pos, prevpos = -1;
  var initialPosition = {lat: 53.527213,lng: -113.524544};
  const map = createMap(initialPosition);
  maps = map;
  var icon = {
    url: "/images/direction.png", // url
    scaledSize: new google.maps.Size(20, 20), // scaled size
//    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };
  marker = new google.maps.Marker({
        clickable : false,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 2.5,
          strokeColor: '#0000EE',
        },
        shadow : null,
        zIndex : 999,
        map : map
  });
  user_marker = marker;
  //var prev = -1;
  setMarkers(map);
  //if ('ondeviceorientationabsolute' in window) {
    // Chrome 50+ specific
  window.addEventListener('deviceorientationabsolute', handleOrientation, true);
  autoUpdate();
  // Use the new trackLocation function.

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
