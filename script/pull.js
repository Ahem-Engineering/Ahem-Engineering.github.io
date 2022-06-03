// Call by passing URL to pull JSON data from and function to execute using the data
//  url - URL in text format
//  fn - function with a single parameter which is a JSON object collected from the URL

var git_data_this = {};
function pullJSON(url, fn) {
  var request = new XMLHttpRequest();
  request.onloadend = function() {
    if (this.status != 200) return;
    var data = JSON.parse(this.responseText);
    fn(data);
  };
  request.open('get', url, true);
  request.send();
}
