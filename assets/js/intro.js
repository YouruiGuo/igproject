var visited = [];

async function introPage(numvalley) {
  console.log(visited);
  if (!visited[numvalley]) {
    visited[numvalley] = true;
    var pg = document.querySelector('.intro');
    pg.innerHTML = "";
    var i = fetchTrackIntro(numvalley);
    var info = [];
    await i.then(function (value) {info = value;});
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
      //var player = document.getElementById("introaudio"+b);
      //console.log(player);
      //player.play();
     // introaudio.play();
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
   closebutton.addEventListener("click", function () {
       $$(".intro").hide(); for(var x=0; x<trackp.length; x++){ p = document.getElementById("introaudio"+x); p.pause();}
   });
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
   // var playa = document.querySelector('audio');
   // playa.play();
    //firstHandleFilesSelectIntro(trackp);

    $$(".intro").show();
    setTimeout(function() { $$(".intro").hide(); for(var x=0; x<trackp.length; x++){ p = document.getElementById("introaudio"+x); p.pause();} }, 50000);
  }
}
