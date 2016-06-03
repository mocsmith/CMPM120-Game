//Drag minigame

var canvas = document.getElementById('mygame');
var ctx = canvas.getContext('2d');

var sources = new Array();
sources.push("http://www.i.imgur.com/PWrNRTE.png");
sources.push("http://www.i.imgur.com/kH3pt0r.png"); //http://www.i.imgur.com/c0wqcBT.png is the old good image
sources.push("http://www.i.imgur.com/vPp2n9b.png"); //http://www.i.imgur.com/wz8OaaQ.png is the old bad image
sources.push("http://www.i.imgur.com/MPM8Yx5.png");
sources.push("http://www.i.imgur.com/H40yLJt.png");
sources.push("http://www.i.imgur.com/KBUQIqy.png");
sources.push("http://www.i.imgur.com/Oq6IxSu.png");

var trashPic = new Image();
trashPic.X = 450;
trashPic.Y = 250;
trashPic.width = 100;
trashPic.height = 100;
trashPic.src = sources[0];

var badPic1 = new Image();
badPic1.X = 20;
badPic1.Y = 120;
badPic1.width = 400;
badPic1.height = 100;
badPic1.src = sources[1];

var badPic2 = new Image();
badPic2.X = 20;
badPic2.Y = 320;
badPic2.width = 400;
badPic2.height = 100;
badPic2.src = sources[2];

var goodPic1 = new Image();
goodPic1.src = sources[3];

var goodPic2 = new Image();
goodPic2.src = sources[4];

var goodPic3 = new Image();
goodPic3.src = sources[5];

var goodPic4 = new Image();
goodPic4.src = sources[6];

//assigns a true/false value to the mousedown event listener
var mouseDown = false;
document.body.onmousedown = function() {
  mouseDown = true;
}
document.body.onmouseup = function() {
  mouseDown = false;
}

var flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0;

canvas.addEventListener("mousemove", function(e) {
  findxy('move', e)
}, false);
canvas.addEventListener("mousedown", function(e) {
  findxy('down', e)
}, false);
canvas.addEventListener("mouseup", function(e) {
  findxy('up', e)
}, false);

//checks the current mouse position and updates it for other functions
function findxy(res, e) {
  if (res == 'down') {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;
    flag = true;
  }
  if (res == 'up') {
    flag = false;
  }
  if (res == 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;
    }
  }
}

var alphaFlag1 = true,
  alphaFlag2 = true,
  pic1Flag = false,
  pic2Flag = false,
  trash1Flag = false,
  trash2Flag = false,
  picX = 0,
  picY = 0;

//checks if the mouse is being held down while over a moveable object
function checkAlpha(){
  if(mouseDown){
    if(alphaFlag1){
      if(checkImage(badPic1, currX, currY)){
        pic2Flag = false;
        pic1Flag = true;
      }
    }
    if(alphaFlag2){
      if(checkImage(badPic2, currX, currY)){
        pic1Flag = false;
        pic2Flag = true;
      }
    }
  }else{
    pic1Flag = false;
    pic2Flag = false;
  }
}

//draws an object at the mouse location
function drawAlpha(){
  var picX = currX - badPic1.width/2;
  var picY = currY - badPic1.height/2;
  if(pic1Flag){
    ctx.beginPath();
    ctx.globalAlpha = "0.5";
    ctx.drawImage(badPic1, picX, picY, badPic1.width, badPic1.height);
    ctx.closePath();
  }
  if(pic2Flag){
    ctx.beginPath();
    ctx.globalAlpha = "0.5";
    ctx.drawImage(badPic2, picX, picY, badPic2.width, badPic2.height);
    ctx.closePath();
  }
}

//checks if an object is being held over the trash icon
function checkTrash(){
  if(pic1Flag){
    if(checkImage(trashPic, currX, currY)){
      trash1Flag = true;
    }else{
      trash1Flag = false;
    }
  }
  if(pic2Flag){
    if(checkImage(trashPic, currX, currY)){
      trash2Flag = true;
    }else{
      trash2Flag = false;
    }
  }
}

//checks if the mouse is released while holding an object over the trash icon
function emptyTrash(){
  if(trash1Flag){
    if(mouseDown == false){
      badDraw1 = false;
      goodDraw1 = true;
      alphaFlag1 = false;
      trash1Flag = false;
    }
  }
  if(trash2Flag){
    if(mouseDown == false){
      badDraw2 = false;
      goodDraw2 = true;
      alphaFlag2 = false;
      trash2Flag = false;
    }
  }
}

//checks whether or not the mouse is within the bounds of an image
function checkImage(image, x, y) {
  var minX = image.X;
  var maxX = image.X + image.width;
  var minY = image.Y;
  var maxY = image.Y + image.height;
  var mx = x;
  var my = y;
  if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
    return true;
  }
  return false;
}

function update() {
checkAlpha();
drawAlpha();
checkTrash();
emptyTrash();
}

var badDraw1 = true,
    badDraw2 = true,
    goodDraw1 = false,
    goodDraw2 = false;

function draw() {
  canvas.width = canvas.width;
  ctx.drawImage(trashPic, trashPic.X, trashPic.Y, trashPic.width, trashPic.height);
  ctx.drawImage(goodPic1, 20, 20, 400, 100);
  ctx.drawImage(goodPic2, 20, 220, 400, 100);
  if(badDraw1){
   ctx.drawImage(badPic1, badPic1.X, badPic1.Y, badPic1.width, badPic1.height);
  }
  if(badDraw2){
    ctx.drawImage(badPic2, badPic2.X, badPic2.Y, badPic2.width, badPic2.height);
  }
  if(goodDraw1){
   ctx.drawImage(goodPic3, 20, 120, 400, 100);
  }
  if(goodDraw2){
   ctx.drawImage(goodPic4, 20, 320, 400, 100);
  }
}

function game_loop() {
  draw();
  update();
}
setInterval(game_loop, 30);
