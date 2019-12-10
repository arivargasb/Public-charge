var json_co= "SNAP_county_clean.json";

var array_x = [];
var array_y = [];
var names = [];

var array_countynames= []

d3.json(json_co, function(data) {
  var changes=data;

  for(var i = 0 ; i < changes.length; i++) {
    // console.log(changes[i])
    if (changes[i].semester=="0119" 
    && changes[i].snap_biannual_chan!=null
    && changes[i].pop_un_co_per!=""){
    array_countynames.push(changes[i].county_name + ", " + changes[i].state_name)
    };
  };

  for (var i = 0; i < changes.length; i++) {
    if (changes[i].semester=="0119" 
    && changes[i].pop_un_co_per!=""){
      array_x.push(Number(changes[i].pop_un_co_per).toFixed(2));
      array_y.push(Number(changes[i].snap_biannual_chan).toFixed(1) );
      (names.push(changes[i].state_name));
  };
  
  };
});

setTimeout(function(){
  
  var array_scatter = {
    x: array_x,
    y: array_y,
    mode: "markers",
    type: "scatter",
    name: "Change in SNAP(%)",
    text: array_countynames,
    marker: {
      color: "#0073e6",
      symbol: "cross"
    }
    
  };

  var array_line = {
    x: [0.73, 3, 6, 9, 12],
    y: [-1.8, -2.52, -3.24, -3.96, -4.68 ],
    mode: "lines",
    type: "line",
    name: "Fitted values",
    marker: {
      color: "#ff6200",
      
    }  
  };
  
  // // Create the data array for the plot
  data = [  array_scatter, array_line];
  
  // // Define the plot layout
  var layout = {
    title: "Change in number of SNAP Beneficiaries per County: Jul18-Jan19",
    xaxis: { title: "Undocumented population (%)" },
    yaxis: { title: "Change in beneficiaries (%)" },

  };
  
  // // Plot the chart to a div tag with id "plot"
  Plotly.newPlot("plot", data, layout);

}, 2000);

// #####################################
// Correlation matrix
// #####################################

// var json_mat= "SNAP_county_clean.json";



// var z=[[],[], [], []];
// var x = ['0 to 1.9','2 to 3.9','4 to 5.9','6 to 13'];
// var y = ['-16 to -5.1', '-5 to -3.1', '-3 to 0', '0 to 6'];

// var count_z_0 = 0;
// var count_z_1 = 0;
// var count_z_2 = 0;
// var count_z_3 = 0;

// d3.json(json_mat, function(data) {
//   var changes=data;
// // Undocumented array 1 : 0 - 2.9
//   for (var i = 0; i < changes.length; i++) {
//     if (changes[i].semester=="0119" ){
//       if (changes[i].pop_un_co_per>="0" && changes[i].pop_un_co_per<"2"){ 
//         if (Number(changes[i].snap_biannual_chan)>=-16 && Number(changes[i].snap_biannual_chan)<-5 ){
//           count_z_0 ++;
//         }
//         else if (Number(changes[i].snap_biannual_chan)>=-5 && Number(changes[i].snap_biannual_chan)<-3 ){
//           count_z_1 ++;
//         }
//         else if (Number(changes[i].snap_biannual_chan)>=-3 && Number(changes[i].snap_biannual_chan)<0 ){
//           count_z_2 ++;
//         }
//         else if (Number(changes[i].snap_biannual_chan)>=0 && Number(changes[i].snap_biannual_chan)<=6 ){
//           count_z_3 ++;
//         }           
//       };
//     };
//   };
//   z[0].push(count_z_0);
//   z[1].push(count_z_1);
//   z[2].push(count_z_2);
//   z[3].push(count_z_3);
// count_z_0 = 0;
// count_z_1 = 0;
// count_z_2 = 0;
// count_z_3 = 0;

// // Undocumented array 2 : 3 - 5.9
//   for (var i = 0; i < changes.length; i++) {
//     if (changes[i].semester=="0119" ){
//       if (changes[i].pop_un_co_per>="2" && changes[i].pop_un_co_per<"4"){ 
//         if (Number(changes[i].snap_biannual_chan)>=-16 && Number(changes[i].snap_biannual_chan)<-5 ){
//           count_z_0 ++;
//         }
//         else if (Number(changes[i].snap_biannual_chan)>=-5 && Number(changes[i].snap_biannual_chan)<-3 ){
//           count_z_1 ++;
//         }
//         else if (Number(changes[i].snap_biannual_chan)>=-3 && Number(changes[i].snap_biannual_chan)<0 ){
//           count_z_2 ++;
//         }
//         else if (Number(changes[i].snap_biannual_chan)>=0 && Number(changes[i].snap_biannual_chan)<=6 ){
//           count_z_3 ++;
//         }           
//       };
//     };
//   };

