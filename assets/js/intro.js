var visited = [];

async function introPage(numvalley) {
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

    var bt = document.createElement('div');
    bg.innerHTML = '<a href="#" title="Play video" class="playintro"></a>';
    newdiv.appendChild(bg);

    $(document).ready(function() {
      var icon = $$('.playintro');
      icon.click(function() {
         icon.toggleClass('active');
         return false;
      });
    });

    firstHandleFilesSelectIntro(trackp);

    $$(".intro").show();
    setTimeout(function() { $$(".intro").hide(); }, 5000);
  }
}
