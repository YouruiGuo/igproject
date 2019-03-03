var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audio = new AudioContext();
console.log(audio);
var buffers = {};
var allsources = {};
var pauses = {}; // 0: playing, else: pause at some time
var pausedat = -1;
var pausedinterval = 0;
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

async function loadSingleFile(fp) {
  var filepath;
  await fp.then(function (value) {filepath = value;});
  let response = await fetch(filepath);
  let arrayBuffer = await response.arrayBuffer();
  let audioBuffer = await decodeAudioDataAsync(arrayBuffer);
  buffers[fp] = audioBuffer;
  return audioBuffer;
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

function playSingleTrack(buffer, fp){
  var source = audio.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(audio.destination);
  var playInfo = {};
  playInfo["paused"] = 0;
  if (pauses[fp] == None) {
    playInfo["startedAt"] = Date.now();
    playInfo["interval"] = 0;
  }
  else{
    playInfo["interval"] = Date.now() - playInfo["startedAt"];
    playInfo["interval"] = Math.round(playInfo["interval"] % buffer.duration);
  }
  pauses[fp] = playInfo;
  // start the source playing
  source.start(0, playInfo["interval"]-pausedinterval);
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
    var playInfo = {};
    playInfo["startedAt"] = Date.now();;
    playInfo["paused"] = 0; // playing
    playInfo["interval"] = 0;
    pauses[key] = playInfo;
    // start the source playing
    source.start(0, playInfo["interval"]);
  }
}

function playAndPauseSingleTrack(filepath) {
  console.log(allsources[filepath], pauses[filepath], buffers);
  let source = allsources[filepath];
  let playInfo = pauses[filepath];
  if (playInfo["paused"]) {
    loadSingleFile(filepath).then((track)=>{
      playSingleTrack(track, filepath);
    });
  }
  else{
    playInfo["paused"] = 1; // paused
    source.stop(0);
  }
}

function playAndPause() {
    if (audio.state === "suspended") {
      pausedinterval += Math.round(Date.now()-pausedat);
      audio.resume();
    }
    else if (audio.state === "running") {
      pausedat = Date.now();
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
  for (let f of filePaths) {
    loadSingleFile(f).then((track) => {
      playSingleTrack(track, f);
    });
  }
}

function _maxDuration(buffers) {
 return Math.max.apply(Math, buffers.map(buffer => buffer.duration));
}
