var visited = [];

function introPage(numvalley) {
  if (!visited[numvalley]) {
    visited[numvalley] = true;
    var pg = document.getElementById('intro');

    var i = fetchTrackIntro(numvalley);
    var info = [];
    await i.then(function (value) {info = value;});
    var img = info.imagePath;
    var trackp = info.filePath;


    var newdiv = document.createElement('div');

    var imghtml = document.createElement('div');
    imghtml.innerHTML = '<img src='+ img +'>';
    newdiv.appendChild(imghtml);

    var 


    firstHandleFilesSelectIntro(trackp);

    $$(".intro").show();
    setTimeout(function() { $$(".intro").hide(); }, 5000);
  }
}
