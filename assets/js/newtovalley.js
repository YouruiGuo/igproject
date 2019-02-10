var $$ = Dom7;

async function readfile(file, id){
  var xmlhttp = new XMLHttpRequest();
  var txt;
  xmlhttp.open("GET", file, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        txt = xmlhttp.responseText;
        //alert(txt);
        document.getElementById(id).innerHTML = txt;
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
  img = imgs[0].split(",");
  $$('.album-art').css('background-image', 'url('+img[0]+')');

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

    var images = info[i].imagePath;
    images = images.split(",");

    newitem.setAttribute("class", "accordion-item");
    insert = '<a href="#" class="item-content item-link">'+
             '  <div class="item-inner"> '+
             '     <div class="item-title">' + info[i].TrackName + '</div> '+
             '    </div></a> '+
             '  <div class="accordion-item-content" id="'+i.toString()+'"> </div>';

    newitem.innerHTML = insert;
    pop.appendChild(newitem);

    if (images) {
      var temp = document.createElement('div');
      temp.setAttribute("class", "card");
      var n0 = document.createElement('div');
      n0.setAttribute("class", "card-header");
      n0.innerHTML = "Images";
      temp.append(n0);
      $$('#'+i.toString()).append(temp);
      var div = document.createElement('div');
      div.setAttribute('class', 'swiper-container swiper-init demo-swiper');
      div.innerHTML = '<div class="swiper-pagination"></div>';
      temp.append(div);
      var newdiv = document.createElement('div');
      newdiv.setAttribute('class', 'swiper-wrapper');
      div.append(newdiv);
      for (var j = 0; j < images.length; j++) {
        var imgs = document.createElement('div');
        imgs.setAttribute('class','swiper-slide');
        imgs.innerHTML = '<img src='+ images[j] +'>';
        newdiv.appendChild(imgs);
      }
    }

    if (generalDesc) {
      var temp = document.createElement('div');
      temp.setAttribute("class", "card");
      var n0 = document.createElement('div');
      n0.setAttribute("class", "card-header");
      n0.innerHTML = "General description";
      temp.append(n0);
      var n1 = document.createElement('div');
      n1.setAttribute("class", "card-content card-content-padding");
      n1.setAttribute("id", "generalDesc"+i.toString());
      temp.append(n1);
      $$('#'+i.toString()).append(temp);
      readfile("robots.txt", "generalDesc"+i.toString());
    }
    if (instrumentDesc) {
      temp = document.createElement('div');
      temp.setAttribute("class", "card");
      var n0 = document.createElement('div');
      n0.setAttribute("class", "card-header");
      n0.innerHTML = "instrument description";
      temp.append(n0);
      var n1 = document.createElement('div');
      n1.setAttribute("class", "card-content card-content-padding");
      n1.setAttribute("id", "instrumentDesc"+i.toString());
      temp.append(n1);
      $$('#'+i.toString()).append(temp);
      readfile(instrumentDesc, "instrumentDesc"+i.toString());
    }
    if (musicianDesc) {
      temp = document.createElement('div');
      temp.setAttribute("class", "card");
      var n0 = document.createElement('div');
      n0.setAttribute("class", "card-header");
      n0.innerHTML = "Musician description";
      temp.append(n0);
      var n1 = document.createElement('div');
      n1.setAttribute("class", "card-content card-content-padding");
      n1.setAttribute("id", "musicianDesc"+i.toString());
      temp.append(n1);
      $$('#'+i.toString()).append(temp);
      readfile(musicianDesc, "musicianDesc"+i.toString());
    }
    if (lyrictranslation) {
      temp = document.createElement('div');
      temp.setAttribute("class", "card");
      var n0 = document.createElement('div');
      n0.setAttribute("class", "card-header");
      n0.innerHTML = "Lyrics translation";
      temp.append(n0);
      var n1 = document.createElement('div');
      n1.setAttribute("class", "card-content card-content-padding");
      n1.setAttribute("id", "lyrictranslation"+i.toString());
      temp.append(n1);
      $$('#'+i.toString()).append(temp);
      readfile(lyrictranslation, "lyrictranslation"+i.toString());
    }
    if (lyrictranslit) {
      temp = document.createElement('div');
      temp.setAttribute("class", "card");
      var n0 = document.createElement('div');
      n0.setAttribute("class", "card-header");
      n0.innerHTML = "Lyrics transliteration";
      temp.append(n0);
      var n1 = document.createElement('div');
      n1.setAttribute("class", "card-content card-content-padding");
      n1.setAttribute("id", "lyrictranslit"+i.toString());
      temp.append(n1);
      $$('#'+i.toString()).append(temp);
      readfile(lyrictranslit, "lyrictranslit"+i.toString());
    }
  }
  //console.log(pop);
  var paths = [];
  for (var i = 0; i < info.length; i++) {
    paths.push(info[i].filePath);
  }

  return paths;
}
