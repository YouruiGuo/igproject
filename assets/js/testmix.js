var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audio = new AudioContext();
var buffers = {};
var allsources = {};
var pauses = {}; // 0: playing, else: pause at some time

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
    //buffers.push(audioBuffer);
    buffers[f] = audioBuffer;
  }
  return buffers;
}

function playTracks(buffers) {
  var channel = 2;
  var frameCount = audio.sampleRate*_maxDuration(buffers);

  for(var key in buffers) {
    var buffer = buffers[key]
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
    // set the buffer in the AudioBufferSourceNode
    source.buffer = output;
    source.loop = true;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(audio.destination);
    allsources[key] = source;
    var playInfo = {};
    playInfo["startedAt"] = -1;
    playInfo["paused"] = 0; // playing
    playInfo["pausedAt"] = -1;
    playInfo["interval"] = 0;
    pauses[key] = playInfo;
    // start the source playing
    source.start();
  }
}

function playAndPauseSingleTrack(filepath) {
  let source = allsources[filepath];
  let playInfo = pauses[filepath];
  if (playInfo["paused"]) {
    playInfo["paused"] = 0; // playing
    playInfo["interval"] += playInfo["pausedAt"] - playInfo["startedAt"];
    playInfo["interval"] %= _maxDuration(buffers);
    source.play(0, temp/1000);
    playInfo["startedAt"] = Date.now();
  }
  else{
    playInfo["paused"] = 1; // paused
    source.stop(0);
    playInfo["pausedAt"] = Date.now();
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
  })
}

async function handleFilesSelect(fP) {
  let filePaths = [];
  await fP.then(function (value) { filePaths = value;});

  loadFiles(fP).then((track) => {
    playTracks(track);
  })
}

function _maxDuration(buffers) {
 return Math.max.apply(Math, buffers.map(buffer => buffer.duration));
}
