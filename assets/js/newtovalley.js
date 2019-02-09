var $$ = Dom7;

function readfile(file){
  fs.readFile(file, (err, data) => {
    if (err) { throw err; }
    return data;
  })
}

async function welcomeValley (user_position) {

  var i = track(user_position);
  var info = [];
  await i.then(function (value) {info = value;});
  console.log(info);
  var des = [];
  for (var i = 0; i < info.length; i++) {
    des.push(info[i].oneLineDescription);
  }
  // TODO: Bug here
  document.getElementById('description').innerHTML = des;
  //console.log(des);

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
      temp.innerHTML = '<p>general description: '+ generalDesc +'</p> ';
      $$('#'+i.toString()).append(temp);
      //document.getElementById(id).appendChild(temp);
    }
    if (instrumentDesc) {
      temp = document.createElement('div');
      temp.setAttribute("class", "block");
      temp.innerHTML = '<p>Instrument description: '+ instrumentDesc +'</p> ';
      $$('#'+i.toString()).append(temp);
    }
    if (musicianDesc) {
      temp = document.createElement('div');
      temp.setAttribute("class", "block");
      temp.innerHTML = '<p>Musician description: '+ musicianDesc +'</p> ';
      $$('#'+i.toString()).append(temp);
    }
    if (lyrictranslation) {
      temp = document.createElement('div');
      temp.setAttribute("class", "block");
      temp.innerHTML = '<p>Lyrics translation: '+ lyrictranslation +'</p> ';
      $$('#'+i.toString()).append(temp);
    }
    if (lyrictranslit) {
      temp = document.createElement('div');
      temp.setAttribute("class", "block");
      temp.innerHTML = '<p>Lyrics transliteration: '+ lyrictranslit +'</p> ';
      $$('#'+i.toString()).append(temp);
    }


  }

  console.log(pop);


  var paths = [];
  for (var i = 0; i < info.length; i++) {
    paths.push(info[i].filePath);
  }

  return paths;
}
