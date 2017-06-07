/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Made by Yann Morin Charbonneau - Github : @yannmc
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
var amount = prompt("Enter the amount of files to process");
//Asks for the amount of files to process
if (amount !== null) {
  filesAmount = amount;
}

//Creation of an array as long as the amount of files, to allow for a Jquery 'each loop'
var totalFiles = [];
for(var i = 0; i < filesAmount; i++){
  totalFiles[i] = i + 1;
}

var mapArray = []; //Origin Map
var mapDijkstra = []; //f(x)
var mapManhattan = []; //g(x)
var mapWeight = []; //Weight of each case (f(x) + α(g(x))) where 'α' is dependent on the exercise

var startPosition = []; //Array containing all starting positions
var endPosition = []; //Array containing all ending positions
var numberSteps = []; //Array containing the number of steps taken to find the end point
var winningPath = []; //Array containing the shortest path to go from start to finish
var followMe = []; //Array containing the coordinates of all cases to follow to win

//Fetching of all files and storing them into an array (mapArray)
$( window ).on( "load", function() {
  createHTML();
  $.each(totalFiles, function(index, value) {
    var split2 = [];
    var splitFile = ($.ajax({
      url: "Exercise" + value + ".txt",
      async: false
    }).responseText).split("\n");
    splitFile = splitFile.slice(0, splitFile.length - 1);
    $.each(splitFile, function(index) {
      split2[index] = splitFile[index].split("");
    });
    mapArray[index] = split2;
  });
  locateStartEndPosition();
  generateManhattanGrid();
  generateFx();
  generateαGx();
  moveAround();
  trackBack();
  fillAllGrid();
});

//Function that locates the START and END positions
function locateStartEndPosition(){
  for(var i = 0; i < filesAmount; i++){ //Move through all exercises
    for(var j = 0; j < mapArray[i].length; j++){ //Move through all rows
      for(var k = 0; k < mapArray[i][j].length ; k++){ //Move through all cases
        if(mapArray[i][j][k] == 2){
          startPosition[i] = [k, j];
        } else if(mapArray[i][j][k] == 3){
          endPosition[i] = [k, j];
        }
      }
    }
  }
}

//Function generates the Manhattan grid
function generateManhattanGrid(){
  for(var i = 0; i < filesAmount; i++){ //Move through all exercises
    var row = [];
    for(var j = 0; j < mapArray[i].length; j++){ //Move through all rows
      var cases = [];
      for(var k = 0; k < mapArray[i][j].length; k++){ //Move through all cases
        cases[k] = (Math.abs(k - endPosition[i][0]) + Math.abs(j - endPosition[i][1]));
      }
      row[j] = cases;
    }
    mapManhattan[i] = row;
  }
}

//Function to generate the initial f(x) grid
function generateFx(){
  for(var i = 0; i < filesAmount; i++){ //Move through all exercises
    var row = [];
    for(var j = 0; j < mapArray[i].length; j++){ //Move through all rows
      var cases = [];
      for(var k = 0; k < mapArray[i][j].length; k++){ //Move through all cases
        if(k == startPosition[i][0] && j == startPosition[i][1]){
          cases[k] = 0;
        } else {
          cases[k] = "∞";
        }
      }
      row[j] = cases;
    }
    mapDijkstra[i] = row;
  }
}

//Function to generate the initial α(g(x)) grid
function generateαGx(){
  for(var i = 0; i < filesAmount; i++){ //Move through all exercises
    var row = [];
    var α;

    //Setting the value of 'α' depending on the exercise
    if((i + 1) >= 1 && (i + 1) <= 6){
      α = 1; // 1 < exercise < 6
    } else if((i + 1) == 7 || (i + 1) == 8){
      α = 0.5; // exercise = 7 & 8
    } else {
      α = 5; // exercise = 9
    }

    for(var j = 0; j < mapArray[i].length; j++){ //Move through all rows
      var cases = [];
      for(var k = 0; k < mapArray[i][j].length; k++){ //Move through all cases
        if(k == startPosition[i][0] && j == startPosition[i][1]){
          cases[k] = (α * mapManhattan[i][j][k]);
        } else {
          cases[k] = "∞";
        }
      }
      row[j] = cases;
    }
    mapWeight[i] = row;
  }
}

