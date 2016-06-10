
function ShredMini(){
  this.selectedImage = -1;
	this.active = false;
  
  this.Document = function(x,y) {
    this.image = new Image();
    this.image.X = x;
    this.image.Y = y;
    this.image.width = 100;
    this.image.height = 150;
    this.image.src = 'art/doc.png';

    this.shredded = false;
    this.lifetime = 100;
    this.gone     = false;

    this.draw = function() {
      context.drawImage(this.image, this.image.X, this.image.Y, this.image.width, this.image.height);

    };

    this.update = function() {
      if(this.shredded) {
        ++this.image.Y;
        --this.lifetime;
      }
      if(this.lifetime < 0){
        this.gone = true;
      }
    };
  };

  this.Shredder = function() {

    this.shredderIMG = new Image();
    this.shredderIMG.width = 300;
    this.shredderIMG.height = 300;
    this.shredderIMG.X = canvas.width/2-this.shredderIMG.width/2;
    this.shredderIMG.Y = canvas.height/2-this.shredderIMG.height/2;
    this.shredderIMG.src = 'art/shredder.png';

    this.draw = function() {
      context.drawImage(this.shredderIMG, this.shredderIMG.X, this.shredderIMG.Y, this.shredderIMG.width, this.shredderIMG.height);
    };

  };
  
  this.shredder = new this.Shredder();

  this.documents = new Array();
  this.documents.push(new this.Document(100,300));
  this.documents.push(new this.Document(150,350));
  this.documents.push(new this.Document(200,400));
  //console.log(this.documents);

  this.boxCollision = function(x1, y1, w1, h1, x2, y2, w2, h2){
    return (x1 < x2 + w2 &&
            x1 + w1 > x2 &&
            y1 < y2 + h2 &&
            y1 + h1 > y2) 
  };


  this.selectObj = function(e) {
     //console.log("select");
     console.log(shredMini.documents);
      for (var i in shredMini.documents) {
        //console.log(i);
        if (!shredMini.documents[i].shredded && shredMini.boxCollision(shredMini.documents[i].image.X, shredMini.documents[i].image.Y, shredMini.documents[i].image.width, 
          shredMini.documents[i].image.height, e.clientX, e.clientY, 0, 0)) {
          shredMini.selectedImage = i;
          console.log(shredMini.selectedImage)
        }
      }
  };

  this.moveObj  = function(e) {
    //console.log("move");
    //console.log(shredMini.selectedImage);
    if(shredMini.selectedImage > -1){
      shredMini.documents[shredMini.selectedImage].image.X = e.clientX - shredMini.documents[shredMini.selectedImage].image.width/2;
      shredMini.documents[shredMini.selectedImage].image.Y = e.clientY - shredMini.documents[shredMini.selectedImage].image.height/2;
    }
  };

  this.deselectObj = function(e) {
    //console.log("drop");
    if(shredMini.selectedImage > -1) {
      if(shredMini.boxCollision(shredMini.documents[shredMini.selectedImage].image.X, shredMini.documents[shredMini.selectedImage].image.Y, shredMini.documents[shredMini.selectedImage].image.width, 
        shredMini.documents[shredMini.selectedImage].image.height, this.shredder.shredderIMG.X, this.shredder.shredderIMG.Y + 100, this.shredder.shredderIMG.width, this.shredder.shredderIMG.height/4)) {
        shredMini.documents[shredMini.selectedImage].shredded = true;
      }
    }
    shredMini.selectedImage = -1;
  };


  this.draw = function() {
    for(var i in this.documents) {
      this.documents[i].draw();
    }
    this.shredder.draw();
  };

  this.update = function() {
    //boxes.push(new SearchBox());
    for(var i = 0; i < this.documents.length; ) {
      if(!this.documents[i].gone) {
        this.documents[i].update();
        ++i;
      } else {
        this.documents.splice(i,1);
      }
    }
    //console.log(this.documents.length)
    if(this.documents.length == 0){
      //*********** end minigame *************
      this.active = false;
      gameLeak = false;
      this.documents.push(new this.Document(400,300));
      this.documents.push(new this.Document(420,350));
      this.documents.push(new this.Document(440,400));
    }
  };
}

shredMini = new ShredMini();

 
