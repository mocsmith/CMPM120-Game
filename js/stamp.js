function Stamp() {
  this.xPos = mousePosCart.x;
  this.yPos = mousePosCart.y;
	this.active = false;
  this.image = new Image();			//backgorund
  this.image.width = 1000/1.5;
  this.image.height = 1000/1.5;
  this.image.Y = canvas.height/2-this.image.height/2;
  this.image.X = canvas.width/2-this.image.width/2;
  this.image.src = 'art/folder.png';				
  this.classifieds = new Array();
  this.endTimer = 20;

  this.stamp = new Image();
  this.stamp.width = 1000/6;
  this.stamp.height = 1000/6;
  this.stamp.Y = this.xPos;
  this.stamp.X = this.yPos;
  this.stamp.src = 'art/stamp.png';

  this.draw = function() {
    context.drawImage(this.image, this.image.X, this.image.Y, this.image.width, this.image.height);
    context.closePath();
    for (var iter = 0; iter < this.classifieds.length; iter++) {
      this.classifieds[iter].draw();
    }
    context.drawImage(this.stamp, this.stamp.X, this.stamp.Y, this.stamp.width, this.stamp.height);
  };

  this.update = function() {
    this.stamp.Y = mousePosCart.y - this.stamp.height/2;
    this.stamp.X = mousePosCart.x - this.stamp.width/2;
    if(this.classifieds.length > 2){  //if 3 stamps start to end
      --this.endTimer;
    }
    if(this.endTimer == 0){       //terminate mini	
      this.classifieds = [];   
      this.endTimer = 20;	     
			this.active = false;
      gameLeak = false;
    }
  };
}
var stamp = new Stamp();
/*

    			classifieds (delete later)

*/
function Classified(x,y) {
  this.image = new Image();
  this.image.width = 1000/7;
  this.image.height = 1000/6;
  this.image.Y = y-5;
  this.image.X = x-this.image.width/2;
  this.image.src = 'art/classified.png'

  this.draw = function() {
    context.drawImage(this.image, this.image.X, this.image.Y, 
                      this.image.width, this.image.height);
  };
}
   
function add_classify(){	//add stamp
  stamp.classifieds.push(new Classified(mousePosCart.x, mousePosCart.y));
}