//Function to simulate the movement of the robot
function moveAround(){
  Loop1:
  for(var i = 0; i < filesAmount; i++){ //Move through all exercises
    var α;
    var steps = 1;

    //Setting the value of 'α' depending on the exercise
    if((i + 1) >= 1 && (i + 1) <= 6){
      α = 1; // 1 < exercise < 6
    } else if((i + 1) == 7 || (i + 1) == 8){
      α = 0.5; // exercise = 7 & 8
    } else {
      α = 5; // exercise = 9
    }
    //for(var a = 0; a < 9; a++){
    while (mapWeight[i][endPosition[i][1]][endPosition[i][0]] == "∞"){
      steps++;
      var min = "∞"; //[Coord X, Coord Y, Value]
      var NoNum = true;

      for(var j = 0; j < mapWeight[i].length; j++){
        for(var k = 0; k < mapWeight[i][j].length; k++){
          if(NoNum){
          NoNum = isNaN(mapWeight[i][j][k]);
        }
          if(mapWeight[i][j][k] != "∞" && mapWeight[i][j][k] != "X"){
            if(min == "∞"){
              min = [k, j, mapWeight[i][j][k]];
            } else if(mapWeight[i][j][k] < min[2]){
              min = [k, j, mapWeight[i][j][k]];
            }
          }
        }
      }
      if(NoNum){
        numberSteps[i] = "IMPOSSIBLE";
        continue Loop1;
      }

      //check around for X coordinates
      if(min[0] === 0){ //on the first column
        if(mapArray[i][min[1]][min[0] + 1] == 1){
        } else {
          if(mapWeight[i][min[1]][min[0] + 1] == "X"){

          } else {
            if(mapDijkstra[i][min[1]][min[0] + 1] == "∞"){
              mapDijkstra[i][min[1]][min[0] + 1] = (mapDijkstra[i][min[1]][min[0]]) + 1;
              mapWeight[i][min[1]][min[0] + 1] = (α * mapManhattan[i][min[1]][min[0] + 1]) + (mapDijkstra[i][min[1]][min[0] + 1]);
            }
          }
        }
      } else if(min[0] == mapDijkstra[i][0].length - 1){ //on the last column
        if(mapArray[i][min[1]][min[0] - 1] == 1){

        } else {
          if(mapWeight[i][min[1]][min[0] - 1] == "X"){

          } else {
            if(mapDijkstra[i][min[1]][min[0] - 1] == "∞"){
              mapDijkstra[i][min[1]][min[0] - 1] = (mapDijkstra[i][min[1]][min[0]]) + 1;
              mapWeight[i][min[1]][min[0] - 1] = (α * mapManhattan[i][min[1]][min[0] - 1]) + (mapDijkstra[i][min[1]][min[0] - 1]);
            }
          }
        }
      } else { //any other columns
        if(mapArray[i][min[1]][min[0] + 1] == 1){

        } else {
          if(mapWeight[i][min[1]][min[0] + 1] == "X"){

          } else {
            if(mapDijkstra[i][min[1]][min[0] + 1] == "∞"){
              mapDijkstra[i][min[1]][min[0] + 1] = (mapDijkstra[i][min[1]][min[0]]) + 1;
              mapWeight[i][min[1]][min[0] + 1] = (α * mapManhattan[i][min[1]][min[0] + 1]) + (mapDijkstra[i][min[1]][min[0] + 1]);
            }
          }
        }
        if(mapArray[i][min[1]][min[0] - 1] == 1){

        } else {
          if(mapWeight[i][min[1]][min[0] - 1] == "X"){

          } else {
            if(mapDijkstra[i][min[1]][min[0] - 1] == "∞"){
              mapDijkstra[i][min[1]][min[0] - 1] = (mapDijkstra[i][min[1]][min[0]]) + 1;
              mapWeight[i][min[1]][min[0] - 1] = (α * mapManhattan[i][min[1]][min[0] - 1]) + (mapDijkstra[i][min[1]][min[0] - 1]);
            }
          }
        }
      }

      //Check around for Y coordinates
      if(min[1] === 0){ //on the first row
        if(mapArray[i][min[1] + 1][min[0]] == 1){

        } else {
          if(mapWeight[i][min[1] + 1][min[0]] == "X"){

          } else {
            if(mapDijkstra[i][min[1] + 1][min[0]] == "∞"){
              mapDijkstra[i][min[1] + 1][min[0]] = (mapDijkstra[i][min[1]][min[0]]) + 1;
              mapWeight[i][min[1] + 1][min[0]] = (α * mapManhattan[i][min[1] + 1][min[0]]) + (mapDijkstra[i][min[1] + 1][min[0]]);
            }
          }
        }
      } else if( min[1] == mapDijkstra[i].length - 1){ //on the last row
        if(mapArray[i][min[1] - 1][min[0]] == 1){

        } else {
          if(mapWeight[i][min[1] - 1][0] == "X"){

          } else {//SKETCH
            if(mapDijkstra[i][min[1] - 1][min[0]] == "∞"){
              mapDijkstra[i][min[1] - 1][min[0]] = (mapDijkstra[i][min[1]][min[0]]) + 1;
              mapWeight[i][min[1] - 1][min[0]] = (α * mapManhattan[i][min[1] - 1][min[0]]) + (mapDijkstra[i][min[1] - 1][min[0]]);
            }
          }
        }
      } else { //any other rows
        if(mapArray[i][min[1] + 1][min[0]] == 1){

        } else {
          if(mapWeight[i][min[1] + 1][min[0]] == "X"){

          } else {
            if(mapDijkstra[i][min[1] + 1][min[0]] == "∞"){
              mapDijkstra[i][min[1] + 1][min[0]] = (mapDijkstra[i][min[1]][min[0]]) + 1;
              mapWeight[i][min[1] + 1][min[0]] = (α * mapManhattan[i][min[1] + 1][min[0]]) + (mapDijkstra[i][min[1] + 1][min[0]]);
            }
          }
        }
        if(mapArray[i][min[1] - 1][min[0]] == 1){

        } else {
          if(mapWeight[i][min[1] - 1][min[0]] == "X"){

          } else {
            if(mapDijkstra[i][min[1] - 1][min[0]] == "∞"){
              mapDijkstra[i][min[1] - 1][min[0]] = (mapDijkstra[i][min[1]][min[0]]) + 1;
              mapWeight[i][min[1] - 1][min[0]] = (α * mapManhattan[i][min[1] - 1][min[0]]) + (mapDijkstra[i][min[1] - 1][min[0]]);
            }
          }
        }
      }
      mapWeight[i][min[1]][min[0]] = "X";
    }
    numberSteps[i] = steps;
  }
}

