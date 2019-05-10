var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audio = new AudioContext();

var buffers = {};
var allsources = {};
var gains = {};
var mute = {};

function stopAudio() {
  audio.close().then(function () {audio = new AudioContext();});
  gains = {};
  if (!$$('#play-btn').hasClass('pause')) {
    $$('#play-btn').addClass('pause');
               $$('#play-btn').attr('style', 'background-image: url("/images/icons8-play-32.png")');
         
  }

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
//    if (!gains[key]) {
      g = audio.createGain();
      g.gain.value = 1;
      gains[key] = g;
   // }
/*
    else{
      console.log(gains[key]);
      g = gains[key];
    }*/
    // set the buffer in the AudioBufferSourceNode
    source.buffer = output;
    source.loop = true;
    mute[key] = 0; // un-muted
    console.log(gains[key]);
    source.connect(gains[key]);
    gains[key].connect(audio.destination);
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
}

function playAndPause() {
    if (audio.state === "suspended") {
      audio.resume();
    }
    else if (audio.state === "running") {
      audio.suspend();
    }
}

async function firstHandleFilesSelectIntro(fP) {
  let filePaths = fP;
//  await fP.then(function (value) { filePaths = value;});
  loadFilesList(fP).then((track) => {
  console.log(track);

  var icon = $$('.playintro');
  icon.on('click', function() {
     playTracks(track);
     icon.toggleClass('active');
     return false;
  });
/*
    var controller = document.getElementById("introplay");
    controller.addEventListener('click', function() {
      playTracks(track);
    }, {once: true});*/
  });
}


async function firstHandleFilesSelect(fP) {
  let filePaths = [];
  await fP.then(function (value) { filePaths = value;});
  loadFiles(fP).then((track) => {

   var controller = document.getElementById("play-btn");
    controller.addEventListener('click', function() {
      playTracks(track);
    }, {once: true});
  });
}

async function handleFilesSelect(fP) {
  let filePaths = [];
  await fP.then(function (value) { filePaths = value;});
  console.log("handlefileselct");
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
