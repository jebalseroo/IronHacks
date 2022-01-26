const GOOGLE_KEY = "AIzaSyDw-mlKd5KwCG8cflcvVpDhooXk8rRK-_c";
const INFO_URL_DISTRICTS = " https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=";
const INFO_EX_DISTRICTS = "*&outSR=4326&f=geojson";
const INFO_URL_NAMES = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const INFO_URL_HOUSING = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
const CRIMENES = "https://data.cityofnewyork.us/resource/9s4h-37hy.json";
const Museums = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";
const Galery = "https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD";
var map;
var Clear = 0;
var nyu = {lat:40.7291, lng:-73.9965}
var lt = 40.7291;
var ln = -73.9965;
var directionsRenderer, data , data1, data2, data3, data4,data5, dataRow, polygon, firstCoord, next,coord;
var datos = [], localidades = [], tableRows =[] ,BoroDc =[], NamesDraw = [], HousingDraw = [], Housing = [], Crime = [];
var principalDistric =[Bronx =[] , Brooklyn = [] , Manhattan=[], Queens=[], StatenIsland = []];
var principalcrimen =[Bronx =[] , Brooklyn = [] , Manhattan=[], Queens=[], StatenIsland = []];
var Distric_housing =[ Manhattan =[] , Bronx= [] , Brooklyn =[], Queens=[], StatenIsland = []];
var State_Distric = [ Manhattan =[] , Bronx= [] , Brooklyn =[], Queens=[], StatenIsland = []];
var Best = [ Manhattan =[] , Bronx= [] , Brooklyn =[], Queens=[], StatenIsland = []];
var Best_low = [];
var Best_Distance = [];
var Top = [],
    Top3 = [],
    Top1 = [],
    Top2 = [];
var Museos = [],
    Galerys = [];
