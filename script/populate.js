function populateDiv(data, div) {
  var git_data = JSON.parse(data);
  console.log("Data returned from Git server:");
  console.log(git_data);
  div.innerHTML = "<code>" + data + "</code>";
}
