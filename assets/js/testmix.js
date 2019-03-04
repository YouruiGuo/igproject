var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audio = new AudioContext();
console.log(audio);
var buffers = {};
var allsources = {};
var gains = {};
var mute = {};

function stopAudio() {
  audio.close().then(function () {audio = new AudioContext();});
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
      mute[fp] = 0;
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


function playTracks(buffers) {
  var channel = 2;
  console.log(buffers);
  for(var key in buffers) {
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
    if (!gains[key]) {
      g = audio.createGain();
      g.gain.value = 1;
      gains[key] = g;
    }
    else{
      g = gains[key];
    }
    // set the buffer in the AudioBufferSourceNode
    source.buffer = output;
    source.loop = true;
    mute[key] = 0; // un-muted
    source.connect(g);
    g.connect(audio.destination);
    // start the source playing
    source.start(0);
  }
}

function playAndPause() {
    if (audio.state === "suspended") {
      audio.resume();
    }
    else if (audio.state === "running") {
      audio.suspend();
    }
}

async function firstHandleFilesSelect(fP) {
  let filePaths = [];
  await fP.then(function (value) { filePaths = value;});
  loadFiles(fP).then((track) => {
    var controller = document.getElementById("play");
    controller.addEventListener('click', function() {
      playTracks(track);
    }, {once: true});
  });
}

async function handleFilesSelect(fP) {
  let filePaths = [];
  await fP.then(function (value) { filePaths = value;});
  loadFiles(fP).then((track) => {
    playTracks(track);
  });
}

function _maxDuration(buffers) {
 return Math.max.apply(Math, buffers.map(buffer => buffer.duration));
}
/*
function playSingleTrack(buffer, fp){
  var source = audio.createBufferSource();
  var g = audio.createGain();
  source.buffer = buffer;
  source.loop = true;
  mute[fp] = 0;
  gains[fp] = g;
  source.connect(g);
  g.connect(audio.destination);
  // start the source playing
  source.start();
}
async function loadSingleFile(fp) {
  var filepath=fp;
  let response = await fetch(filepath);
  let arrayBuffer = await response.arrayBuffer();
  let audioBuffer = await decodeAudioDataAsync(arrayBuffer);
  buffers[fp] = audioBuffer;
  return audioBuffer;
}*/
