var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audio = new AudioContext();
console.log(audio);
var buffers = {};
var allsources = {};
var pauses = {}; // 0: playing, else: pause at some time
console.log(buffers);
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
    // set the buffer in the AudioBufferSourceNode
    source.buffer = output;
    source.loop = true;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(audio.destination);
    allsources[key] = source;
    console.log(key, allsources[key]);
    var playInfo = {};
    playInfo["startedAt"] = new Date();
    playInfo["paused"] = 0; // playing
    playInfo["pausedAt"] = -1;
    playInfo["interval"] = 0;
    pauses[key] = playInfo;
    // start the source playing
    source.start();
  }
}

function playAndPauseSingleTrack(filepath) {
  console.log(allsources[filepath], pauses[filepath]);
  let source = allsources[filepath];
  let playInfo = pauses[filepath];
  if (playInfo["paused"]) {
    playInfo["paused"] = 0; // playing
    playInfo["interval"] = (playInfo["pausedAt"] - playInfo["startedAt"]);
    //playInfo["interval"] %= source.duration;
    console.log(Math.round(playInfo["interval"]/1000));
    source.start(0, 4);
    playInfo["startedAt"] = new Date();
  }
  else{
    console.log("paused");
    playInfo["paused"] = 1; // paused
    source.stop(0);
    playInfo["pausedAt"] = new Date();
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
