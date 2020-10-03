// Create a map object
var myMap = L.map("map", {
    center: [41.09, -109.71],
    zoom: 4.1
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Define a markerSize function that will give each city a different radius based on its population
  function markerSize(population) {
    return population / 40;
  }
  
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  d3.json(queryUrl, function(data) {

    var seismic = data.features;
  
  // Define arrays to hold created city and state markers
  // console.log(seismic);
  
  
  // Loop through locations and create city and state markers
  for (var i = 0; i < seismic.length; i++) {
    // Setting the marker radius for the state by passing population into the markerSize function

    var lat = seismic[i].geometry.coordinates[1];
    var long = seismic[i].geometry.coordinates[0];
    var depth = seismic[i].geometry.coordinates[2];
    var magnitude = seismic[i].properties.mag;
    var place = seismic[i].properties.place;
    // console.log(depth);
 

    var earthquakes = L.circle([lat, long], {
      fillOpacity: 0.75,
      color: "black",
      fillopacity: 0.3,
      fillColor: depthColor(depth),
      weight: "1",
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: depth*1000
    
    }).bindPopup("<h3>" + place + "</h3> <hr> <h3>Magnitude: " + magnitude + "<h3>"+ depth).addTo(myMap);
    }



})
// Conditionals for countries points
function depthColor(depth) {
  var color = "";
  if (depth >100 ) {return "Blue"}
  else if (depth > 80) {return "DarkMagenta"}
  else if (depth > 60) {return  "Red"}

  else if (depth > 40) {return "Coral"}
  else if (depth > 20) {return "orange"}
  else {return "yellow"}
}


let depthLegend = L.control({position: "bottomright"});
depthLegend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend"); 
    div.innerHTML = 
        '<b>Earthquake Depth</b><br>' +
        '<i style="background-color: Blue"></i>> 100km<br>' +
        '<i style="background-color: DarkMagenta"></i>80 - 100km<br>' +
        '<i style="background-color: Red"></i>60 - 80km<br>' +
        '<i style="background-color: Coral"></i>40 - 60<br>' +
        '<i style="background-color: orange"></i>20 -  40km<br>'+
        '<i style="background-color: yellow"></i>0 - 20km<br>';
    return div;
};

depthLegend.addTo(myMap);



