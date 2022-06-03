// Populates an HTML div by the name "div_id" using the javascript object "data"


function populateDivById(div_id, data) {
  console.log('populating ' + div_id + ' using:');
  console.log(data);
  document.getElementById(div_id).innerHTML = 
    '<div><b>datasheet:</b>&nbsp;<a href="' + data.datasheet[0].url + '">' + data.datasheet[0].author + "</a></div>" +
    '<div><b>library:</b>&nbsp;<a href="' + data.library[0].url + '">' + data.library[0].author + "</a></div>";
}
