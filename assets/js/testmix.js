var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

var audio = new AudioContext();

function test() {
    // Stereo
  var channels = 2;
  // Create an empty two second stereo buffer at the
  // sample rate of the AudioContext
  var frameCount = audio.sampleRate * 2.0;
  var myArrayBuffer = audio.createBuffer(channels, frameCount, audio.sampleRate);
  for (var channel = 0; channel < channels; channel++) {
     // This gives us the actual array that contains the data
     var nowBuffering = myArrayBuffer.getChannelData(channel);
     for (var i = 0; i < frameCount; i++) {
       // Math.random() is in [0; 1.0]
       // audio needs to be in [-1.0; 1.0]
       nowBuffering[i] = Math.random() * 2 - 1;
     }
   }
   // Get an AudioBufferSourceNode.
   // This is the AudioNode to use when we want to play an AudioBuffer
   var source = audio.createBufferSource();
   // set the buffer in the AudioBufferSourceNode
   source.buffer = myArrayBuffer;
   // connect the AudioBufferSourceNode to the
   // destination so we can hear the sound
   source.connect(audio.destination);
   // start the source playing
   source.start();
}

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

async function fetchAudio(fP) {
   let files = []
   var filePaths = [];
   await fP.then(function(value) { filePaths = value;})
   for (let f of filePaths) {
      let buffer = await fetch(f).then(response => response.arrayBuffer()).catch(e => console.log(e))
     let data = await decodeAudioDataAsync(buffer)
     files.push(data)
   }
   return files
 }

function handleFilesSelect(fP) {
  let buffers = [];
  var filePaths = [];
  await fP.then(function(value) { filePaths = value;})
  for (let f of filePaths) {
     let buffer = await fetch(f).then(response => response.arrayBuffer()).catch(e => console.log(e))
    let data = await decodeAudioDataAsync(buffer)
    buffers.push(data)
  }

  let output = audio.createBuffer(2,
    audio.sampleRate * _maxDuration(buffers), audio.sampleRate);

  for(let buffer of buffers) {
    for (let i = buffer.getChannelData(0).length - 1; i >= 0; i--) {
      output.getChannelData(0)[i] += buffer.getChannelData(0)[i];
    }
    for (let i = buffer.getChannelData(1).length - 1; i >= 0; i--) {
      output.getChannelData(1)[i] += buffer.getChannelData(1)[i];
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

function _maxDuration(buffers) {
 return Math.max.apply(Math, buffers.map(buffer => buffer.duration));
}
/*
function handleFilesSelect(input){
  var description = "mix";

  let ret = fetchAudio(input)
          .then(buffers => mergeAudio(buffers))
          .catch(error => {
          throw new Error(error);
        });

}*/
