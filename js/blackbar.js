//Blackbox minigame
//blank colored page http://i.imgur.com/zAdDF0n.png
//sample important-looking page http://i.imgur.com/J1wp1Su.png

//a temporary array setup that would allow us to include several different pages that could be pulled from at random to be the background image
//var sources = new Array();
//sources.push('http://i.imgur.com/zAdDF0n.png');

//array containing flags for each zone on the image
var checks = new Array();
checks.push(false);
checks.push(false);
checks.push(false);
checks.push(false);
checks.push(false);
checks.push(false);
checks.push(false);
checks.push(false);
checks.push(false);

//array containing the coordinates of the zones
var zoneList = new Array();

//outlines zone information
function Zone(x, y, width, height) {
  this.X = x;
  this.Y = y;
  this.width = width;
  this.height = height;
}

//list of the (currently) nine zones' coordinates on the page
zoneA = new Zone(90, 90, 50, 50);
zoneList.push(zoneA);
zoneB = new Zone(190, 90, 50, 50);
zoneList.push(zoneB);
zoneC = new Zone(290, 90, 50, 50);
zoneList.push(zoneC);
zoneD = new Zone(90, 190, 50, 50);
zoneList.push(zoneD);
zoneE = new Zone(190, 190, 50, 50);
zoneList.push(zoneE);
zoneF = new Zone(290, 190, 50, 50);
zoneList.push(zoneF);
zoneG = new Zone(90, 290, 50, 50);
zoneList.push(zoneG);
zoneH = new Zone(190, 290, 50, 50);
zoneList.push(zoneH);
zoneI = new Zone(290, 290, 50, 50);
zoneList.push(zoneI);

//creates the background image
var page = new Image();
page.x = 0;
page.y = 0;
page.width = 400;
page.height = 500;
page.src = /*sources[0]*/ 'http://i.imgur.com/J1wp1Su.png';

var flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  dot_flag = false;

var color = "black",
  lWidth = 20;

canvas.addEventListener("mousemove", function(e) {
  findxy('move', e)
}, false);
canvas.addEventListener("mousedown", function(e) {
  findxy('down', e)
}, false);
canvas.addEventListener("mouseup", function(e) {
  findxy('up', e)
}, false);
canvas.addEventListener("mouseout", function(e) {
  findxy('out', e)
}, false);

//draws the initial line segment at the mouse position
function drawLine() {
  context.beginPath();
  context.moveTo(prevX, prevY);
  context.lineTo(currX, currY);
  context.strokeStyle = color;
  context.lineWidth = lWidth;
  context.stroke();
  context.closePath();
}

//draws continuing rectangles that connect to the original mouse position when mousedown is true
function findxy(res, e) {
  if (res == 'down') {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      context.beginPath();
      context.fillStyle = color;
      context.arc(currX, currY, 10, 0, 2*Math.PI);
      context.fill();
      context.closePath();
      dot_flag = false;
    }
  }
  if (res == 'up' || res == "out") {
    flag = false;
  }
  if (res == 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;
      drawLine();
      
      context.beginPath();
      context.fillStyle = color;
      context.arc(currX, currY, 10, 0, 2*Math.PI);
      context.fill();
      context.closePath();
    }
  }
}

//tracks whether or not the mouse is being held down
var mouseDown = false;
document.body.onmousedown = function() {
  mouseDown = true;
}
document.body.onmouseup = function() {
  mouseDown = false;
}

//marks a specific flag in the checks() array as true
function handleClick(e) {
  for (var iter = 0; iter < checks.length; iter++) {
    if (checkZone(zoneList[iter], currX, currY)) {
      if (mouseDown) {
        checks[iter] = true;
      }
    }
  }
}

//checks whether or not the mouse is within one of the marked zones
function checkZone(zone, x, y) {
  var minX = zone.X;
  var maxX = zone.X + zone.width;
  var minY = zone.Y;
  var maxY = zone.Y + zone.height;
  var mx = x;
  var my = y;
  if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
    return true;
  }
  return false;
}

var reset = false;

//checks if the game needs to be reset (if it does, a message is displayed and the canvasReset function is called after two seconds)
function gameReset() {
  if (reset == true) {
    context.font = "30px Verdana";
    context.fillText("Success!", 130, 450);
    for (var iter = 0; iter < checks.length; iter++) {
      checks[iter] = false;
    }
    setTimeout(canvasReset, 2000);
  }
}

//clears the user's writing and redraws the canvas
function canvasReset() {
  if (reset == true) {
    canvas.width = canvas.width;
    context.drawImage(page, page.x, page.y, page.width, page.height);
    reset = false;
  }
}

function update() {
  handleClick(event);
  gameReset();
}

var a = 0;
var complete = false;

//draws the canvas
function draw() {
  //canvas.width = canvas.width;
  if (a == 0) {
    context.drawImage(page, page.x, page.y, page.width, page.height);
    a++;
  }

  /*
  //draws the exact zones the user must black out (for testing purposes)
    context.fillRect(90,90,50,50);
    context.fillRect(190,90,50,50);
    context.fillRect(290,90,50,50);
    context.fillRect(90,190,50,50);
    context.fillRect(190,190,50,50);
    context.fillRect(290,190,50,50);
    context.fillRect(90,290,50,50);
    context.fillRect(190,290,50,50);
    context.fillRect(290,290,50,50);
  */

  //iterates through the checks array and checks if all 9 zones on the page have been marked
  for (var i = 0; i < checks.length; i++) {
    if (checks[i] == false) {
      complete = false;
      break;
    } else {
      complete = true;
    }
  }

  //resets the minigame if the previous checks return true
  if (complete == true) {
    reset = true;
  }
}
