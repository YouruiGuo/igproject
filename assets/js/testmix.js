function handleFilesSelect(input){
  var description = "mix";
  var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

  var audio = new AudioContext();
  var player = new Audio();
  async function fetchAudio(filePaths) {
    const files = filePaths.map(async filepath => {
      const buffer = await fetch(filepath).then(response =>
        response.arrayBuffer()
      );
      return await audio.decodeAudioData(buffer);
    });
    return await Promise.all(files);
  }

  function mergeAudio(buffers) {
   let output = audio.createBuffer(
     1,
     44100 * _maxDuration(buffers),
     44100
   );

   buffers.map(buffer => {
     for (let i = buffer.getChannelData(0).length - 1; i >= 0; i--) {
       output.getChannelData(0)[i] += buffer.getChannelData(0)[i];
     }
   });
   return output;
  }

  function play(buffer) {
   const source = audio.createBufferSource();
   source.buffer = buffer;
   source.connect(audio.destination);
   source.loop = true;
   source.start();
   return source;
  }

  function exportt(buffer, audioType) {
   const type = audioType || "audio/mp3";
   const recorded = _interleave(buffer);
   const dataview = _writeHeaders(recorded);
   const audioBlob = new Blob([dataview], { type: type });

   return {
     blob: audioBlob,
     url: _renderURL(audioBlob),
     element: _renderAudioElement(audioBlob, type)
   };
  }

  function download(blob, filename) {
   const name = filename || "crunker";
   const a = document.createElement("a");
   a.style = "display: none";
   audioDownload= _renderURL(blob);
   a.href = audioDownload;
   a.download = description + "." + blob.type.replace(/.+\/|;.+/g, "");
   a.innerHTML = a.download;
   player.src = audioDownload;
   document.body.appendChild(a);
   document.body.appendChild(player);
   return a;
  }

  function _maxDuration(buffers) {
    return Math.max.apply(Math, buffers.map(buffer => buffer.duration));
  }

  function _totalLength(buffers) {
    return buffers.map(buffer => buffer.length).reduce((a, b) => a + b, 0);
  }

  function _isSupported() {
    return "AudioContext" in window;
  }

  function _writeHeaders(buffer) {
    let arrayBuffer = new ArrayBuffer(44 + buffer.length * 2),
      view = new DataView(arrayBuffer);

    _writeString(view, 0, "RIFF");
    view.setUint32(4, 32 + buffer.length * 2, true);
    _writeString(view, 8, "WAVE");
    _writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, 44100, true);
    view.setUint32(28, 44100 * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    _writeString(view, 36, "data");
    view.setUint32(40, buffer.length * 2, true);

    return _floatTo16BitPCM(view, buffer, 44);
  }

  function _floatTo16BitPCM(dataview, buffer, offset) {
    for (var i = 0; i < buffer.length; i++, offset += 2) {
      let tmp = Math.max(-1, Math.min(1, buffer[i]));
      dataview.setInt16(offset, tmp < 0 ? tmp * 0x8000 : tmp * 0x7fff, true);
    }
    return dataview;
  }

  function _writeString(dataview, offset, header) {
    let output;
    for (var i = 0; i < header.length; i++) {
      dataview.setUint8(offset + i, header.charCodeAt(i));
    }
  }

  function _interleave(input) {
    let buffer = input.getChannelData(0),
      length = buffer.length * 2,
      result = new Float32Array(length),
      index = 0,
      inputIndex = 0;

    while (index < length) {
      result[index++] = buffer[inputIndex];
      result[index++] = buffer[inputIndex];
      inputIndex++;
    }
    return result;
  }

  function _renderAudioElement(blob, type) {
    const audio = document.createElement("audio");
    audio.controls = "controls";
    audio.type = type;
    audio.src = _renderURL(blob);
    return audio;
  }

  function _renderURL(blob) {
    return (window.URL || window.webkitURL).createObjectURL(blob);
  }

  var temp = fetchAudio(input)
          .then(buffers => mergeAudio(buffers))
          .then(output => play(output))
          .catch(error => {
          throw new Error(error);
        });

}
