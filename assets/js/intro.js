var visited = [];
var introOn = false;
async function introPage(pos, numvalley, prev) {
 // numvalley = numvalley % 7;
//  console.log(numvalley);
 // if(prev) {stopAudio();}
  var paths = [];
  if (!visited[numvalley]) {
    visited[numvalley] = true;
    var pg = document.querySelector('.intro');
    pg.innerHTML = "";
    var i = fetchTrackIntro(numvalley%7);
    var info = [];
    await i.then(function (value) {info = value;});
  //  console.log(info);
    var imgs = [];
    var trackp = [];
    //imgs.push(info[0].imagePath);
    for (var a = 0; a < info.length; a++) {
       if (info[a].imagePath != "")
	       imgs.push(info[a].imagePath);
	       trackp.push(info[a].filePath);
    }
    var newdiv = document.createElement('div');

    var words = document.createElement('div');
    words.setAttribute('height', '40px');
    words.setAttribute('width', '80px');
    var str = info[0].TrackName.split('-')[0];
    words.innerHTML = '<h1>Welcome to valley '+ str +'</h1>';
    newdiv.appendChild(words);

    var imghtml = document.createElement('div');
    imghtml.setAttribute('height', '40px');
    imghtml.setAttribute('width', '80px');
    imghtml.innerHTML = '<img class="img" src='+ imgs +'>';
    newdiv.appendChild(imghtml);
    pg.appendChild(newdiv);
    for (var b = 0; b < trackp.length; b++) {
      introaudio = document.createElement('audio');
      pg.appendChild(introaudio);
      introaudio.setAttribute('id', "introaudio"+b);
      introaudio.setAttribute('src', trackp[b]);
      introaudio.setAttribute('class', 'audios');
   }
   var playbutton = document.createElement("button");
   playbutton.innerHTML = "PLAY";
   playbutton.setAttribute("class","button");
   pg.appendChild(playbutton);
   playbutton.addEventListener("click", playintrotracks);
   var closebutton = document.createElement("button");
   pg.appendChild(closebutton);
   closebutton.setAttribute("class","button");
   closebutton.innerHTML = "CLOSE";
   function playintrotracks() {
   for (var b = 0; b < trackp.length; b++) {
      var play = document.getElementById('introaudio'+b);
      console.log(play);
      var playpromise = play.play();
      if (playpromise !== undefined) {
      	playpromise.then(_ => {}).catch(error => {
      	  play.play();
      	});
      }
   }}
   $$(".intro").show();
   introOn = true;
   var timeout = setTimeout(function() {
     $$(".intro").hide();
     for(var x=0; x<trackp.length; x++){
       p = document.getElementById("introaudio"+x);
       p.pause();
     }
     paths = welcomeValley(numvalley);
     handleFilesSelect(pos, paths);
     introOn = false;
     }, 100000);
   closebutton.addEventListener("click", function () {
       $$(".intro").hide();
       for(var x=0; x<trackp.length; x++){
         p = document.getElementById("introaudio"+x);
         p.pause();
       }
       paths = welcomeValley(numvalley);
       handleFilesSelect(pos, paths);
       clearTimeout(timeout);
       introOn = false;
   });
  }
  else {
    //if(prev) {stopAudio();}
    if (introOn) {
      $$(".intro").hide();
      var allAudios = document.querySelectorAll(".audios");
      for (var i = 0; i<allAudios.length; i++){
        allAudios[i].pause();
      }
      introOn = false;
    }
    paths = welcomeValley(numvalley);
//    console.log(paths);
    handleFilesSelect(pos, paths);
  }
}
