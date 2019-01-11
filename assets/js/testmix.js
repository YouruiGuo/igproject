var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var audio = new AudioContext();


function stopAudio() {
  audio.close().then(function() {audio=new AudioContext();});
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
    buffers.push(audioBuffer);
  }
  return buffers;
}

function playTracks(buffers) {
  var channel = 2;
  var frameCount = audio.sampleRate*_maxDuration(buffers);
  let output = audio.createBuffer(channel, frameCount, audio.sampleRate);

  for(let buffer of buffers) {
    for (var c = 0; c < channel; c++) {
      nowBuffering = output.getChannelData(c);
      for(var i = 0; i < frameCount; i++){
         nowBuffering[i] += buffer.getChannelData(c)[i];
      }
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
  // start the source playing
  source.start();
}

function handleFilesSelect(fP) {

  loadFiles(fP).then((track) => {
    // check if context is in suspended state (autoplay policy)
    if (audio.state === 'suspended') {
      audio.resume();
    }
    var controller = document.getElementById("clickdiv");
    controller.addEventListener('click', function() {
      playTracks(track);
    })

  })

}

function _maxDuration(buffers) {
 return Math.max.apply(Math, buffers.map(buffer => buffer.duration));
}
