function track(valley_pos) {
  //console.log(valley_pos);
  var data = {valleypos: valley_pos};
  fetch('/audio', {
    method: 'post',
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: 'valleypos='+valley_pos.toString()
  })
  .then(JSON)
  .then(function (data){
    console.log('Request succeeded with JSON response', data);
  })
  .catch(function (error) {
    console.log(' Request failed', error);
  });
}
