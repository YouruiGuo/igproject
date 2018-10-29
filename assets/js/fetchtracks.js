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

  p.then(data => {
    //console.log(data);
  });
}
