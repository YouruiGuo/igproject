var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audio = new AudioContext();

var playing = [];
var buffers = {};
var allsources = {};
var gains = {};
var birdsgains = {};
var mute = {};
var panners = {};
//var responses = {};

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
  var e = 0.01;
  var r = Math.random();
  var loop = false;
//  console.log(r);
  if (r < e) {
//    console.log("play bird song");
    var t0 = birdsTrack();
    var t1 = [];
    await t0.then(function(value) {t1 = value;});
    t2 = t1[0]['filePath'];
    loadFilesList([t2]).then((track) => {
      playBirdSongs(track);
    })
  }
}

function setPanner(pos, valley) {
  if (playing.length != 0) {
    for (var i = 0; i < playing.length; i++) {
      for (var j = 0; j < allinfo.length; j++) {
        info = allinfo[j];
        if (info["filePath"] === playing[i] && info["valley"] == valley+1) {
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
  panner.rolloffFactor = 0.5;
  panner.refDistance = 5;
  panner.maxDistance = 100;
  panner.coneInnerAngle = 360;
  panner.coneOuterAngle = 0;
  panner.coneOuterGain = 0;
  panner.setPosition(0,0,0);
  return panner;
}

function calculateDistance(key, lat1, lon1, lat2, lon2) {
//    console.log(lat1, lon1, lat2, lon2);
    var R = 6378.137; // Radius of earth in KM
    var delta_Y = 1000*R*(lat2-lat1)*Math.PI/180;
    var delta_X = 1000*R*(lon2-lon1)*Math.cos(lat1)*Math.PI/180;
  //  console.log(delta_X);
    if (panners[key])
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
/*
 async function loadAllFiles(fP) {
   let filePaths = fP;
   for (let f of filePaths) {
     var arrayBuffer;
     var e = false;
//     console.log(responses[f]);
     if (!responses[f]) {
        response = await fetch(f).then(function (res) {
          if (!res.ok) {
             throw Error(res.statusText);
           }
           let arrayBuffer = await response.arrayBuffer();
        }).catch(function(error) {
           console.log(error);
           e = true;
        });
        responses[f] = arrayBuffer;
     }
 }
}*/
 async function loadFilesList(fP) {
   let filePaths = fP;
   //await fP.then(function (value) { filePaths = value;});
   let buffers = [];
   for (let f of filePaths) {
     var arrayBuffer;
     var e = false;
//     console.log(responses[f]);
     /*if (!responses[f]) {
        response = await fetch(f).then(function (res) {
	         if (!res.ok) {
             throw Error(res.statusText);
           }
           let arrayBuffer = await response.arrayBuffer();
        }).catch(function(error) {
           console.log(error);
           e = true;
        });
        responses[f] = arrayBuffer;
     }
     else {*/
     var arrayBuffer;
     if (!responses[f]) {
       e = true;
     }
     else {
       arrayBuffer = responses[f];
     }
     //}
     if (e == true){ continue;}
     //let arrayBuffer = await response.arrayBuffer();
//     let audioBuffer = await decodeAudioDataAsync(arrayBuffer);
 //    buffers[f] = audioBuffer;
     buffers[f] = arrayBuffer; 
  }
   return buffers;
 }

 function muteBirds() {
  // console.log(birdsgains);
   for (bird in birdsgains) {
   // delete birdsgains[bird];
     birdgain = birdsgains[bird];
//     console.log(bird);
     birdgain.gain.setValueAtTime(0, audio.currentTime);
   }
 }

function maxVolume(fp) {
////////////////// console.log(fp);
    if (panners[fp]) {
      panners[fp].setPosition(0,0,0);
    }
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

 function unMute(fp, vol) {
   if (vol === undefined ) vol = 1;
//   console.log(vol,fp);
   if (gains[fp]) {
      mute[fp] = 0;
      gains[fp].gain.setValueAtTime(vol, audio.currentTime);
   }
   else{
     mute[fp] = 0;
     var g = audio.createGain();
     g.gain.setValueAtTime(vol, audio.currentTime);
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

function playBirdSongs(buffers) {
  var channel = 2;
  for(var key in buffers) {
    var frameCount = audio.sampleRate*buffers[key].duration;
    var buffer = buffers[key];
    let output = audio.createBuffer(channel, frameCount, audio.sampleRate);
    for (var c = 0; c < channel; c++) {
      nowBuffering = output.getChannelData(c);
      for(var i = 0; i < frameCount; i++){
         if (buffer.getChannelData(c)[i]) {
           nowBuffering[i] += buffer.getChannelData(c)[i];
         }
      }
    }
    var source = audio.createBufferSource();
    var g = audio.createGain();
    g.gain.value = 0.5;
    birdsgains[key] = g;
    source.buffer = output;
    source.connect(g).connect(audio.destination);
    source.start(0);
  }
}


function playTracks(pos, buffers, loop) {
  var channel = 2;
 // console.log(buffers);
  playing = [];
  for(var key in buffers) {
    playing.push(key);
    var frameCount = audio.sampleRate*buffers[key].duration;
    var buffer = responses[key];
//    console.log(buffer);
    channel = buffers[key].numberOfChannels;
  //  console.log(buffers[key].duration);
    //await buffer.then(function (val) {channel = val.numberOfChannels;});
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
   // console.log(key);
    if (key.includes("Ambient")) {g.gain.value = 0.3;}
    else {g.gain.value = 1;}
    gains[key] = g;
    var pan = createNewPanner();
    panners[key] = pan;
    var v = findValley(pos);
    for (var j = 0; j < allinfo.length; j++) {
      info = allinfo[j];
      if (info["filePath"] === key && info["valley"]==v+1) {
        calculateDistance(key,info.latitude,
                info.longitude, pos.lat, pos.lng);
        break;
      }
    }
    // set the buffer in the AudioBufferSourceNode
    source.buffer = output;
    source.loop = loop;
    mute[key] = 0; // un-muted
   // console.log(gains[key]);
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
 // console.log("setpanners");
  setPanner(pos);
 // console.log(panners);
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
 // console.log("handlefileselct");
  filePaths.push(ambientTrack);
  loadFilesList(filePaths).then((track) => {
    playTracks(pos, track, true);
  });
}

function _maxDuration(buffers) {
 return Math.max.apply(Math, buffers.map(buffer => buffer.duration));
}
