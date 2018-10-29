function track(valley_pos) {

  //console.log(valley_pos);
  var data = {valleypos: valley_pos};
  var fileinputs;
  const p = fetch('/audio', {
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
  p.then(data => {
    for (var i = 0; i < data.length; i++) {
      paths.push(data[i].filePath);
    }

    handleFilesSelect(paths);
    //console.log(data);
  });
}