var mark = [];
var States = ["Manhattan", "Bronx", "Brooklyn", "Queens", "StatenIsland" ];
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: nyu
  });
  var marker = new google.maps.Marker({
    position: nyu,
    map: map,
    title: 'NYU'
  });
  updateDataDistricts();
  updateDataNeighbor();
  updateDatahousing();
  getDataCrime();
  setTimeout(function(){
  Best_Top()},2000);
  getdataMuseums();
  setTimeout(function(){setDistance()},4000);
}
//updates ----------------------------------------------------------------------
function updateDatahousing(){
  var URL_HOUSING = INFO_URL_HOUSING;
  getdataHousing(URL_HOUSING);
}
function updateDataDistricts(){
  var URL_DISTRICTS = INFO_URL_DISTRICTS + INFO_EX_DISTRICTS;
  getdataDistricts(URL_DISTRICTS);
}
function updateDataNeighbor(){
  var URL_NAMES = INFO_URL_NAMES;
  getDataNeighbor(URL_NAMES);
}
//gets -------------------------------------------------------------------------
function getdataDistricts(URL_DISTRICTS){
  data2 = $.get(URL_DISTRICTS , function(){
    var j, lat , long, count;
    count = 0;
    dataRow = data2.responseText;
    dataRow = dataRow.split("],[");
    for (var i = 0; i < dataRow.length-1; i++) {
      polygon = [];
      firstCoord = dataRow[i].indexOf("[[[");
      coord = dataRow[i].slice(firstCoord+1,dataRow[i].length);
      coord = coord.split(",");
      if (coord[0].indexOf("[") != -1){
        coord[0] = coord[0].slice(coord[0].indexOf("[")+2);
      }
      if (coord[1].indexOf("]") != -1){
        coord[1] = coord[1].slice(0,coord[1].indexOf("]"));
      }
      la = parseFloat(coord[0]);
      lon = parseFloat(coord[1]);
      polygon.push({lat:lon,lng:la})
      if (i == 0 ){j = 1;}
      else{j = i+1}
      for(;dataRow[j].length < 50; j++){
        coord = dataRow[j].split(",");
        if (coord[0].indexOf("[") != -1){
          coord[0] = coord[0].slice(coord[0].indexOf("["));
        }
        if (coord[1].indexOf("]") != -1){
          coord[1] = coord[1].slice(0,coord[1].indexOf("]"));
        }
        la = parseFloat(coord[0]);
        lon = parseFloat(coord[1]);
        polygon.push({lat:lon,lng:la})
      }
      next = dataRow[j].indexOf("]]]");
      coord = dataRow[j].slice(0,next);
      coord = coord.split(",");
      var ind = dataRow[j].indexOf("BoroCD");
      var ind2 = dataRow[j].indexOf("BoroCD");
      ind = dataRow[j].slice(ind+8,ind+9);
      ind2 = dataRow[j].slice(ind2+9,ind2+11);
      BoroDc.push([ind, ind2]);
      if (coord[0].indexOf("[") != -1){
        coord[0] = coord[0].slice(coord[0].indexOf("["));
      }
      if (coord[1].indexOf("]") != -1){
        coord[1] = coord[1].slice(0,coord[1].indexOf("]"));
      }
      la = parseFloat(coord[0]);
      lon =  parseFloat(coord[1]);
      polygon.push({lat:lon,lng:la})
      localidades.push([polygon , BoroDc[count]]);
      for (var i = 0; i < localidades.length; i++) {
        if (localidades[i][1][0] === "1") {
          if (parseInt(localidades[i][1][1]) < 20){
            State_Distric[0][parseInt(localidades[i][1][1])] = localidades[i];
          }
        }else if (localidades[i][1][0] === "2") {
          if (parseInt(localidades[i][1][1]) < 20){
            State_Distric[1][parseInt(localidades[i][1][1])] = localidades[i];
          }
        }else if (localidades[i][1][0] === "3") {
          if (parseInt(localidades[i][1][1]) < 20){
            State_Distric[2][parseInt(localidades[i][1][1])] = localidades[i];
          }
        }else if (localidades[i][1][0] === "4") {
          if (parseInt(localidades[i][1][1]) < 20){
            State_Distric[3][parseInt(localidades[i][1][1])] = localidades[i];
          }
        }else if (localidades[i][1][0] === "5") {
          if (parseInt(localidades[i][1][1]) < 20){
            State_Distric[4][parseInt(localidades[i][1][1])] = localidades[i];
          }
        }else {
          console.log("error");
        }
      }
      count++;
      i = j+1;
    }
  })
}
function getdataMuseums(){
  data4 = $.get(Museums,function(){
    for (var i = 0; i < data4.responseJSON.data.length; i++) {
      Museos.push([data4.responseJSON.data[i][8],data4.responseJSON.data[i][9]])
    }
    var ini = 0;
    var end = 0;
    for (var i = 0; i < Museos.length; i++) {
       ini = Museos[i][0].indexOf("(");
       end = Museos[i][0].indexOf(")");
       Museos[i][0] = Museos[i][0].slice(ini+1, end);
       Museos[i][0] = Museos[i][0].split(" ");
    }
    getDataGalery();
  })

}
function getDataGalery(){
  data5 = $.get(Galery,function(){
    for (var i = 0; i < data5.responseJSON.data.length; i++) {
      Galerys.push([data5.responseJSON.data[i][8],data5.responseJSON.data[i][9]])
    }
    var ini = 0;
    var end = 0;
    for (var i = 0; i < Galerys.length; i++) {
       ini = Galerys[i][1].indexOf("(");
       end = Galerys[i][1].indexOf(")");
       Galerys[i][1] = Galerys[i][1].slice(ini+1, end);
       Galerys[i][1] = Galerys[i][1].split(" ");
    }

  })

}
//LOCALIDADES GUARDA LOS POLIGONOS
function getDataNeighbor(URL_NAMES){
  data1 = $.get(URL_NAMES, function(){
    var star, end, latlong;
    for (i = 0; i < data1.responseJSON.data.length; i++) {
      tableRows.push([data1.responseJSON.data[i][10], data1.responseJSON.data[i][16], data1.responseJSON.data[i][9], i]);
      star =  tableRows[i][2].indexOf("(");
      end =  tableRows[i][2].indexOf(")");
      tableRows[i][2] = tableRows[i][2].slice(star+1,end);
      tableRows[i][2] = tableRows[i][2].split(" ");
    }
    for ( i = 0; i < tableRows.length; i++) {
      NamesDraw.push(tableRows[i][2][0] , tableRows[i][2][1], tableRows[i][0]);
    }
    Neighbor_for_states();
  })
}
function getdataHousing(URL_HOUSING){
  data3 = $.get(URL_HOUSING, function(){
    for (var i = 0; i < data3.responseJSON.data.length; i++) {
      Housing.push([data3.responseJSON.data[i][31],data3.responseJSON.data[i][23],
        data3.responseJSON.data[i][24],data3.responseJSON.data[i][9],data3.responseJSON.data[i][13],
        data3.responseJSON.data[i][14],data3.responseJSON.data[i][15], data3.responseJSON.data[i][28],
        data3.responseJSON.data[i][45],data3.responseJSON.data[i][46],data3.responseJSON.data[i][19] ,
        data3.responseJSON.data[i][20]]);
    }
    for (var i = 0; i < Housing.length; i++) {
      HousingDraw.push(Housing[i][7],Housing[i][6],Housing[i][8]);
      Housing[i][10] = Housing[i][10].split("-")
    }
    var Count1 =0, Count2=0, Count3=0,Count4=0,Count5=0;
    for (var i = 0; i < Housing.length; i++) {
      if (Housing[i][10][0] === "BX") {
        Distric_housing[1][Count1] = Housing[i];
        Count1++;
      }else if (Housing[i][10][0] === "BK") {
        Distric_housing[2][Count2] = Housing[i];
        Count2++;
      }else if (Housing[i][10][0] === "MN") {
        Distric_housing[0][Count3] = Housing[i];
        Count3++;
      }else if (Housing[i][10][0] === "QN") {
        Distric_housing[3][Count4] = Housing[i];
        Count4++;
      }else if (Housing[i][10][0] === "SI") {
        Distric_housing[4][Count5] = Housing[i];
        Count5++;
      }else {
        console.error(error);
      }
    }
  })
}
function getDataCrime() {
  $.ajax({
    url:CRIMENES,
    type:"GET",
    data:{
      cmplnt_to_dt:"2015-12-31T00:00:00.000"
    }
  })
  .done(function (data) {
    for (var i = 0; i < data.length; i++) {
      Crime.push([data[i].ky_cd , data[i].boro_nm , data[i].lat_lon, data[i].ofns_desc, data[i].pd_cd  ]);
    }
    Crimen_for_states();
  })
}
function setDistance() {
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;
  for (var i = 0; i < State_Distric.length; i++) {
    for (var j = 1; j < State_Distric[i].length; j++) {
      if (State_Distric[i][j]){
        var ini = State_Distric[i][j][0][10];
        getDistance(ini , i , j);
      }
    }
  }
  setTimeout(function(){
    for (var i = 0; i < Distric_housing.length; i++) {
      for (var j = 0; j < Distric_housing[i].length; j++) {
        if (parseInt(parseInt(Distric_housing[i][j][10][1])) < Best[i].length){
           State_Distric[i][parseInt(Distric_housing[i][j][10][1])].push(Distric_housing[i][j]);
        }else {
        console.log("error");
        }
      }
    }
  },50000);
  setTimeout(function(){
    Best_Distance.sort(function(a, b){
          var x = b[1];
          var y = a[1];
          if (x > y) {return -1;}
          if (x < y) {return 1;}
          return 0;
      });
  },55000);
}
//draws and random color -------------------------------------------------------
function drawMarkes(lati , long , title){
  var lat;
  la = parseFloat(lati);
  lon = parseFloat(long);
  lat = {lat:lon,lng:la};
  markers = new google.maps.Marker({
  position: lat,
  map: map,
  title: title
  });
  mark.push(markers);
}
function drawMarkes1(lati , long , title, icon){
  var lat;
  la = parseFloat(lati);
  lon = parseFloat(long);
  lat = {lat:lon,lng:la};
  markers = new google.maps.Marker({
  position: lat,
  map: map,
  icon: icon,
  title: title
  });
  mark.push(markers);
}
function drawPolygon(polygon,color){
  var parking = new google.maps.Polygon({
   paths: polygon,
   strokeColor: "#000000",
   strokeOpacity: 1,
   strokeWeight: 2,
   fillColor: color,
   fillOpacity: 0.5
 });
 parking.setMap(map);
}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
//------------------------------------------------------------------------------
function Neighbor_for_states(){
  var Count1 =0, Count2=0, Count3=0,Count4=0,Count5=0;
  for (var i = 0; i < tableRows.length; i++) {
    if (tableRows[i][1] === "Bronx") {
      principalDistric[0][Count1] = tableRows[i];
      Count1++;
    }else if (tableRows[i][1] === "Brooklyn") {
      principalDistric[1][Count2] = tableRows[i];
      Count2++;
    }else if (tableRows[i][1] === "Manhattan") {
      principalDistric[2][Count3] = tableRows[i];
      Count3++;
    }else if (tableRows[i][1] === "Queens") {
      principalDistric[3][Count4] = tableRows[i];
      Count4++;
    }else if (tableRows[i][1] === "Staten Island") {
      principalDistric[4][Count5] = tableRows[i];
      Count5++;
    }else {
      console.error(error);
    }
  }
}
function getDistance(lat, i , j ){
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsService.route({
    origin: lat ,
    destination: nyu,
    travelMode: google.maps.TravelMode.DRIVING
  }, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response)
      var a = response.routes[0].legs[0].distance.value;
      Best_Distance.push([State_Distric[i][j] , a]);
      } else {
        if(status == "OVER_QUERY_LIMIT"){
          setTimeout(function(){getDistance(lat, i , j)},1500);
        }
      }
  });
}
function Crimen_for_states(){
  var Count1 =0, Count2=0, Count3=0,Count4=0,Count5=0;
  for (var i = 0; i < Crime.length; i++) {
    if (Crime[i][1] === "BRONX") {
      principalcrimen[0][Count1] = Crime[i];
      Count1++;
    }else if (Crime[i][1] === "BROOKLYN") {
      principalcrimen[1][Count2] = Crime[i];
      Count2++;
    }else if (Crime[i][1] === "MANHATTAN") {
      principalcrimen[2][Count3] = Crime[i];
      Count3++;
    }else if (Crime[i][1] === "QUEENS") {
      principalcrimen[3][Count4] = Crime[i];
      Count4++;
    }else if (Crime[i][1] === "STATEN ISLAND") {
      principalcrimen[4][Count5] = Crime[i];
      Count5++;
    }else {
    }
  }
}
function Best_Top(){
  for (var i = 0; i < State_Distric.length; i++) {
    for (var j = 0; j < State_Distric[i].length; j++) {
      Best[i][j] = [State_Distric[i][j] , 0] ;
    }
  }
  setTimeout(function(){
  for (var i = 0; i < Distric_housing.length; i++) {
    for (var j = 0; j < Distric_housing[i].length; j++) {
      if (parseInt(parseInt(Distric_housing[i][j][10][1])) < Best[i].length){
        Best[i][parseInt(Distric_housing[i][j][10][1])][1] = parseInt(Distric_housing[i][j][0]) + parseInt(Best[i][parseInt(Distric_housing[i][j][10][1])][1]);
        Best[i][parseInt(Distric_housing[i][j][10][1])].push(Distric_housing[i][j]);
      }else {
        console.log("error");
      }
    }
  }
},7000);
}
function Best_top_low(){
  for (var i = 0; i < Best.length; i++) {
    for (var j = 0; j < Best[i].length;j++) {
      if (Best[i][j][0] === undefined){
      }else {
        Best_low.push(Best[i][j]);
      }
    }
  }
  Best_low.sort(function(a, b){
        var x = b[1];
        var y = a[1];
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });
    var color = getRandomColor();
  for (var i = 0; i < 10; i++) {
    drawPolygon(Best_low[i][0][0], color);
  }
  var tableReference = $("#tBody")[0];
  for (var i = 0; i < 10; i++) {
    newRow = tableReference.insertRow(tableReference.rows.length);
    Num_borough = newRow.insertCell();
    Name_state = newRow.insertCell();
    Num_Low = newRow.insertCell();
    Num_borough.innerHTML = parseInt(Best_low[i][0][1][1]);
    if (parseInt(Best_low[i][0][1][0]) == 1){
      Name_state.innerHTML = States[0];
    }else if (parseInt(Best_low[i][0][1][0]) == 2) {
      Name_state.innerHTML = States[1];
    }else if (parseInt(Best_low[i][0][1][0]) == 3) {
      Name_state.innerHTML = States[2];
    }else if (parseInt(Best_low[i][0][1][0]) == 4) {
      Name_state.innerHTML = States[3];
    }else if (parseInt(Best_low[i][0][1][0]) == 5) {
      Name_state.innerHTML = States[4];
    }
    Num_Low.innerHTML = parseInt(Best_low[i][1]);
    for (var j = 2; j < Best_low[i].length; j++) {
      drawMarkes(Best_low[i][j][2],Best_low[i][j][1], Best_low[i][j][3])
    }
    var markerCluster = new MarkerClusterer(map, mark,
              {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
 }
}
function downloadT(){
  $("table").tableToCSV();
}
function DrawsMuseums() {
  for (var i = 0; i <Museos.length; i++) {
    drawMarkes1(Museos[i][0][0],Museos[i][0][1],Museos[i][1],"http://i68.tinypic.com/6t1av5.png");
  }
  for (var i = 0; i < Galerys.length; i++) {
     drawMarkes1(Galerys[i][1][0],Galerys[i][1][1],Galerys[i][0],"http://i65.tinypic.com/2unty10.png");
  }
  var markerCluster = new MarkerClusterer(map, mark,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}
function Draws_distance(){
  var color = getRandomColor();
  for (var i = 0; i < 10; i++) {
    drawPolygon(Best_Distance[i][0][0], color);
  }
  var tableReference = $("#tBody2")[0];
  for (var i = 0; i < 10; i++) {
    newRow = tableReference.insertRow(tableReference.rows.length);
    Num_borough = newRow.insertCell();
    Name_state = newRow.insertCell();
    Num_Low = newRow.insertCell();
    Num_borough.innerHTML = parseInt(Best_Distance[i][0][1][1]);
    if (parseInt(Best_Distance[i][0][1][0]) == 1){
      Name_state.innerHTML = States[0];
    }else if (parseInt(Best_Distance[i][0][1][0]) == 2) {
      Name_state.innerHTML = States[1];
    }else if (parseInt(Best_Distance[i][0][1][0]) == 3) {
      Name_state.innerHTML = States[2];
    }else if (parseInt(Best_Distance[i][0][1][0]) == 4) {
      Name_state.innerHTML = States[3];
    }else if (parseInt(Best_Distance[i][0][1][0]) == 5) {
      Name_state.innerHTML = States[4];
    }
    Num_Low.innerHTML = parseFloat(Best_Distance[i][1])/1000;
    for (var j = 2; j < Best_Distance[i][0].length; j++) {
      drawMarkes(Best_Distance[i][0][j][2],Best_Distance[i][0][j][1], Best_Distance[i][0][j][3]);
    }
    var markerCluster = new MarkerClusterer(map, mark,
              {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  }
}
function Draws_Top(){
  var color = getRandomColor();
  for (var i = 0; i < 3; i++) {
    drawPolygon(Top[i][1], color);
  }
  var tableReference = $("#tBody4")[0];
  for (var i = 0; i < 3; i++) {
    newRow = tableReference.insertRow(tableReference.rows.length);
    Num_borough = newRow.insertCell();
    Name_state = newRow.insertCell();
    Num_borough.innerHTML = parseInt(Top[i][0][1]);
    if (parseInt(Top[i][0][0]) == 1){
      Name_state.innerHTML = States[0];
    }else if (parseInt(Top[i][0][0]) == 2) {
      Name_state.innerHTML = States[1];
    }else if (parseInt(Top[i][0][0]) == 3) {
      Name_state.innerHTML = States[2];
    }else if (parseInt(Top[i][0][0]) == 4) {
      Name_state.innerHTML = States[3];
    }else if (parseInt(Top[i][0][0]) == 5) {
      Name_state.innerHTML = States[4];
    }

  }
}
function getTop(){
  for (var i = 0; i < Best_low.length; i++) {
    var valor = (parseInt(Best_low[i][1])*100/1353);
    Top1.push([Best_low[i][0][1],Best_low[i][0][0] , valor])
  }
  Top1.sort(function(a, b){
        var x = b[0];
        var y = a[0];
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });
  for (var i = 0; i < Best_Distance.length; i++) {
    var valor = (39000-parseInt(Best_Distance[i][1]));
    valor = valor*100/37818;
    Top2.push([Best_Distance[i][0][1], valor]);
  }
  Top2.sort(function(a, b){
          var x = b[0];
          var y = a[0];
          if (x < y) {return -1;}
          if (x > y) {return 1;}
          return 0;
      });
  for (var i = 0; i < 58; i++) {
    var valor = ((Top1[i][2]+Top2[i][1])/2);
    Top.push([Top1[i][0],Top1[i][1] ,valor]);
    Top3.push([Top1[i][0],valor]);
  }
  Top.sort(function(a, b){
          var x = b[2];
          var y = a[2];
          if (x < y) {return -1;}
          if (x > y) {return 1;}
          return 0;
      });
  table();
  Draws_Top()
}
function table(){
  var n = 2,
      m = Top.length;
  var i = 0;
  var xz = d3.range(m),
      yz = d3.range(n).map(function() {
        i++
         return bumps(m , i-1);}),
      y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz)),
      yMax = d3.max(yz, function(y) { return d3.max(y); }),
      y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });
  var svg = d3.select("svg"),
      margin = {top: 40, right: 10, bottom: 20, left: 10},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var x = d3.scaleBand()
      .domain(xz)
      .rangeRound([0, width])
      .padding(0.08);
  var y = d3.scaleLinear()
      .domain([0, y1Max])
      .range([height, 0]);
  var color = d3.scaleOrdinal()
      .domain(d3.range(n))
      .range(d3.schemeCategory20c);
  var series = g.selectAll(".series")
    .data(y01z)
    .enter().append("g")
      .attr("fill", function(d, i) { return getcolor(i); });
  function getcolor(i){
    if (i == 0){
        return"#6D1DB3";
    }if(i == 1){
      return "#B17AE1"
    }
  }
  var rect = series.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d, i) { return x(i); })
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0);
  rect.transition()
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); });
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
          .tickSize(0)
          .tickPadding(6));
  d3.selectAll("input")
      .on("change", changed);
  var timeout = d3.timeout(function() {
    d3.select("input[value=\"grouped\"]")
        .property("checked", true)
        .dispatch("change");
  }, 2000);
  function changed() {
    timeout.stop();
    if (this.value === "grouped") transitionGrouped();
    else transitionStacked();
  }
  function transitionGrouped() {
    y.domain([0, yMax]);
    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("x", function(d, i) { return x(i) + x.bandwidth() / n * this.parentNode.__data__.key; })
        .attr("width", x.bandwidth() / n)
      .transition()
        .attr("y", function(d) { return y(d[1] - d[0]); })
        .attr("height", function(d) { return y(0) - y(d[1] - d[0]); });
  }
  function transitionStacked() {
    y.domain([0, y1Max]);
    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .transition()
        .attr("x", function(d, i) { return x(i); })
        .attr("width", x.bandwidth());
  }
  function bumps(m,i) {
    var values = [];
    if (i == 0){
      for (var j = 0; j < 58; j++) {
        values.push(Top1[j][2]);
      }
    }if (i == 1) {
      for (var j = 0; j < 58; j++) {
        values.push(Top2[j][1]);
      }
    }
    return values;
  }
}
function animateprogress (id, val){
	var getRequestAnimationFrame = function () {
		return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function ( callback ){
			window.setTimeout(enroute, 1);
		};
	};
	var fpAnimationFrame = getRequestAnimationFrame();
	var i = 0;
	var animacion = function () {
	if (i<=val*30)
		{
			document.querySelector(id).setAttribute("value",i/30);
			i++;
			fpAnimationFrame(animacion);
		}
	}
		fpAnimationFrame(animacion);
}
//function of the BOTONS--------------------------------------------------------
function myFunction() {
  checkBox = document.getElementById("micheckbox");
  if (checkBox.checked == true){

  }
}
function myFunction1() {
  checkBox = document.getElementById("micheckbox2");
  if (checkBox.checked == true){
        Draws_distance();
  }
}
function myFunction2() {
  checkBox = document.getElementById("micheckbox3");
  if (checkBox.checked == true){
    Best_top_low();
  }
}
function myFunction3() {
  checkBox = document.getElementById("micheckbox4");
  if (checkBox.checked == true){
     DrawsMuseums();
  }
}
function myFunction4() {
  checkBox = document.getElementById("micheckbox5");
  if (checkBox.checked == true){
    downloadT();
  }
}
function myFunction5() {
  checkBox = document.getElementById("micheckbox6");
  if (checkBox.checked == true){
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: nyu
    });
    var marker = new google.maps.Marker({
    position: nyu,
    map: map,
    title: 'NYU'
    });
    if (Best_low.length > 2) {
      for (var i = 2; i < 12; i++) {
      document.getElementById("Mytable").deleteRow(2);
      document.getElementById("Mytable1").deleteRow(2);
      }
    }
    if (Top.length > 2) {
      for (var i = 2; i < 5; i++) {
      document.getElementById("Mytable3").deleteRow(2);
      }
    }
  }
}
function myFunction6() {
  checkBox = document.getElementById("micheckbox7");
  if (checkBox.checked == true){
    getTop();
  }
}
