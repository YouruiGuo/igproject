function handleFilesSelect(input){
  var description = "mix";
  var chunks = [];
  var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
  var channels = [[0, 1], [1, 0]];
  var audio = new AudioContext();
  var player = new Audio();
  var merger = audio.createChannelMerger(2);
  var splitter = audio.createChannelSplitter(2);
  var mixedAudio = audio.createMediaStreamDestination();
  var duration = 60000;
  var context;
  var recorder;
  var audioDownload;

  player.controls = "controls";

  function get(src) {
    return fetch(src)
      .then(function(response) {
        return response.arrayBuffer()
      })
  }

  function stopMix(duration, ...media) {
    setTimeout(function(media) {
      media.forEach(function(node) {
        node.stop()
      })
    }, duration, media)
  }

  Promise.all(input.map(get)).then(function(data) {
      return Promise.all(data.map(function(buffer, index) {
	  return audio.decodeAudioData(buffer)
            .then(function(bufferSource) {
              var channel = channels[index];
              var source = audio.createBufferSource();
              source.buffer = bufferSource;
              source.connect(splitter);
              splitter.connect(merger, channel[0], channel[1]);
              return source
            })
	}))
        .then(function(audionodes) {
          merger.connect(mixedAudio);
          merger.connect(audio.destination);
          recorder = new MediaRecorder(mixedAudio.stream);
          recorder.start(0);
          audionodes.forEach(function(node) {
            node.start(0)
          });

          stopMix(duration, ...audionodes, recorder);

          recorder.ondataavailable = function(event) {
            chunks.push(event.data);
          };

          recorder.onstop = function(event) {
            var blob = new Blob(chunks, {
              "type": "audio/ogg; codecs=opus"
            });
            audioDownload = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.download = description + "." + blob.type.replace(/.+\/|;.+/g, "");
            a.href = audioDownload;
            a.innerHTML = a.download;
            player.src = audioDownload;
            document.body.appendChild(a);
            document.body.appendChild(player);
          };
        })
    })
    .catch(function(e) {
      console.log(e)
    });

}
