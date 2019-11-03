async function allInfo () {
  var data;
  await axios.post('/info')
  .then(function(res){data = res.data;})
  .catch(function (error) {
    console.log(' Request failed', error);
  });
  var d = data;
  var paths = [];
  for (var i = 0; i < d.length; i++) {
    allinfo.push(d[i]);
    paths.push(d[i]);
  }
  //console.log(paths);
  if (paths != []) {
    return paths;
  }
}
/*
//https://gist.github.com/ferreiro/2b5caac126b58bebce82
var exponential = 2.718281828;
function poisson(lambda) {
    exponentialPower = Math.pow(exponential, -lambda); // negative power k
    landaPowerK = Math.pow(lambda, k); // Landa elevated k
    numerator = exponentialPower * landaPowerK;
    denominator = fact(k); // factorial of k.
    
    return (numerator / denominator);
}

function fact(x) {
   if(x==0) {
      return 1;
   }
   return x * fact(x-1);
}
*/
async function birdsTrack() {
  var data;
  //var prob = poisson(5);

  var r = Math.floor(Math.random()*10);
  await axios.post('/intro', {
    //headers: {
    //  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    //},
    //body: 'valleypos=birds'+r.toString()
    valleypos: 'birds'+r.toString()
  })
  .then(function(res) { data = res.data;})
  .catch(function (error) {
    console.log(' Request failed', error);
  });
  if (data.length != 0) {
    return data;
  }
}

async function track(valley_pos) {
  //console.log(valley_pos);
  var data;
  var fileinputs;
   await axios({
    method: "post",
    url: "/audio",
    //headers: {
    //  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    //},
    //body: 'valleypos=birds'+r.toString()
    data: {valleypos: valley_pos.toString()}
  })
  .then(function(res) {data = res.data;})
  .catch(function (error) {
    console.log(' Request failed', error);
  });
  var d = data;
  var paths = [];
  //p.then(d => {
    if (valley_pos != -1) {
      for (var i = 0; i < d.length; i++) {
        paths.push(d[i]);
      }
      //console.log(paths);
      if (paths != []) {
        //handleFilesSelect(paths);
        return paths;
        //test();
      }
    }
    //console.log(data);
 // });
}

// fetch the audio for welcome
async function fetchTrackIntro(valley_pos) {
  valley_pos += 1;
  var data;
  await axios({
    method: "post",
    url: "/intro",
    //headers: {
    //  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    //},
    //body: 'valleypos=birds'+r.toString()
    data: {valleypos: 'intro'+valley_pos.toString()}
  })
  .then(function(res) {data = res.data;})
  .catch(function (error) {
    console.log(' Request failed', error);
  });
  var d = data;
  var paths = [];
  if (valley_pos != -1) {
    for (var i = 0; i < d.length; i++) {
      paths.push(d[i]);
    }
    if (paths != []) {
      return paths;
    }
  }
}