// z[0].push(count_z_0);
// z[1].push(count_z_1);
// z[2].push(count_z_2);
// z[3].push(count_z_3);
// count_z_0 = 0;
// count_z_1 = 0;
// count_z_2 = 0;
// count_z_3 = 0;

// // Undocumented array 3 : 6 - 8.9
// for (var i = 0; i < changes.length; i++) {
//   if (changes[i].semester=="0119" ){
//     if (changes[i].pop_un_co_per>="4" && changes[i].pop_un_co_per<"6"){ 
//       if (Number(changes[i].snap_biannual_chan)>=-16 && Number(changes[i].snap_biannual_chan)<-5 ){
//         count_z_0 ++;
//       }
//       else if (Number(changes[i].snap_biannual_chan)>=-5 && Number(changes[i].snap_biannual_chan)<-3 ){
//         count_z_1 ++;
//       }
//       else if (Number(changes[i].snap_biannual_chan)>=-3 && Number(changes[i].snap_biannual_chan)<0 ){
//         count_z_2 ++;
//       }
//       else if (Number(changes[i].snap_biannual_chan)>=0 && Number(changes[i].snap_biannual_chan)<=6 ){
//         count_z_3 ++;
//       }           
//     };
//   };
// };

// z[0].push(count_z_0);
// z[1].push(count_z_1);
// z[2].push(count_z_2);
// z[3].push(count_z_3);
// count_z_0 = 0;
// count_z_1 = 0;
// count_z_2 = 0;
// count_z_3 = 0;

// // Undocumented array 4 : 9 - 13
// for (var i = 0; i < changes.length; i++) {
//   if (changes[i].semester=="0119" ){
//     if (changes[i].pop_un_co_per>="6" && changes[i].pop_un_co_per<="13"){ 
//       if (Number(changes[i].snap_biannual_chan)>=-16 && Number(changes[i].snap_biannual_chan)<-5 ){
//         count_z_0 ++;
//       }
//       else if (Number(changes[i].snap_biannual_chan)>=-5 && Number(changes[i].snap_biannual_chan)<-3 ){
//         count_z_1 ++;
//       }
//       else if (Number(changes[i].snap_biannual_chan)>=-3 && Number(changes[i].snap_biannual_chan)<0 ){
//         count_z_2 ++;
//       }
//       else if (Number(changes[i].snap_biannual_chan)>=0 && Number(changes[i].snap_biannual_chan)<=6 ){
//         count_z_3 ++;
//       }           
//     };
//   };
// };

// z[0].push(count_z_0);
// z[1].push(count_z_1);
// z[2].push(count_z_2);
// z[3].push(count_z_3);
// console.log(x, y, z)

// });



// setTimeout(function(){
//   var data = [
//     {
//       z: z ,
//       x: x,
//       y: y ,
//       colorscale: [
//         ['0.0', 'rgb(241,244,236)'],
//         ['0.111111111111', 'rgb(252,255,200)'],
//         ['0.222222222222', 'rgb(255,235,102)'],
//         ['0.333333333333', 'rgb(255,202,73)'],
//         ['0.444444444444', 'rgb	(255,150,0)'],
//         ['0.555555555556', 'rgb(255,90,0)'],
//         ['0.666666666667','rgb(255,77,0)'],
//         ['0.777777777778', 'rgb(208,0,49)'],
//         ['0.888888888889', 'rgb(171,10,10)'],
//         ['1.0', 'rgb(154,4,4)']
//       ],
//       colorbar:{
//         len: 1,
//         title: 'Number of counties within each square',
//         titleside:'right',
//         tickvals:[0,5,10, 15],
//       },
//       type: 'heatmap'
//     }
//   ];
//   var layout = {
//     title: "Change in number of SNAP Beneficiaries per County: Jul18-Jan19",
//     xaxis: { title: "Undocumented population (%)", 
//     legend: {"orientation": "h"} },
//     yaxis: { title: "Change in number of beneficiaries (%)" }
//   };

//   Plotly.newPlot('myDiv', data,  layout);
// }, 2000);













