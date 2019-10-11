
  var myMap = L.map("map", {
    // center: [37.8, -96],
    center:[37, -95],
    zoom: 4,
    // layers: [streetmap, layer_0119]
  });

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoiYXJpdmFyZ2FzYiIsImEiOiJjazByYm16ajIwNG1kM25zN2M4dDRmNGQyIn0.Ya-5ppfCOpgBtfNonUAhCQ"
  }).addTo(myMap);

// Create a function to change the color based on enrollment change
var change = ""

function getColor(change) {
    return change < -6.5  ? '#4B000F' :
    // change <= -15  ? '#4B000F' :    
    change < -4  ? '#fb350d' :       
    change < -2.5  ? '#fc5f3f' :
    change < -1  ? '#FD8D3C':
    change < -0.5  ? '#FEB24C' :
    // change < -1   ? '#FED976' :
    change < 0    ?  '#FED976':	 
    change >= 0   ? '#cff7cf' :
     'white';                     
}; 

// Create an array that holds data for change in state quarterly enrollment
var json = "data/clean/SNAP_state_clean.json";
var geojson = "data/geojson/gz_2010_us_040_00_5m.json";

var array = [];
d3.json(json, function(data) {
var changes=data;  
for (var i = 0; i < changes.length; i++) {
    if (changes[i].semester=="0119"){ 
  array.push({
    "state_name": changes[i].state_name,
    "color": getColor(changes[i].snap_biannual_chan),
    "change": Number(changes[i].snap_biannual_chan).toFixed(1)

  });
}};
console.log(array)
});

// var layer_0119  = [];

d3.json(geojson, function(data) {

  var geodata=data.features;
// Loop within the array
  for (var i = 0; i < array.length; i++) {
// Loop within each element of the array
    for (var j = 0; j < geodata.length; j++) {
        if (array[i].state_name == geodata[j].properties.NAME){
    L.geoJson(geodata[j], {
                style: function(feature) {
                return {
                    color: array[i].color,
                    fillColor: array[i].color,
                    opacity:0.60,
                    fillOpacity: 0.60,
                    weight: .5            
                    };
                } 
            }).bindPopup("<h3>" + array[i].state_name 
            + "</h3> <hr> <h4>Change in SNAP : " +array[i].change 
            + "%</h4>")
            .addTo(myMap);
            };
          };
        };
    });

setTimeout(function(){


// var snap = L.layerGroup(layer_0119);
  
// var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets",
//   accessToken: 'pk.eyJ1IjoiYXJpdmFyZ2FzYiIsImEiOiJjazByYm16ajIwNG1kM25zN2M4dDRmNGQyIn0.Ya-5ppfCOpgBtfNonUAhCQ'
// });

// var baseMaps = {
//   "Street Map": streetmap
// };

// // Create an overlay object
// var overlayMaps = {
//   "Drop in SNAP<br>beneficiaries by county": snap
// };

// var myMap = L.map("map", {
//   center:[37, -95],
//   zoom: 4,
//   layers: [streetmap, snap]
// });


// L.control.layers(baseMaps, overlayMaps, {
//   collapsed: false
// }).addTo(myMap);

// // Add title
var populationLegend = L.control({position: 'bottomleft'});
populationLegend.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML +=
  '<h2><strong><center>Drop in number of SNAP beneficiaries</center></strong></h2>';
return div;
};
populationLegend.addTo(myMap);

// // Add legend 
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend'),
  snap = [-7.5, -6.5, -4 , -2.5, -1, -0.5,  0],
  labels = [];
  for (var i = 0; i < snap.length; i++) {
  snap[i] = snap[i].toFixed(1); 
  
};

// return change < -6.5  ? '#4B000F' :
// // change <= -15  ? '#4B000F' :    
// change < -4  ? '#fb350d' :       
// change < -2.5  ? '#fc5f3f' :
// change < -1  ? '#FD8D3C':
// change < -0.5  ? '#FEB24C' :
// // change < -1   ? '#FED976' :
// change < 0    ?  '#FED976':	 
// change >= 0   ? '#cff7cf' :



div.innerHTML +=  '<strong>Drop in number<br>of SNAP beneficiaries<br>per county (%)</strong><hr>' 
for (var i = 0; i < snap.length; i++) {
  div.innerHTML += 
  '<i style="background-color:' + getColor(snap[i]) + ';">&nbsp&nbsp&nbsp;</i> ' +
    snap[i] + (snap[i + 1] ? ' to ' + (snap[i + 1] -.1) + '<br>' : '+<br><br>');
}

return div;
};
legend.addTo(myMap);


}, 1500);