// Call by passing URL to pull JSON data from and function to execute using the data
//  url - URL in text format
//  fn - function with a single parameter which is a JSON object collected from the URL

var git_data_this = {};
function pullJSON(url, on200, on404 = null) {
  var request = new XMLHttpRequest();
  request.onloadend = function() {
    if (this.status == 404) on404();
    else if (this.status == 200) {
      var data = JSON.parse(this.responseText);
      on200(data);
    } else {
      console.log("error: server returned " + this.responseText);
    }
  };
  request.open('get', url, true);
  request.send();
}
