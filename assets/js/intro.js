var visited = [];
var introOn = false;
var ambientTrack, introTrack;
//var introtrack = [];

var progress = 0;
var progressBarEl = app.progressbar.show('#demo-determinate-container', 0);
app.progressbar.set('#demo-inline-progressbar', progress);
function simulateLoading(nums) {
    //setTimeout(function () {
      var progressBefore = progress;
      progress = nums * 100;
      app.progressbar.set(progressBarEl, progress);
      if (progressBefore >= 100) {
        //determinateLoading = false;
        app.progressbar.hide(progressBarEl); //hide
      }
    //}, Math.random() * 200 + 200);
  }
async function loadAllFiles(fP) {
   var loadingnums = 0;
   progress = 0;
   app.progressbar.set('#demo-inline-progressbar', progress);
   $$('.download').show();
   let filePaths = fP;
   var totalnum = fP.length;
   for (let f of filePaths) {
     var arrayBuffer;
     var e = false;
     var audioBuffer;
//     console.log(responses[f]);
     if (!responses[f]) {
        responses[f] = true;

        axios({
          method: 'get',
          url: f,
          responseType: 'arraybuffer'
        })
        .then(function (response) {
	   audio.decodeAudioData(response.data, function (audioBuffer){
             responses[f] = audioBuffer;
             loadingnums+=1;
             simulateLoading(1.0*loadingnums/totalnum);
             if (loadingnums == totalnum) {$$('.download').hide();}
           },
           function(e){
             console.log("Error with decoding audio data" + e.err);
           });
        })
        .catch(function (error) {
          console.log(error);
        });
     }
     else {
       loadingnums+=1;
       simulateLoading(1.0*loadingnums/totalnum);
     }
  }
}

async function introPage(pos, numvalley, prev) {
 // numvalley = numvalley % 7;
 // console.log(numvalley);
 // if(prev) {stopAudio();}
  var paths = [];
  var trackp = [];
  //console.log(numvalley);
  ps = welcomeValley(numvalley);
  await ps.then(function(value) {paths = value;});
  if (!visited[numvalley]) {
    visited[numvalley] = true;
    var pg = document.querySelector('.intro');
    pg.innerHTML = "";
    var i = fetchTrackIntro(numvalley%7);
    var x = track(numvalley);
    var info = [];
    var alltracks = [];
    var allpaths = [];
    await i.then(function (value) {info = value;});
    await x.then(function (value) {alltracks.push.apply(alltracks, info); alltracks.push.apply(alltracks, value);});
    for (var a = 0; a < alltracks.length; a++) {
      allpaths.push(alltracks[a].filePath);
    }
    await loadAllFiles(allpaths);
    var imgs = [];
    //imgs.push(info[0].imagePath);
    for (var a = 0; a < info.length; a++) {
       if (info[a].imagePath != "")
	       imgs.push(info[a].imagePath);
	       trackp.push(info[a].filePath);
    }
    introTrack = trackp[0];
    ambientTrack = trackp[1];
    var newdiv = document.createElement('div');

    var words = document.createElement('div');
    words.setAttribute('height', '40px');
    words.setAttribute('width', '80px');
    var str = info[0].TrackName.split('-');
    var dstr = str[0];
    for (var q=1; q<str.length-1; q++) {
      dstr = dstr.concat(' '+str[q]);
    }
    words.innerHTML = '<h1>'+ (numvalley%7+1) +'. '+ dstr +'</h1>';
    newdiv.appendChild(words);

    var imghtml = document.createElement('div');
    imghtml.setAttribute('height', '40px');
    imghtml.setAttribute('width', '80px');
    imghtml.innerHTML = '<img class="img" src='+ imgs[0] +'>';
    newdiv.appendChild(imghtml);
    pg.appendChild(newdiv);
    introaudio = document.createElement('audio');
    pg.appendChild(introaudio);
    introaudio.setAttribute('id', "introaudio");
    introaudio.setAttribute('class', 'audios');
    introaudio.autoplay = true;
    introaudio.setAttribute('src', trackp[0]);
    introaudio.onended = function() {
      introaudio.setAttribute('src', trackp[1]);
      introaudio.play();
    } 
    /*
    for (var b = 0; b < trackp.length; b++) {
      introaudio = document.createElement('audio');
      pg.appendChild(introaudio);
      introaudio.setAttribute('id', "introaudio"+b);
      introaudio.setAttribute('src', trackp[b]);
      introaudio.setAttribute('class', 'audios');
      introaudio.autoplay = true;
   }*/
   var playbutton = document.createElement("button");
   playbutton.innerHTML = "PLAY";
   playbutton.setAttribute("class","button");
   pg.appendChild(playbutton);
   playbutton.addEventListener("click", playintrotracks);
   var closebutton = document.createElement("button");
   pg.appendChild(closebutton);
   closebutton.setAttribute("class","button");
   closebutton.innerHTML = "CLOSE";
   closebutton.addEventListener("click", closeIntro);
   function closeIntro() {
    // setTimeout(function() {$$(".intro").hide();},0);
     document.querySelector('.intro').style.display = 'none';
     //for(var x=0; x<trackp.length; x++){
       p = document.getElementById("introaudio");
       p.pause();
     //}
     clearTimeout(timeout);
     introOn = false;
     setTimeout(function() {handleFilesSelect(pos, paths);}, 0);
   }
   function playintrotracks() {
   //for (var b = 0; b < trackp.length; b++) {
      var play = document.getElementById('introaudio');
      if (play.duration < 0 || play.paused) {
//      console.log(play);
        var playpromise = play.play();
        if (playpromise !== undefined) {
      	  playpromise.then(_ => {}).catch(error => {
      	    play.play();
      	  });
        }
      }
   // }
  }
   $$(".intro").show();
   introOn = true;
   var timeout = setTimeout(function() {
     document.querySelector('.intro').style.display = 'none';
     //setTimeout(function() {$$(".intro").hide();},0);
     for(var x=0; x<trackp.length; x++){
       p = document.getElementById("introaudio"+x);
       p.pause();
     }
     setTimeout(function() {handleFilesSelect(pos, paths);}, 0);
     introOn = false;
     }, 360000);
  }
  else {
    //if(prev) {stopAudio();}
    if (introOn) {
     // setTimeout(function() {$$(".intro").hide();},0);
      document.querySelector('.intro').style.display = 'none';
      var allAudios = document.querySelectorAll(".audios");
      for (var i = 0; i<allAudios.length; i++){
        allAudios[i].pause();
      }
      introOn = false;
    }
//    console.log(paths);
    setTimeout(function() {handleFilesSelect(pos, paths);}, 0);
  }
}