//Function to go from end point to start point while keeping track of the way to get there
function trackBack(){
  for(var i = 0; i < filesAmount; i++){
    var currentPosition = [endPosition[i][0], endPosition[i][1], mapDijkstra[i][endPosition[i][1]][endPosition[i][0]]];
    var win = [];
    var follow = [];

    if(numberSteps[i] == "IMPOSSIBLE"){
      win = "IMPOSSIBLE";
      winningPath[i] = win;
      continue;
    }
    while(true){

      if(currentPosition[2] === 0){
        break;
      }

      var min = "∞"; //[Coord X, Coord Y, Value]

      if(currentPosition[1] === 0){

      } else {
        if(mapDijkstra[i][currentPosition[1] - 1][currentPosition[0]] != "∞"){
          if(min != "∞"){
            if(mapDijkstra[i][currentPosition[1] - 1][currentPosition[0]] < min[2]){
              min = [currentPosition[0], currentPosition[1] - 1, mapDijkstra[i][currentPosition[1] - 1][currentPosition[0]]];
            }
          } else {
            min = [currentPosition[0], currentPosition[1] - 1, mapDijkstra[i][currentPosition[1] - 1][currentPosition[0]]];
          }
        }
      }
      //----
      if(currentPosition[0] === 0){

      } else {
        if(mapDijkstra[i][currentPosition[1]][currentPosition[0] - 1] != "∞"){
          if(min != "∞"){
            if(mapDijkstra[i][currentPosition[1]][currentPosition[0] - 1] < min[2]){
              min = [currentPosition[0] - 1, currentPosition[1], mapDijkstra[i][currentPosition[1]][currentPosition[0] - 1]];
            }
          } else {
            min = [currentPosition[0] - 1, currentPosition[1], mapDijkstra[i][currentPosition[1]][currentPosition[0] - 1]];
          }
        }
      }
      //----
      if(currentPosition[0] == mapDijkstra[i][0].length - 1){

      } else {
        if(mapDijkstra[i][currentPosition[1]][currentPosition[0] + 1] != "∞"){
          if(min != "∞"){
            if(mapDijkstra[i][currentPosition[1]][currentPosition[0] + 1] < min[2]){
              min = [currentPosition[0] + 1, currentPosition[1], mapDijkstra[i][currentPosition[1]][currentPosition[0] + 1]];
            }
          } else {
            min = [currentPosition[0] + 1, currentPosition[1], mapDijkstra[i][currentPosition[1]][currentPosition[0] + 1]];
          }
        }
      }
      //----
      if(currentPosition[1] == mapDijkstra[i].length - 1){

      } else {
        if(mapDijkstra[i][currentPosition[1] + 1][currentPosition[0]] != "∞"){
          if(min != "∞"){
            if(mapDijkstra[i][currentPosition[1] + 1][currentPosition[0]] < min[2]){
              min = [currentPosition[0], currentPosition[1] + 1, mapDijkstra[i][currentPosition[1] + 1][currentPosition[0]]];
            }
          } else {
            min = [currentPosition[0], currentPosition[1] + 1, mapDijkstra[i][currentPosition[1] + 1][currentPosition[0]]];
          }
        }
      }
      follow[0] = [endPosition[i][1], endPosition[i][0]];
      follow[win.length + 1] = ([min[1], min[0]]);
      if(currentPosition[0] < min[0]){
        win.push("O");
      } else if(currentPosition[0] > min[0]){
        win.push("E");
      } else if(currentPosition[1] > min[1]){
        win.push("S");
      } else {
        win.push("N");
      }
      currentPosition = min;
    }
    followMe[i] = follow.reverse();
    winningPath[i] = win.reverse();
  }
}

