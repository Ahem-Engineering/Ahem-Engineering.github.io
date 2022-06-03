function populateDiv(div, data) {
  console.log("Data returned from Git server:");
  console.log(data);
  div.innerHTML = "<code>" + JSON.stringify(data) + "</code>";
}
