// ###################################
//  II. Heatmap for change in SNAP
// ###################################

var json_co= "data/clean/SNAP_county_clean.json";

var array_co = [];
var heat_layer = [];
d3.json(json_co, function(data) {
var changes=data;

for (var i = 0; i < changes.length; i++) {
  if (changes[i].semester=="0119" 
  && Number(changes[i].snap_biannual_chan)<=0 ){
    var location = changes[i];
  
  array_co.push([location.lat, location.lon,  location.snap_biannual_chan*-1/100 ] );
};
};
    
heat_layer.push(
  L.heatLayer(array_co, {
      radius: 8,
      min: 0,
      max: 1,
      blur: 3,
      minOpacity: 0.4,
      gradient: {
        0.6:  '#f23e45',
        0.7: 'lime',
        0.8: 'yellow',
        0.9: '#FF8300',
        1.0:  'red'
      }                        
}));

});

setTimeout(function(){
  var heat = L.layerGroup(heat_layer);
  
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: 'pk.eyJ1IjoiYXJpdmFyZ2FzYiIsImEiOiJjazByYm16ajIwNG1kM25zN2M4dDRmNGQyIn0.Ya-5ppfCOpgBtfNonUAhCQ'
});

var baseMaps = {
  "Street Map": streetmap
};

// Create an overlay object
var overlayMaps = {
  "Drop in SNAP<br>beneficiaries by county": heat
};

var myMap = L.map("map", {
  // center: [37.8, -96],
  center:[37, -95],
  zoom: 4,
  layers: [streetmap, heat]
});


L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);



// // ###################################
// //  I. Choropleth for undocumented pop
// // ###################################

// Create a function to change the color based on enrollment change
var change = ""

  function getColorMigr(change) {
    return change >= 5  ? '#120902' :
    change > 4  ? '#351a07' :
    change > 3  ? '#68340e' :       
    change > 2.5  ? '#7a3c11' :
    change > 2  ? '#9c4e15':
    change > 1.5  ? '#d0671c' :
    change > 1   ? '#e58642' :
    change >= 0   ? '#efb287' :
     'white';   
}; 

// Create an array that holds data for change in state quarterly enrollment
var json = "data/clean/snap_state_quarter.json";
var geojson = "data/geojson/gz_2010_us_040_00_5m.json";
console.log(json);
var array = [];
d3.json(json, function(data) {
var changes=data;  
for (var i = 0; i < changes.length; i++) {
  array.push({
    "state_name": changes[i].state_name,
    "colormig": getColorMigr(changes[i].pop_un_st_per),
    "change": changes[i].snap_biannual_chan,
    "undoc": Number(changes[i].pop_un_st_per).toFixed(1)

  });
};
});

console.log(array);

d3.json(geojson, function(data1) {

  var geodata=data1.features;
// Loop within the array
  for (var i = 0; i < array.length; i++) {
// Loop within each element of the array
    for (var j = 0; j < geodata.length; j++) {
        if 
          (array[i].state_name == geodata[j].properties.NAME) {

         L.geoJson(geodata[j], {
            style: function(feature) {
              return {
                color: array[i].colormig,
                fillColor: array[i].colormig,
                opacity:0.35,
                fillOpacity: 0.35,
                weight: .5
          
              };
            } 
          }).bindPopup("<h3>State: " + array[i].state_name + "</h3> <hr> <h4>Undocumented: " +array[i].undoc  +  "%</h3>")
          .addTo(myMap);
          };
  };
  };

});

// Add title
var populationLegend = L.control({position: 'bottomleft'});
populationLegend.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML +=
  '<h2><strong><center>Drop in SNAP beneficiaries and<br>undocumented population</center></strong></h2>';
return div;
};
populationLegend.addTo(myMap);

// Add legend 
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend'),
  migpop = [0, 1, 1.5, 2, 2.5, 3, 4, 5],
  labels = [];
  for (var i = 0; i < migpop.length; i++) {
  migpop[i] = migpop[i].toFixed(1); 
  
};

div.innerHTML +=  '<strong>Undocumented<br>population<br>per state (%)</strong><hr>' 
for (var i = 0; i < migpop.length; i++) {
  div.innerHTML += 
  '<i style="background-color:' + getColorMigr(migpop[i]) + ';">&nbsp&nbsp&nbsp;</i> ' +
    migpop[i] + (migpop[i + 1] ? ' - ' + (migpop[i + 1] -.1) + '<br>' : '+<br><br>Choropleth map');
}

return div;
};
legend.addTo(myMap);

}, 1000);