//Function to generate the HTML content
function createHTML(){
  var mainTable = document.getElementById("storeAllTables");
  var html = "";

  for(var i = 0; i < filesAmount; i++){

    html +="<br>";
    html +="<br>";
    html += "<table id=\"tableexercise" + (i + 1) + "\">";
    html += "<tr align=\"center\" class=\"Title\"><td>Grid exercise " + (i + 1) + "</td><td>F(x)</td><td>Manhattan exercise " + (i + 1) + "</td><td>F(x) + α G(x)</td></tr>";
    html += "<tr>";
    html += "<td style=\"padding-right:15px\"><table class=\"Grid\" id=\"gridexercise" + (i + 1) + "\"></table></td>";
    html += "<td style=\"padding-right:15px\"><table class=\"Grid\" id=\"Fx" + (i + 1) + "\"></table></td>";
    html += "<td style=\"padding-right:15px\"><table class=\"Grid\" id=\"manhattanexercise" + (i + 1) + "\"></table></td>";
    html += "<td><table class=\"Grid\" id=\"Fx+Gx" + (i + 1) + "\"></table></td>";
    html += "</tr>";
    html += "<tr><td id=\"pathexercise" + (i + 1) + "\" colspan=\"4\">Chemin à parcourir : </td></tr>";
    html += "<tr><td id=\"totalStepexercise" + (i + 1) + "\" colspan=\"4\">Nombre de déplacement : </td></tr>";
    html +="</table>";
    html +="<hr>";

    mainTable.innerHTML = html;
  }
}

//Function that fills all the grids
function fillAllGrid(){

  for(var i = 0; i < filesAmount; i++){
    var htmlG = "";
    var htmlP = "";
    var htmlM = "";
    var htmlW = "";

    var grid = document.getElementById("gridexercise" + (i + 1));
    var dijkstra = document.getElementById("Fx" + (i + 1));
    var manhattan = document.getElementById("manhattanexercise" + (i + 1));
    var weight = document.getElementById("Fx+Gx" + (i + 1));

    for(var j = 0; j < mapArray[i].length; j++){
      htmlG += "<tr>";
      htmlP += "<tr>";
      htmlM += "<tr>";
      htmlW += "<tr>";
      for(var k = 0; k < mapArray[i][j].length; k++){
        htmlG += "<td id=\"case" + i + "" + j + "" + k + "\">" + mapArray[i][j][k] + "</td>";
        htmlP += "<td>" + mapDijkstra[i][j][k] + "</td>";
        htmlM += "<td>" + mapManhattan[i][j][k] + "</td>";
        htmlW += "<td>" + mapWeight[i][j][k] + "</td>";
      }
      htmlG += "<tr>";
      htmlP += "<tr>";
      htmlM += "<tr>";
      htmlW += "<tr>";
    }

    document.getElementById("pathexercise" + (i + 1)).innerHTML = "Chemin à parcourir : " + winningPath[i];
    document.getElementById("totalStepexercise" + (i + 1)).innerHTML = "Nombre de déplacements : " + numberSteps[i];

    grid.innerHTML = htmlG;
    dijkstra.innerHTML = htmlP;
    manhattan.innerHTML = htmlM;
    weight.innerHTML = htmlW;
  }
  colorCases();
}

//Function to color the path green
function colorCases(){
  for(var i = 0; i < filesAmount; i++){
    if(numberSteps[i] != "IMPOSSIBLE"){
      for(var j = 0; j < followMe[i].length; j++){
        document.getElementById("case" + i + followMe[i][j][0] + followMe[i][j][1]).style.background = "#ccffcc";
      }
    } else {
      document.getElementById("pathexercise" + (i + 1)).style.background = "#ffcccc";
      document.getElementById("totalStepexercise" + (i + 1)).style.background = "#ffcccc";
    }
  }
}
