async function track(valley_pos) {
  //console.log(valley_pos);
  var data = {valleypos: valley_pos};
  var fileinputs;
  const d = await fetch('/audio', {
    method: 'post',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: 'valleypos='+valley_pos.toString()
  })
  .then(res => res.json())
  .catch(function (error) {
    console.log(' Request failed', error);
  });
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
