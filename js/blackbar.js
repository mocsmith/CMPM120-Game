var canvas = document.getElementById('orbit');
var context = canvas.getContext('2d');




function Blackbar() {
  this.inkCircleArray = new Array();
  this.inkLineArray = new Array();
  this.active = false;
  //creates the background image
  this.page = new Image();
  this.page.width = 400;
  this.page.height = 600;
  this.page.X = canvas.width/2-this.page.width/2;
  this.page.Y = canvas.height/2-this.page.height/2;
  this.page.src = 'http://i.imgur.com/J1wp1Su.png';



  //tracks whether or not the mouse is being held down
  this.mouseDown = false;

  this.left = false;
  this.right = false;
  this.prevX = 0;
  this.currX = 0;
  this.prevY = 0;
  this.currY = 0;
  this.color = "black";
  this.flag = false;
  this.dot_flag = false;
  this.lWidth = 20;

  this.pen = new Image();
  this.pen.width = 1000/5;
  this.pen.height = 1000/5;
  this.pen.Y = mousePosCart.y-this.pen.height;
  this.pen.X = mousePosCart.x-10;
  this.pen.src = 'art/pen.png';

//draws continuing rectangles that connect to the original mouse position when mousedown is true
  this.findxy = function(res, e) {
    if (res == 'down') {
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = e.clientX - canvas.offsetLeft;
      this.currY = e.clientY - canvas.offsetTop;

      this.flag = true;
      this.dot_flag = true;
      if (this.dot_flag) {
        
  
        var tempCir = new Array();
        tempCir.push(this.currX);     
        tempCir.push(this.currY);
        this.inkCircleArray.push(tempCir);
        this.dot_flag = false;

      }
    }
    if (res == 'up' || res == "out") {
      this.flag = false;
    }
    if (res == 'move') {
      if (this.flag) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - canvas.offsetLeft;
        this.currY = e.clientY - canvas.offsetTop;
        var tempLine = new Array();      
        tempLine.push(this.prevX);     
        tempLine.push(this.prevY);
        tempLine.push(this.currX);     
        tempLine.push(this.currY);
        this.inkLineArray.push(tempLine);
        var tempCir = new Array();
        tempCir.push(this.currX);     
        tempCir.push(this.currY);
        this.inkCircleArray.push(tempCir);
        
        if (!this.left && this.currX < canvas.width/2) this.left = true;
        if (!this.right && this.currX > canvas.width/2) this.right = true;
      }
    }
  };



  this.complete = false;

  //draws the canvas
  this.draw = function() {
    context.drawImage(this.page, this.page.X, this.page.Y, this.page.width, this.page.height);
    
    context.rect(this.page.X, this.page.Y, this.page.width, this.page.height);
    context.clip();
   
    context.save();
    for (var i = 0; i < this.inkCircleArray.length; i++) {
      var cirX = this.inkCircleArray[i][0];
      var cirY = this.inkCircleArray[i][1];
      context.beginPath();
      context.fillStyle = this.color;
      context.arc(cirX, cirY, 10, 0, 2*Math.PI);
      context.fill();
      context.closePath();
    }
    for (var i = 0; i < this.inkLineArray.length; i++) {
      var prevLineX = this.inkLineArray[i][0];
      var prevLineY = this.inkLineArray[i][1];
      var curLineX = this.inkLineArray[i][2];
      var curLineY = this.inkLineArray[i][3];
      context.beginPath();
      context.moveTo(prevLineX, prevLineY);
      context.lineTo(curLineX, curLineY);
      context.strokeStyle = this.color;
      context.lineWidth = this.lWidth;
      context.stroke();
      context.closePath();
    }
    context.restore();
    context.drawImage(this.pen, this.pen.X, this.pen.Y, this.pen.width, this.pen.height);
  };
  
  //draws the canvas
  this.update = function() {
  //clear
    if (this.inkLineArray.length > 200 && this.right && this.left){
      this.inkLineArray = [];
      this.inkCircleArray = [];
      this.active = false;
      this.mouseDown = false;         
      this.prevX = 0;
      this.currX = 0;
      this.prevY = 0;
      this.currY = 0;
      this.left = false;
      this.right = false;
      this.flag = false;
      this.dot_flag = false;
      gameLeak = false;
    }
    this.pen.Y = mousePosCart.y-this.pen.height;
    this.pen.X =  mousePosCart.x-10;
  };
  
}

var blackbar = new Blackbar();

document.body.onmousedown = function() {
  blackbar.mouseDown = true;
};
document.body.onmouseup = function() {
  blackbar.mouseDown = false;
};

canvas.addEventListener("mousedown", function(e) {
  if (blackbar.active) blackbar.findxy('down', e)
}, false);
canvas.addEventListener("mouseup", function(e) {
  if (blackbar.active) blackbar.findxy('up', e)
}, false);
canvas.addEventListener("mouseout", function(e) {
  if (blackbar.active) blackbar.findxy('out', e)
}, false);