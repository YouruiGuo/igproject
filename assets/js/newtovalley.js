var $$ = Dom7;

async function readfile(file, id, header){
  var xmlhttp = new XMLHttpRequest();
  var txt;
  xmlhttp.open("GET", file, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        txt = xmlhttp.responseText;
        //alert(txt);
        document.getElementById(id).innerHTML = '<p>'+ header + txt +'</p> ';
    }
  }
}

async function welcomeValley (user_position) {

  var i = track(user_position);
  var info = [];
  await i.then(function (value) {info = value;});
  console.log(info);
  var des = [];
  var imgs = [];
  for (var i = 0; i < info.length; i++) {
    des.push(info[i].oneLineDescription);
    imgs.push(info[i].imagePath);
  }
  // TODO: Bug here
  document.getElementById('description').innerHTML = des;
  //console.log(des);
  $$('.album-art').css('background-image', 'url(/images/icons8-play-32.png)');

  pop = document.querySelector('.popinfo');
  //console.log(pop.innelHTML);
  for (var i = 0; i < info.length; i++) {
    var newitem = document.createElement('li');

    var generalDesc = info[i].generalDesc;
    var instrumentDesc = info[i].instrumentDesc;
    var musicianDesc = info[i].musicianDesc;
    var lyrictranslation = info[i].lyrictranslation;
    var lyrictranslit = info[i].lyrictranslit;
    var performer = info[i].performer;
    var videoPath = info[i].videoPath;

    newitem.setAttribute("class", "accordion-item");
    insert = '<a href="#" class="item-content item-link">'+
             '  <div class="item-inner"> '+
             '     <div class="item-title">' + info[i].TrackName + '</div> '+
             '    </div></a> '+
             '  <div class="accordion-item-content" id="'+i.toString()+'"> </div>';

    newitem.innerHTML = insert;
    pop.appendChild(newitem);

    if (generalDesc) {
      temp = document.createElement('div');
      temp.setAttribute("class", "block");
      temp.setAttribute("id", "generalDesc"+i.toString());
      $$('#'+i.toString()).append(temp);
      readfile(generalDesc, "generalDesc"+i.toString(), "General description:");
    }
    if (instrumentDesc) {
      temp = document.createElement('div');
      temp.setAttribute("class", "block");
      temp.setAttribute("id", "instrumentDesc"+i.toString());
      $$('#'+i.toString()).append(temp);
      readfile(instrumentDesc, "instrumentDesc"+i.toString(), "instrument description:");
    }
    if (musicianDesc) {
      temp = document.createElement('div');
      temp.setAttribute("class", "block");
      temp.setAttribute("id", "musicianDesc"+i.toString());
      $$('#'+i.toString()).append(temp);
      readfile(musicianDesc, "musicianDesc"+i.toString(), "Musician description:");
    }
    if (lyrictranslation) {
      temp = document.createElement('div');
      temp.setAttribute("class", "block");
      temp.setAttribute("id", "lyrictranslation"+i.toString());
      $$('#'+i.toString()).append(temp);
      readfile(lyrictranslation, "lyrictranslation"+i.toString(), "Lyrics translation:");
    }
    if (lyrictranslit) {
      temp = document.createElement('div');
      temp.setAttribute("class", "block");
      temp.setAttribute("id", "lyrictranslit"+i.toString());
      $$('#'+i.toString()).append(temp);
      readfile(lyrictranslit, "lyrictranslit"+i.toString(), "Lyrics transliteration:");
    }
  }
  //console.log(pop);
  var paths = [];
  for (var i = 0; i < info.length; i++) {
    paths.push(info[i].filePath);
  }

  return paths;
}
