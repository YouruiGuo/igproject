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

async function loadFile(filepath) {

  let response = await fetch(filepath);
  let arrayBuffer = await response.arrayBuffer();
  let audioBuffer = await decodeAudioDataAsync(arrayBuffer);

  return audioBuffer;
}

function playTrack(buffer) {
  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  var source = audio.createBufferSource();
  // set the buffer in the AudioBufferSourceNode
  source.buffer = buffer;
  source.loop = true;
  // connect the AudioBufferSourceNode to the
  // destination so we can hear the sound
  source.connect(audio.destination);
  // start the source playing
  source.start();
}

async function handleFilesSelect(fP) {
  let filePaths = [];
  await fP.then(function (value) { filePaths = value;});
  filePaths.forEach(function (f) {
    loadFile(f).then((track) => {
      // check if context is in suspended state (autoplay policy)
      if (audio.state === 'suspended') {
        audio.resume();
      }
      let controller = document.getElementById("clickdiv");
      controller.addEventListener('click', function() {
        playTrack(track);
      })

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
