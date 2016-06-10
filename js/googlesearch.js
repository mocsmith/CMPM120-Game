var canvas = document.getElementById('orbit');
var context = canvas.getContext('2d');

function googleSearch() {
  this.sources = new Array();
  this.sources.push("http://www.i.imgur.com/PWrNRTE.png");
  this.sources.push("http://www.i.imgur.com/kH3pt0r.png");
  this.sources.push("http://www.i.imgur.com/vPp2n9b.png");
  this.sources.push("http://www.i.imgur.com/MPM8Yx5.png");
  this.sources.push("http://www.i.imgur.com/H40yLJt.png");
  this.sources.push("http://www.i.imgur.com/KBUQIqy.png");
  this.sources.push("http://www.i.imgur.com/Oq6IxSu.png");

  this.standardX = 200;
  this.standardY = 150;
  this.standardWidth = 400;
  this.standardHeight = 100;

  this.trashPic = new Image();
  this.trashPic.X = 700;
  this.trashPic.Y = 300;
  this.trashPic.width = 100;
  this.trashPic.height = 100;
  this.trashPic.src = this.sources[0];

  this.goodPic1 = new Image();
  this.goodPic1.X = this.standardX;
  this.goodPic1.Y = this.standardY;
  this.goodPic1.width = this.standardWidth;
  this.goodPic1.height = this.standardHeight;
  this.goodPic1.src = this.sources[3];

  this.badPic1 = new Image();
  this.badPic1.X = this.standardX;
  this.badPic1.Y = this.standardY + 100;
  this.badPic1.width = this.standardWidth;
  this.badPic1.height = this.standardHeight;
  this.badPic1.src = this.sources[1];

  this.goodPic2 = new Image();
  this.goodPic2.X = this.standardX;
  this.goodPic2.Y = this.standardY + 200;
  this.goodPic2.width = this.standardWidth;
  this.goodPic2.height = this.standardHeight;
  this.goodPic2.src = this.sources[4];

  this.badPic2 = new Image();
  this.badPic2.X = this.standardX;
  this.badPic2.Y = this.standardY + 300;
  this.badPic2.width = this.standardWidth;
  this.badPic2.height = this.standardHeight;
  this.badPic2.src = this.sources[2];

  this.goodPic3 = new Image();
  this.goodPic3.X = this.standardX;
  this.goodPic3.Y = this.standardY + 300;
  this.goodPic3.width = this.standardWidth;
  this.goodPic3.height = this.standardHeight;
  this.goodPic3.src = this.sources[5];

  this.goodPic4 = new Image();
  this.goodPic4.X = this.standardX;
  this.goodPic4.Y = this.standardY + 300;
  this.goodPic4.width = this.standardWidth;
  this.goodPic4.height = this.standardHeight;
  this.goodPic4.src = this.sources[6];

  this.flag = false;
  this.prevX = 0;
  this.currX = 0;
  this.prevY = 0;
  this.currY = 0;
  this.temp = false;

  //checks the current mouse position and updates it for other functions
  this.findxy = function(res, e) {
    if (res == 'down') {
      this.prevX = this.currX;
      this.prevY = this.currY;
      this.currX = e.clientX - canvas.offsetLeft;
      this.currY = e.clientY - canvas.offsetTop;
      this.flag = true;
      this.mouseDown = true;
    }
    if (res == 'up') {
      this.flag = false;
      this.mouseDown = false;
    }
    if (res == 'move') {
      if (this.flag) {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - canvas.offsetLeft;
        this.currY = e.clientY - canvas.offsetTop;
      }
    }
  };

  this.alphaFlag1 = true;
  this.alphaFlag2 = true;
  this.pic1Flag = false;
  this.pic2Flag = false;
  this.trash1Flag = false;
  this.trash2Flag = false;
  this.picX = 0;
  this.picY = 0;

  //checks if the mouse is being held down while over a moveable object
  this.checkAlpha = function() {
    if (this.mouseDown) {
      if (this.alphaFlag1) {
        if (this.checkImage(this.badPic1, this.currX, this.currY)) {
          this.pic2Flag = false;
          this.pic1Flag = true;
        }
      }
      if (this.alphaFlag2) {
        if (this.checkImage(this.badPic2, this.currX, this.currY)) {
          this.pic1Flag = false;
          this.pic2Flag = true;
        }
      }
    } else {
      this.pic1Flag = false;
      this.pic2Flag = false;
    }
  };

  //draws an object at the mouse location
  this.drawAlpha = function() {
    var picX = this.currX - this.badPic1.width / 2;
    var picY = this.currY - this.badPic1.height / 2;
    if (this.pic1Flag) {
      context.beginPath();
      context.globalAlpha = "0.5";
      context.drawImage(this.badPic1, picX, picY, this.badPic1.width, this.badPic1.height);
      context.closePath();
    }
    if (this.pic2Flag) {
      context.beginPath();
      context.globalAlpha = "0.5";
      context.drawImage(this.badPic2, picX, picY, this.badPic2.width, this.badPic2.height);
      context.closePath();
    }
  };

  //checks if an object is being held over the trash icon
  this.checkTrash = function() {
    if (this.pic1Flag) {
      if (this.checkImage(this.trashPic, this.currX, this.currY)) {
        this.trash1Flag = true;
      } else {
        this.trash1Flag = false;
      }
    }
    if (this.pic2Flag) {
      if (this.checkImage(this.trashPic, this.currX, this.currY)) {
        this.trash2Flag = true;
      } else {
        this.trash2Flag = false;
      }
    }
  };

  //checks if the mouse is released while holding an object over the trash icon
  this.emptyTrash = function() {
    if (this.trash1Flag) {
      if (this.mouseDown == false) {
        this.badDraw1 = false;
        this.goodDraw1 = true;
        this.alphaFlag1 = false;
        this.trash1Flag = false;
        this.first1 = true;
        this.first2 = false;
        this.second1 = false;
        this.second2 = true;
      }
    }
    if (this.trash2Flag) {
      if (this.mouseDown == false) {
        this.badDraw2 = false;
        this.goodDraw2 = true;
        this.alphaFlag2 = false;
        this.trash2Flag = false;
        this.first1 = false;
        this.first2 = true;
        this.second1 = true;
        this.second2 = false;
      }
    }
  };

  //checks whether or not the mouse is within the bounds of an image
  this.checkImage = function(image, x, y) {
    this.minX = image.X;
    this.maxX = image.X + image.width;
    this.minY = image.Y;
    this.maxY = image.Y + image.height;
    this.mx = x;
    this.my = y;
    if (this.mx >= this.minX && this.mx <= this.maxX && this.my >= this.minY && this.my <= this.maxY) {
      return true;
    }
    return false;
  };

  this.badDraw1 = true;
  this.badDraw2 = true;
  this.goodDraw1 = false;
  this.goodDraw2 = false;
  this.goodDraw3 = false;
  this.goodDraw4 = false;
  this.first1 = false;
  this.first2 = false;
  this.second1 = false;
  this.second2 = false;
  this.a = 0;
  this.b = 0;
  this.c = 0;
  this.d = 0;
  this.e = 0;
  this.f = 0;
  this.g = 0;
  this.h = 0;

  //draws the canvas
  this.draw = function() {
    canvas.width = canvas.width;
    context.drawImage(this.trashPic, this.trashPic.X, this.trashPic.Y, this.trashPic.width, this.trashPic.height);
    context.drawImage(this.goodPic1, this.goodPic1.X, this.goodPic1.Y, this.goodPic1.width, this.goodPic1.height);
    context.drawImage(this.goodPic2, this.goodPic2.X, this.goodPic2.Y, this.goodPic2.width, this.goodPic2.height);
    if (this.badDraw1) {
      context.drawImage(this.badPic1, this.badPic1.X, this.badPic1.Y, this.badPic1.width, this.badPic1.height);
    }
    if (this.badDraw2) {
      context.drawImage(this.badPic2, this.badPic2.X, this.badPic2.Y, this.badPic2.width, this.badPic2.height);
    }
    if (this.goodDraw1) {
      if (this.first1) {
        if (this.a < 100) {
          this.a = this.a + 4;
          this.goodPic2.Y = this.goodPic2.Y - 4;
        }
        if (this.b < 100) {
          this.b = this.b + 4;
          this.badPic2.Y = this.badPic2.Y - 4;
        }
        if (this.c < 25) {
          this.c = this.c + 1;
        }
        if (this.c == 25) {
          this.goodDraw3 = true;
        }
        if (this.goodDraw3) {
          context.drawImage(this.goodPic3, this.goodPic3.X, this.goodPic3.Y, this.goodPic3.width, this.goodPic3.height);
        }
      }
      if (this.second1) {
        if (this.d < 100) {
          this.d = this.d + 4;
          this.goodPic3.Y = this.goodPic3.Y - 4;
        }
        if (this.e < 25) {
          this.e = this.e + 1;
        }
        if (this.e == 25) {
          this.goodDraw4 = true;
        }
        if (this.goodDraw4) {
          context.drawImage(this.goodPic4, this.goodPic4.X, this.goodPic4.Y, this.goodPic4.width, this.goodPic4.height);
        }
      }
    }
    if (this.goodDraw2) {
      if (this.first2) {
        if (this.f < 25) {
          this.f = this.f + 1;
        }
        if (this.f == 25) {
          this.goodDraw3 = true;
        }
        if (this.goodDraw3) {
          context.drawImage(this.goodPic3, this.goodPic3.X, this.goodPic3.Y, this.goodPic3.width, this.goodPic3.height);
        }
      }
      if (this.second2) {
        if (this.g < 100) {
          this.g = this.g + 4;
          this.goodPic3.Y = this.goodPic3.Y - 4;
        }
        if (this.h < 25) {
          this.h = this.h + 1;
        }
        if (this.h == 25) {
          this.goodDraw4 = true;
        }
        if (this.goodDraw4) {
          context.drawImage(this.goodPic4, this.goodPic4.X, this.goodPic4.Y, this.goodPic4.width, this.goodPic4.height);
        }
      }
    }
  };

  //updates the listed functions
  this.update = function() {
    this.checkAlpha();
    this.drawAlpha();
    this.checkTrash();
    this.emptyTrash();
  };

}

var googlesearch = new googleSearch();

function draw() {
  googlesearch.draw();
}

function update() {
  googlesearch.update();
}

function game_loop() {
  draw();
  update();
}

canvas.addEventListener("mousemove", function(e) {
  googlesearch.findxy('move', e)
}, false);
canvas.addEventListener("mousedown", function(e) {
  googlesearch.findxy('down', e)
}, false);
canvas.addEventListener("mouseup", function(e) {
  googlesearch.findxy('up', e)
}, false);

setInterval(game_loop, 30);

