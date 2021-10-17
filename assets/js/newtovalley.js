var $$ = Dom7;
var soloon=false;
var introtrack = [];

async function readfile(file, id){
  var xmlhttp = new XMLHttpRequest();
  var txt;
  xmlhttp.open("GET", file, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        txt = xmlhttp.responseText;
        //alert(txt, id);
        document.getElementById(id).innerHTML = txt;
    }
  }
}

function soloTrack(index, allPaths){
//  console.log(allPaths[index]);
  unMute(allPaths[index]);
  muteBirds();
  mute_cls = $$('#mute'+index);
  solo_cls = $$('#solo'+index);
//  console.log(solo_cls);
  if (solo_cls.prop('checked')) {
    soloon = true;
    maxVolume(allPaths[index]);
    if (mute_cls.prop('checked')) {
      mute_cls.prop('checked', false);
    }
    for (var i = 0; i < allPaths.length; i++){
      if(allPaths[index] != allPaths[i]){
        mute_cls = $$('#mute'+i);
	      solo_cls = $$('#solo'+i);
        if (!mute_cls.prop('checked')){
           mute_cls.prop('checked', true);
        }
      	if (solo_cls.prop('checked')) {
      	   solo_cls.prop('checked', false);
      	}
        Mute(allPaths[i]);
      }
    }
  }
  else {
    soloon = false;
    for (var i = 0; i < allPaths.length; i++){
        mute_cls = $$('#mute'+i);
        if (mute_cls.prop('checked')) {
          mute_cls.prop('checked', false);
        }
        if (allPaths[i].includes("Ambient")){ unMute(allPaths[i], 0.3);}
        else if (allPaths[i].includes("Intro")) { unMute(allPaths[i], 0);}
        else { unMute(allPaths[i]);}
    }
  }
}

function muteTrack(index, allPaths, path) {
//  console.log(path);
 /* mute_cls = $$('#mute'+index);
  solo_cls = $$('#solo'+index);
  if (solo_cls.prop('checked')) {
	  solo_cls.prop('checked', false);
  }*/
  for (var i = 0; i < allPaths.length; i++){
    mute_cls = $$('#mute'+i);
    //if(path.localeCompare(allPaths[i]) && mute_cls.prop('checked')){
    //  if(allPaths[i].includes("Ambient")){ unMute(allPaths[i], 0.3);}
   // }
    if (allPaths[i].includes("Intro")) { unMute(allPaths[i], 0);}
    solo_cls = $$('#solo'+i);
    if (solo_cls.prop('checked')) {
      solo_cls.prop('checked', false);
    }
  }
  soloon = false;
  muteAndUnmute(path);
}

async function welcomeValley (user_position) {

  var i = track(user_position);
  var info = [];
  await i.then(function (value) {info = value;});
  console.log(user_position);
  var x = fetchTrackIntro(user_position%7);
  await x.then(function (value) {introtrack = value;});
  var paths = [];
  for (var i = 0; i < info.length; i++) {
    paths.push(info[i].filePath);
  }
  var des = [];
  var imgs = [];
  for (var i = 0; i < info.length; i++) {
    des.push(info[i].oneLineDescription);
    imgs.push(info[i].imagePath);
  }
  // TODO: Bug here
//  document.getElementById('description').innerHTML = des;
  console.log(imgs);
  var a = imgs[0].split(",");
  $$('.album-art').css('background-image', 'url('+a[0]+')');

  pop = document.querySelector('.popinfo');
  pop.innerHTML = "";
  //console.log(pop.innelHTML);
  console.log(introtrack);
  info.push.apply(info, introtrack);

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
    muteinsert =  '<div class="card">'+
                  '   <div class="card-header"> <p> Mute/Unmute</p> </div>'+
                  '   <div class="card-content card-content-padding">'+
                  '       <div class="block block-strong row">'+
                  '         <div class="col-50">'+
                  '        <p> <label class="checkbox">'+
                  '           <input type="checkbox"  class="mute" id="mute'+i.toString()+'">'+
                  '               <i class="icon icon-checkbox"></i>'+
                  '         </label>  Mute</p></div>'+
                  '         <div class="col-50"><p><label class="checkbox">'+
                  '           <input type="checkbox" class="solo" id="solo'+i.toString()+'">'+
                  '               <i class="icon icon-checkbox"></i>'+
                  '         </label>  Solo</p></div></div>'+
                  '   </div>'+
                  '</div>';
    muteinsert_0 =  '     <div class="col-25">'+
                    '        <p> <label class="checkbox">'+
                    '           <input type="checkbox"  class="mute" id="mute'+i.toString()+'">'+
                    '               <i class="icon icon-checkbox"></i>'+
                    '         </label>  Mute</p></div>'+
                    '     <div class="col-25"><p><label class="checkbox">'+
                    '           <input type="checkbox" class="solo" id="solo'+i.toString()+'">'+
                    '               <i class="icon icon-checkbox"></i>'+
                    '         </label>  Solo</p></div>';
    insert = 	'<div class="row no-gap"><div class="col-50">'+
		  '<a href="#" class="item-content item-link">'+
             '     <div class="item-inner"><div class="item-title">' + info[i].TrackName  + '</div></div></a> ' +
             '    </div>'+ muteinsert_0 + '</div>' +
	    '  <div class="accordion-item-content" id="'+i.toString()+'"> </div>';
             //'  <div class="accordion-item" id="'+i.toString()+'"> </div>';
    newitem.innerHTML = insert;
    pop.appendChild(newitem);
    num = i;
    //$$('#'+i.toString()).append(muteinsert);
    if (images) {
      var temp = document.createElement('div');
      temp.setAttribute("class", "card");
      var n0 = document.createElement('div');
      n0.setAttribute("class", "card-header");
      n0.innerHTML = "Images";
      temp.append(n0);
      $$('#'+i.toString()).append(temp);
      var div = document.createElement('div');
//      div.setAttribute('class', 'swiper-container swiper-init demo-swiper');
 //     div.innerHTML = '<div class="swiper-pagination"></div>';
      temp.append(div);
      var newdiv = document.createElement('div');
  //    newdiv.setAttribute('class', 'swiper-wrapper');
      div.append(newdiv);
      for (var j = 0; j < images.length; j++) {
        var imgs = document.createElement('div');
        imgs.setAttribute('class','swiper-slide');
        imgs.innerHTML = '<img src='+ images[j] +'>';
        newdiv.appendChild(imgs);
        break;
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
      var n2 = document.createElement('span');
      n2.setAttribute("lang", "tr");
      n2.setAttribute("id", "lyrictranslit"+i.toString());
      temp.append(n1);
      n1.append(n2);
      $$('#'+i.toString()).append(temp);
      readfile(lyrictranslit, "lyrictranslit"+i.toString());
    }
  }
  //console.log(pop);
  //var paths = [];
  //for (var i = 0; i < info.length; i++) {
  //  paths.push(info[i].filePath);
 // }


  $$('.mute').on('click change', function(){
//console.log(paths[this.id[this.id.length-1]]);
	//console.log(this.id, $$(this.id).prop('checked'));
             muteTrack(this.id[this.id.length-1].toString(), paths, paths[this.id[this.id.length-1]]);
   });
    $$('.solo').on('click change', function(){
//console.log(paths[this.id[this.id.length-1]]);
             soloTrack(this.id[this.id.length-1].toString(), paths);
    });
  return paths;
}
