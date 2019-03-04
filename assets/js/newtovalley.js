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

function soloTrack(index, allPaths){
  console.log(allPaths, allPaths[index]);
  unMute(allPaths[index]);
  for (var i = 0; i < allPaths.length; i++){
    if(allPaths[index] !== allPaths[i]){
      solo_cls = $$('solo'+i);
      if (solo_cls.hasClass("soloinactive")){
	        solo_cls.remove("soloinactive");
	        solo_cls.add("soloactive");
      }
      else{
	      solo_cls.add("soloinacive");
        solo_cls.remove("soloactive");
      }
      Mute(allPaths[i]);
    }
  }
}

function muteTrack(index, path) {
  console.log(path);
  mute_cls = $$('#mutediv'+index);
  if (mute_cls.hasClass("muteinactive")) {
	  mute_cls.remove("muteinactive");
  	mute_cls.add("muteactive");
  }
  else {
	  mute_cls.add("muteinactive")
  	mute_cls.remove("muteactive");
  }
  muteAndUnmute(path);
}

async function welcomeValley (user_position) {

  var i = track(user_position);
  var info = [];
  await i.then(function (value) {info = value;});
  console.log(info);
  var des = [];
  var imgs = [];
  var allPaths = [];
  for (var i = 0; i < info.length; i++) {
    allPaths.push(info[i].filePath);
  }
  for (var i = 0; i < info.length; i++) {
    des.push(info[i].oneLineDescription);
    imgs.push(info[i].imagePath);
  }
  // TODO: Bug here
  document.getElementById('description').innerHTML = des;
  var a = imgs[0].split(",");
  //console.log(a[0]);
  $$('.album-art').css('background-image', 'url('+a[0]+')');

  pop = document.querySelector('.popinfo');
  //console.log(pop.innelHTML);
  for (var i = 0; i < info.length; i++) {
    var newitem = document.createElement('li');
    var trackPath = info[i].filePath;
    var generalDesc = info[i].generalDesc;
    var instrumentDesc = info[i].instrumentDesc;
    var musicianDesc = info[i].musicianDesc;
    var lyrictranslation = info[i].lyrictranslation;
    var lyrictranslit = info[i].lyrictranslit;
    var performer = info[i].performer;
    var videoPath = info[i].videoPath;
    var num = -1;

    var images = info[i].imagePath;
    images = images.split(",");

    newitem.setAttribute("class", "accordion-item");
    insert = '<a href="#" class="item-content item-link">'+
             '  <div class="item-inner"> '+
             '     <div class="item-title">' + info[i].TrackName + '</div> '+
             '    </div></a> '+
             '  <div class="accordion-item-content" id="'+i.toString()+'"> </div>';
    muteinsert =  '<div class="card">'+
                  '   <div class="card-header"> <p> Mute/Unmute</p> </div>'+
                  '   <div class="card-content card-content-padding">'+
                  '       <div class="col-50"><p>Mute: </p><div class="mute muteinactive" id="mutediv'+i.toString()+'">'+
                  '         <a id=mute'+ i.toString() +'>mute</a></div>'+
                  '       <div class="col-50"><p>Solo: </p><div class="solo soloinactive" id="solodiv'+i.toString()+'">'+
                  '         <a id=solo'+ i.toString() +'>solo</a>'+
                  '       </div></div>'+
                  '   </div>'+
                  '</div>';

    newitem.innerHTML = insert;
    pop.appendChild(newitem);
    num = i;
    $$('#'+i.toString()).append(muteinsert);
    //$$('#mute'+i.toString()).on('click', {param1: i.toString(), param2: trackPath}, mute);
    $$('#mute'+num.toString()).on('click', function(){
	     muteTrack(num.toString(), trackPath);
    });
    $$('#solo'+num.toString()).on('click', function(){
	     soloTrack(num.toString(), allPaths);
    });
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
      readfile(generalDesc, "generalDesc"+i.toString());
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
