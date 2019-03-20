var visited = [];

async function introPage(numvalley) {
  if (!visited[numvalley]) {
    visited[numvalley] = true;
    var pg = document.querySelector('.intro');

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
    //console.log(trackp);
    var newdiv = document.createElement('div');

    var imghtml = document.createElement('div');
    imghtml.setAttribute('height', '40px');
    imghtml.setAttribute('width', '80px');
    imghtml.innerHTML = '<img class="img" src='+ imgs +'>';
    newdiv.appendChild(imghtml);

    var bt = document.createElement('div');
    bt.innerHTML = '<a href="#" title="Play video" class="playintro"></a>';
    newdiv.appendChild(bt);
    pg.appendChild(newdiv);

    firstHandleFilesSelectIntro(trackp);

    $$(".intro").show();
    setTimeout(function() { $$(".intro").hide(); }, 5000);
  }
}
