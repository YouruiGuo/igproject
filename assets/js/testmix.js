var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audio = new AudioContext();

var playing = [];
var buffers = {};
var allsources = {};
var gains = {};
var mute = {};
var panners = {};

function stopAudio() {
  audio.close().then(function () {audio = new AudioContext();});
  gains = {};
  panners = {};
  if (!$$('#play-btn').hasClass('pause')) {
    $$('#play-btn').addClass('pause');
    $$('#play-btn').attr('style', 'background-image: url("/images/icons8-play-32.png")');
  }
}

async function birdSongs() {
  var e = 0.1;
  var r = Math.random();
  var loop = false;
  console.log(r);
  if (r < e) {
    console.log("play bird song");
    var t0 = birdsTrack();
    var t1 = [];
    await t0.then(function(value) {t1 = value;})
    loadFilesList([t1[0]['filePath']]).then((track) => {
      playTracks(track, loop);
    })
  }
}

function setPanner(pos) {
  if (playing != []) {
    for (var i = 0; i < playing.length; i++) {
      for (var info in allinfo) {
        if (info.filePath === playing[i]) {
          calculateDistance(playing[i],info.latitude,
                  info.longitude, pos.lat, pos.lng);
          break;
        }
      }
    }
  }
}

function createNewPanner() {
  var panner = audio.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.rolloffFactor = 1;
  panner.refDistance = 1;
  panner.maxDistance = 50;
  panner.coneInnerAngle = 360;
  panner.coneOuterAngle = 0;
  panner.coneOuterGain = 0;
  panner.setPosition(0,0,0);
  return panner;
}

function calculateDistance(key, lat1, lon1, lat2, lon2) {
    console.log(lat1, lon1, lat2, lon2);
    var R = 6378.137; // Radius of earth in KM
    var delta_Y = R*(lat2-lat1)*Math.PI/180;
    var delta_X = R*(lon2-lon1)*Math.cos(lat1)*Math.PI/180;
    panners[key].setPosition(delta_X, delta_Y, 0);
}

async function decodeAudioDataAsync(data) {
   return new Promise((resolve, reject) => {
     audio.decodeAudioData(data, b => {
         resolve(b)
       }, e => {
         reject(e)
       })
   })
 }

 async function loadFiles(fP) {
   let filePaths = [];
   await fP.then(function (value) { filePaths = value;});
   let buffers = [];
   var max=0;
   for (let f of filePaths) {
     let response = await fetch(f);
     let arrayBuffer = await response.arrayBuffer();
     let audioBuffer = await decodeAudioDataAsync(arrayBuffer);
     buffers[f] = audioBuffer;
   }
   return buffers;
 }

 async function loadFilesList(fP) {
   let filePaths = fP;
   //await fP.then(function (value) { filePaths = value;});
   let buffers = [];
   for (let f of filePaths) {
     let response = await fetch(f);
     let arrayBuffer = await response.arrayBuffer();
     let audioBuffer = await decodeAudioDataAsync(arrayBuffer);
     buffers[f] = audioBuffer;
   }
   return buffers;
 }

 function Mute(fp) {
   if (gains[fp]) {
      mute[fp] = 1;
      gains[fp].gain.setValueAtTime(0, audio.currentTime);
   }
   else{
     mute[fp] = 1;
     var g = audio.createGain();
     g.gain.setValueAtTime(0, audio.currentTime);
     gains[fp] = g;
   }
 }

 function unMute(fp) {
   if (gains[fp]) {
      mute[fp] = 0;
      gains[fp].gain.setValueAtTime(1, audio.currentTime);
   }
   else{
     mute[fp] = 0;
     var g = audio.createGain();
     g.gain.setValueAtTime(1, audio.currentTime);
     gains[fp] = g;
   }
 }

 function muteAndUnmute(fp) {
   if (gains[fp]) {
     if (mute[fp]) {
       mute[fp] = 0;
       gains[fp].gain.setValueAtTime(1, audio.currentTime);
     }
     else{
       mute[fp] = 1;
       gains[fp].gain.setValueAtTime(0, audio.currentTime);
     }
   }
   else{
     mute[fp] = 1;
     var g = audio.createGain();
     g.gain.setValueAtTime(0, audio.currentTime);
     gains[fp] = g;
   }
 }


function playTracks(pos, buffers, loop) {
  var channel = 2;
  console.log(buffers);
  playing = [];
  for(var key in buffers) {
    playing.push(key);
    var frameCount = audio.sampleRate*buffers[key].duration;
    var buffer = buffers[key];
    let output = audio.createBuffer(channel, frameCount, audio.sampleRate);
    for (var c = 0; c < channel; c++) {
      nowBuffering = output.getChannelData(c);
      for(var i = 0; i < frameCount; i++){
         nowBuffering[i] += buffer.getChannelData(c)[i];
      }
    }
    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    var source = audio.createBufferSource();
    var g;
    g = audio.createGain();
    g.gain.value = 1;
    gains[key] = g;
    var pan = createNewPanner();
    panners[key] = pan;

    // set the buffer in the AudioBufferSourceNode
    source.buffer = output;
    source.loop = loop;
    mute[key] = 0; // un-muted
    console.log(gains[key]);
    source.connect(gains[key]).connect(panners[key]).connect(audio.destination);

    // start the source playing
    source.start(0);
    if (audio.state === "running") {
      if ($$('#play-btn').hasClass('pause')) {
        $$('#play-btn').removeClass('pause');
        $$('#play-btn').attr('style', 'background-image:url("/images/icons8-pause-32.png")');
      }
    }
    else if (audio.state === "suspended") {
      if (!$$('#play-btn').hasClass('pause')) {
         $$('#play-btn').addClass('pause');
               $$('#play-btn').attr('style', 'background-image: url("/images/icons8-play-32.png")');
      }
    }
  }
  setPanner(pos);
}

function playAndPause() {
    if (audio.state === "suspended") {
      audio.resume();
    }
    else if (audio.state === "running") {
      audio.suspend();
    }
}

async function handleFilesSelect(pos, fP) {
  let filePaths = [];
  await fP.then(function (value) { filePaths = value;});
  console.log("handlefileselct");
  loadFiles(fP).then((track) => {
    playTracks(pos, track, true);
  });
}

function _maxDuration(buffers) {
 return Math.max.apply(Math, buffers.map(buffer => buffer.duration));
}
