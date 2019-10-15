
// Create a function to change the color based on enrollment change
var change = ""
function getColor(change) {
    return change < -3.5  ? '#4B000F' :
    change < -3  ? '#fb350d' :       
    change < -2  ? '#fc5f3f' :
    change < -1  ? '#FD8D3C':
    change < -0.5  ? '#FEB24C' :
    change < 0    ?  '#FED976':	 
    change >= 0   ? '#cff7cf' :
     'white';                     
}; 

// Create an array that holds data for change in state quarterly enrollment
var json = "data/clean/Medicaid_state_clean.json";
var geojson = "data/geojson/gz_2010_us_040_00_5m.json";

var array_0618 = [];
var array_0918 = [];
var array_1218 = [];
var array_0319 = [];
var array_0519 = [];

d3.json(json, function(data) {
var changes=data;  
for (var i = 0; i < changes.length; i++) {
    if (changes[i].semester=="0618"){ 
  array_0618.push({
    "state_name": changes[i].state_name,
    "color": getColor(changes[i].med_chan),
    "change": Number(changes[i].med_chan).toFixed(1)
      });
    }
  else if (changes[i].semester=="0918"){ 
    array_0918.push({
      "state_name": changes[i].state_name,
      "color": getColor(changes[i].med_chan),
      "change": Number(changes[i].med_chan).toFixed(1)  
       });
    }
    else if (changes[i].semester=="1218"){ 
      array_1218.push({
        "state_name": changes[i].state_name,
        "color": getColor(changes[i].med_chan),
        "change": Number(changes[i].med_chan).toFixed(1)  
         });
      }
      else if (changes[i].semester=="0319"){ 
        array_0319.push({
          "state_name": changes[i].state_name,
          "color": getColor(changes[i].med_chan),
          "change": Number(changes[i].med_chan).toFixed(1)  
           });
        }
        else if (changes[i].semester=="0519"){ 
          array_0519.push({
            "state_name": changes[i].state_name,
            "color": getColor(changes[i].med_chan),
            "change": Number(changes[i].med_chan).toFixed(1)  
             });
          }
// console.log(array_0618, array_0918);
}});

var layer_0518  = [];
var layer_0918  = [];
var layer_1218  = [];
var layer_0119  = [];
var layer_0319  = [];
var layer_0519  = [];


d3.json(geojson, function(data) {
  var geodata=data.features;
        // Loop within the array
  for (var i = 0; i < array_0918.length; i++) {
    // Loop within each element of the array
   for (var j = 0; j < geodata.length; j++) {
     if (array_0918[i].state_name == geodata[j].properties.NAME){
       layer_0918.push(L.geoJson(geodata[j], {
         style: function(feature) {
           return {
             color: array_0918[i].color,
               fillColor: array_0918[i].color,
               opacity:0.70,
               fillOpacity: 0.70,
               weight: 1            
               };
             } 
             }).bindPopup("<h3>" + array_0918[i].state_name 
             + "</h3> <hr> <h4>Change in Medicaid: " +array_0918[i].change 
             + "%</h4>")
             );
             };
           };
         };
        // Loop within the array
  for (var i = 0; i < array_1218.length; i++) {
    // Loop within each element of the array
   for (var j = 0; j < geodata.length; j++) {
     if (array_1218[i].state_name == geodata[j].properties.NAME){
       layer_1218.push(L.geoJson(geodata[j], {
         style: function(feature) {
           return {
             color: array_1218[i].color,
               fillColor: array_1218[i].color,
               opacity:0.70,
               fillOpacity: 0.70,
               weight: 1       
               };
             } 
             }).bindPopup("<h3>" + array_1218[i].state_name 
             + "</h3> <hr> <h4>Change in Medicaid: " +array_1218[i].change 
             + "%</h4>")
             );
             };
           };
         };
        // Loop within the array
  for (var i = 0; i < array_0319.length; i++) {
    // Loop within each element of the array
   for (var j = 0; j < geodata.length; j++) {
     if (array_0319[i].state_name == geodata[j].properties.NAME){
       layer_0319.push(L.geoJson(geodata[j], {
         style: function(feature) {
           return {
             color: array_0319[i].color,
               fillColor: array_0319[i].color,
               opacity:0.70,
               fillOpacity: 0.70,
               weight: 1         
               };
             } 
             }).bindPopup("<h3>" + array_0319[i].state_name 
             + "</h3> <hr> <h4>Change in Medicaid: " +array_0319[i].change 
             + "%</h4>")
             );
             };
           };
         };
        // Loop within the array
  for (var i = 0; i < array_0519.length; i++) {
    // Loop within each element of the array
   for (var j = 0; j < geodata.length; j++) {
     if (array_0519[i].state_name == geodata[j].properties.NAME){
       layer_0519.push(L.geoJson(geodata[j], {
         style: function(feature) {
           return {
             color: array_0519[i].color,
               fillColor: array_0519[i].color,
               opacity:0.70,
               fillOpacity: 0.70,
               weight: 1          
               };
             } 
             }).bindPopup("<h3>" + array_0519[i].state_name 
             + "</h3> <hr> <h4>Change in Medicaid: " +array_0519[i].change 
             + "%</h4>")
             );
             };
           };
         };
    });



setTimeout(function(){

var Medicaid_0918 = L.layerGroup(layer_0918);
var Medicaid_1218 = L.layerGroup(layer_1218);
var Medicaid_0319 = L.layerGroup(layer_0319);
var Medicaid_0519 = L.layerGroup(layer_0519);
  
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
  "Q3 2018": Medicaid_0918,
  "Q4 2018": Medicaid_1218,
  "Q1 2019": Medicaid_0319
  // "Q2 2019": Medicaid_0519,
};

var myMap = L.map("map", {
  center:[39, -95],
  zoom:4,
  layers: [streetmap, Medicaid_0918]
});


// L.control.layers(baseMaps, overlayMaps, {
//   collapsed: true
// }).addTo(myMap);

// L.control.layers(baseMaps).addTo(myMap);
L.control.layers(overlayMaps, '', {
    collapsed: false
  }).addTo(myMap);


// // Add title
var populationLegend = L.control({position: 'bottomleft'});
populationLegend.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML +=
  '<h3><strong><center>Change in Medicaid beneficiaries</center></strong></h3>';
return div;
};
populationLegend.addTo(myMap);

// // Add legend 
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
var div = L.DomUtil.create('div', 'info legend'),
  Medicaid = [-4, -3.5, -3 , -2, -1, -0.5,  0],
  labels = [];
  for (var i = 0; i < Medicaid.length; i++) {
  Medicaid[i] = Medicaid[i].toFixed(1); 
  
};

  div.innerHTML +=  '<strong>Quarterly change<br>by state (%)</strong><hr>' 
  for (var i = 0; i < Medicaid.length; i++) {
    div.innerHTML += 
    '<i style="background-color:' + getColor(Medicaid[i]) + ';">&nbsp&nbsp&nbsp;</i> ' +
      Medicaid[i] + (Medicaid[i + 1] ? '&nbsp&nbsp-&nbsp&nbsp' + (Medicaid[i + 1] -.1) + '<br>' : '+<br><br>');
    }

  return div;
  };
  legend.addTo(myMap);
}, 1500);