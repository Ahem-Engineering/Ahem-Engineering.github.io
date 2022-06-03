function pullJSON(url, fn) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    //var git_data = JSON.parse(this.responseText);
    //fn(git_data);
    fn(this.responseText);
  };
  request.open('get', url, true);
  request.send();
}
