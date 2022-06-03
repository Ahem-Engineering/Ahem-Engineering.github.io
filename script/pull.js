function pullJSON(url, fn) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
	  fn(this.responseText);
  };
  request.open('get', url, true);
  request.send();
}
