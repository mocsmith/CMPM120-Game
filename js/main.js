      /*
    
          paddle(user object)
    
      */
      function Paddle() {
        this.draw = function() {
          context.save();
          context.translate(canvas.width / 2, canvas.height / 2); //move to center
          context.rotate(-paddleAngle - Math.PI / 2); //rotate to mouse

          context.beginPath(); //used to clip the circles
          context.rect(-60, -115, 120, 26);
          //context.stroke();
          context.clip();
          context.closePath();
          context.beginPath(); //used to clip the circles
          context.arc(0, -13, 100, 0, 2 * Math.PI, true);
          //context.stroke();
          context.clip();
          context.closePath();

          context.beginPath();
          context.fillStyle = 'black';
          context.arc(0, -13, 100, 0, 2 * Math.PI, false); //black circle
          context.fill();
          context.closePath();

          context.beginPath(); //recharge bar
          context.fillStyle = 'green';
          context.rect(-60 * reload / reloadMax, -115, 120 * reload / reloadMax, 26);
          context.fill();
          context.closePath();

          context.beginPath(); //second white circle to elipse the black
          context.fillStyle = 'white';
          context.arc(0, 36, 140, 0, 2 * Math.PI, false);
          context.fill();
          context.closePath();
          context.restore();
        };
      }
      var paddle = new Paddle();
      /*
    
          radar(user projectile)
    
      */
      function Radar(angle) {
        this.speed = gameSpeed / 1.4;
        this.angle = angle;
        this.x = 0;
        this.y = 115;
        this.Y = 0;
        this.dead = false;


        this.image = new Image();
        this.image.width = 20;
        this.image.height = 20;
        this.image.X = 0 - this.image.width/2;
        this.image.Y = this.y - this.image.height/2;
        this.image.src = 'art/mib3A3C56.png';
        

        this.update = function() {
          this.speed = gameSpeed / 1.4;
          this.y += this.speed;
          this.image.Y += this.speed;

          this.x = -(Math.cos(this.angle) * this.y);
          this.Y = -(Math.sin(this.angle) * this.y);

          if (this.y > canvas.height) {
            this.dead = true;
          }

          //console.log(this.x + ", " + this.y)

          for (var i = 0; i < leaks.length; ++i) {
            if (!leaks[i].dead && cartesian_circle_collision(this.x, this.Y, leaks[i].x, leaks[i].Y, 10, 10)) {
              leaks[i].dead = true;
              this.dead = true;
              ++totalScore;
              if(charged < 20) ++charged;
            }
          }

          for (var i = 0; i < accesses.length; ++i) {
            if (!accesses[i].dead && cartesian_circle_collision(this.x, this.Y, accesses[i].x, accesses[i].Y, 10, 10)) {
              accesses[i].dead = true;
              this.dead = true;
              ++totalScore;
              if(charged < 20) ++charged;
            }
          }

          for (var i = 0; i < hackers.length; ++i) {
            if (!hackers[i].dead && cartesian_circle_collision(this.x, this.Y, hackers[i].x, hackers[i].Y, 10, 10)) {
              this.dead = true;
              if (hackers[i].shield) hackers[i].shield = false;
              else {
                hackers[i].dead = true;
                ++totalScore;
                if(charged < 20) ++charged;
              }
            }
          }

          for (var i = 0; i < socials.length; ++i) {
            if (!socials[i].dead && cartesian_circle_collision(this.x, this.Y, socials[i].x, socials[i].Y, 8, 10)) {
              socials[i].dead = true;
              this.dead = true;
              ++totalScore;
              if(charged < 20) ++charged;
            }
          }

          for (var i = 0; i < medias.length; ++i) {
            if (!medias[i].dead && cartesian_circle_collision(this.x, this.Y, medias[i].x, medias[i].Y, 8, 10)) {
              medias[i].dead = true;
              this.dead = true;
              ++totalScore;
              if(charged < 20) ++charged;
            }
          }
        };

        this.draw = function() {
          context.save();
          context.translate(canvas.width / 2, canvas.height / 2); //move to center
          context.rotate(-this.angle + Math.PI / 2);
          context.drawImage(this.image, this.image.X, this.image.Y, this.image.width, this.image.height);
          context.restore();
        };
      }
      var radars = new Array();
      var reloadMax = 20;
      var reload = reloadMax;

      /*
    
          access(attacking enemy)
    
      */
      function Access(angle, y) {
        this.deathTimer = 10; //delay between dying and not being drawn
        this.dead = false; //used to see if it alive
        this.speed = -gameSpeed / 1.65;
        this.angle = angle;
        this.y = y; //make sure it is off screen
        this.x = 0;
        this.Y = 0;
        this.hitPaddle = false;
        this.waveCollided = false;
        

        this.image = new Image();
        this.image.width = 20;
        this.image.height = 20;
        this.image.X = 0 - this.image.width/2;
        this.image.Y = this.y - this.image.height/2;
        this.image.src = 'art/accsessor.png';
        

        this.draw = function() {
          if (this.deathTimer > 0) { //if alive
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2); //move to center
            context.rotate(-this.angle + Math.PI / 2);

            context.drawImage(this.image, this.image.X, this.image.Y, this.image.width, this.image.height);
            context.restore();
          }
        };

        this.update = function() {
          //console.log(this.y);

          var collided = exterior_circle_collision(this.y, 0, 10, 107);
          
          if(waveFired && this.y > wave.y) {
            this.waveCollided = exterior_circle_collision(this.y, wave.y, 10, wave.r);
          }
          
          if(this.waveCollided) {
            this.dead = true;
          }

          //gamespeed HACK
          if (!this.hitPaddle && collided && paddle_angle_collision(this.angle)) {
            this.speed = gameSpeed / 1.65;
            this.hitPaddle = true;
            ++totalScore;
            if(charged < 20) ++charged;
          } else if (collided) {
            this.speed = -(gameSpeed / 1.65);
            this.hitPaddle = true;
          } else if (!this.hitPaddle) {
            this.speed = -(gameSpeed / 1.65);
          } else if (this.hitPaddle) {
            this.speed = gameSpeed / 1.65;
          }

          if (!this.dead) { //if not hit
            this.y += this.speed; //move
            this.image.Y += this.speed;
            if (this.y < 10) {
              this.dead = true; //if reached information          
              --totalScore;
              ++unrest;
            }
            if (this.y > canvas.height && this.speed > 0) {
              this.dead = true;
            }
          } else {
            if (this.deathTimer > 0) { //death timer decrease
              this.deathTimer--;
            }
          }

          //console.log(this.angle);
          this.x = -(Math.cos(this.angle) * this.y);
          this.Y = -(Math.sin(this.angle) * this.y);
          //console.log(this.x + ", " + this.Y);

        };
      }
      var accesses = new Array();
      /*
    
          leaks(escaping enemy)
    
      */
      function Leak() {
        this.deathTimer = 10; //delay between dying and not being drawn
        this.dead = false; //used to see if it alive
        this.speed = gameSpeed / 5;
        this.angle = (2 * Math.PI) * Math.random();
        this.y = 0;
        this.x = 0;
        this.Y = 0;
        this.hitPaddle = false;
        this.waveCollided = false;


        this.image = new Image();
        this.image.width = 20;
        this.image.height = 20;
        this.image.X = 0 - this.image.width/2;
        this.image.Y = this.y - this.image.height/2;
        this.image.src = 'art/infolock.png';

        this.draw = function() {
          if (this.deathTimer > 0) { //if alive
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2); //move to center
            context.rotate(-this.angle + Math.PI / 2); //rotate to mouse

            context.drawImage(this.image, this.image.X, this.image.Y, this.image.width, this.image.height);
            context.restore();
          }
        };

        this.update = function() {
          
          if(waveFired && this.y > wave.y) {
            this.waveCollided = exterior_circle_collision(this.y, wave.y, 10, wave.r);
          }
          
          if(this.waveCollided) {
            this.dead = true;
          }
        
          if (!this.hitPaddle && this.y > 97 && this.y < 120 && paddle_angle_collision(this.angle)) {
            this.speed = -gameSpeed / 5;
            this.hitPaddle = true;
            ++totalScore;
          if(charged < 20) ++charged;
          } else if (this.hitPaddle) {
            this.speed = -gameSpeed / 5;
          } else if (!this.hitPaddle) {
            this.speed = gameSpeed / 5;
          }

          //console.log(this.angle);
          this.x = -(Math.cos(this.angle) * this.y);
          this.Y = -(Math.sin(this.angle) * this.y);
          //console.log(this.x + ", " + this.Y);

          if (!this.dead) { //if not hit
            this.y += this.speed; //move
            this.image.Y += this.speed; //move

            if (!(this.x > -canvas.width / 2 && this.x < canvas.width / 2 && this.Y > -canvas.height / 2 && this.Y < canvas.height / 2)) {
              totalScore -= 5;
              this.dead = true;
              unrest += 5;
            }
            if (this.hitPaddle && this.y < 10) {
              this.dead = true; //if bounced back to center
            }
          } else {
            if (this.deathTimer > 0) { //death timer decrease
              this.deathTimer--;
            }
          }
        };
      }
      var leaks = new Array();
      /*

      hacker enemy

      */
      function Hacker() {
        this.deathTimer = 10; //delay between dying and not being drawn
        this.dead = false; //used to see if it alive
        this.speed = -gameSpeed / 2;
        this.angle = (2 * Math.PI) * Math.random();
        this.y = 800; //make sure it is off screen
        this.x = 0;
        this.Y = 0;
        this.hitPaddle = false;
        this.waveCollided = false;
        this.shield = true;
        

        this.image = new Image();
        this.image.width = 20;
        this.image.height = 20;
        this.image.X = 0 - this.image.width/2;
        this.image.Y = this.y - this.image.height/2;
        this.image.src = 'art/hacker.png';

        this.draw = function() {

          if (this.deathTimer > 0) { //if alive
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2); //move to center
            context.rotate(-this.angle + Math.PI / 2);
            context.beginPath();
            context.arc(0, this.y, 15, 0, 2 * Math.PI, false);
            context.fillStyle = '#6698FF';
            if (this.shield) context.fill();  //draw shield
            context.closePath();

            context.drawImage(this.image, this.image.X, this.image.Y, this.image.width, this.image.height);
            context.restore();
          }
        };

        this.update = function() {
          //console.log(this.y);

          var collided = exterior_circle_collision(this.y, 0, 10, 107);
          
          //gamespeed HACK
          if (!this.hitPaddle && collided && paddle_angle_collision(this.angle)) {
            this.speed = gameSpeed/2;
            this.hitPaddle = true;
            ++totalScore;
            if(charged < 20) ++charged;
          } else if (collided) {
            this.speed = -(gameSpeed/2);
            this.hitPaddle = true;
          } else if (!this.hitPaddle) {
            this.speed = -(gameSpeed/2);
          } else if (this.hitPaddle) {
            this.speed = gameSpeed/2;
          }

          if (!this.dead) { //if not hit
            this.y += this.speed; //move
            this.image.Y += this.speed; //move
            this.angle += .001*gameSpeed;
            if(this.angle > 2 * Math.PI) {
              this.angle = 0;
            }
            if (this.y < 10) {
              this.dead = true; //if reached information          
              --totalScore;
              ++unrest;
            }
            if (this.y > canvas.height && this.speed > 0) {
              this.dead = true;
            }
          } else {
            if (this.deathTimer > 0) { //death timer decrease
              this.deathTimer--;
            }
          }

          //console.log(this.angle);
          this.x = -(Math.cos(this.angle) * this.y);
          this.Y = -(Math.sin(this.angle) * this.y);
          //console.log(this.x + ", " + this.Y);

        };
      }
      var hackers = new Array();
      
      /*
            social enemy

      */
      var socials = new Array();

      function Social(angleSpeed, angleSeed, y) {
        this.deathTimer = 10; //delay between dying and not being drawn
        this.dead = false; //used to see if it alive
        this.speed = -gameSpeed / 5;
        this.angle = angleSeed;
        this.y = y; //make sure it is off screen
        this.x = 0;
        this.Y = 0;
        this.hitPaddle = false;
        this.waveCollided = false;
        this.angleSpeed = angleSpeed;
        this.duplicateTimer = 1500;
        

        this.image = new Image();
        this.image.width = 16;
        this.image.height = 16;
        this.image.X = 0 - this.image.width/2;
        this.image.Y = this.y - this.image.height/2;
        this.image.src = 'art/social.png';

        this.draw = function() {
          if (this.deathTimer > 0) { //if alive
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2); //move to center
            context.rotate(-this.angle + Math.PI / 2);

            
            context.drawImage(this.image, this.image.X, this.image.Y, this.image.width, this.image.height);
            context.restore();
          }
        };

        this.update = function() {
          this.duplicateTimer-=gameSpeed;

          if(this.duplicateTimer < 0 && !this.dead && !this.hitPaddle){     //duplicating
            this.duplicateTimer = 800;
            this.angleSpeed = -1*Math.abs(this.angleSpeed)-.0003;
            var temp = new Social(Math.abs(this.angleSpeed)+.0003, this.angle, this.y);
            socials.push(temp);
          }

          this.angle += this.angleSpeed * gameSpeed;

          var collided = exterior_circle_collision(this.y, 0, 8, 107);
          
          if(waveFired && this.y > wave.y) {
            this.waveCollided = exterior_circle_collision(this.y, wave.y, 8, wave.r);
          }
          
          if(this.waveCollided) {
            this.dead = true;
          }

          //gamespeed HACK
          if (!this.hitPaddle && collided && paddle_angle_collision(this.angle)) {
            this.speed = gameSpeed / 5;
            this.hitPaddle = true;
            ++totalScore;
            if(charged < 20) ++charged;
          } else if (collided) {
            this.speed = -(gameSpeed / 5);
            this.hitPaddle = true;
          } else if (!this.hitPaddle) {
            this.speed = -(gameSpeed / 5);
          } else if (this.hitPaddle) {
            this.angleSpeed = 0;
            this.speed = gameSpeed / 5;
          }

          if (!this.dead) { //if not hit
            this.y += this.speed; //move
            this.image.Y += this.speed; //move
            if (this.y < 10) {
              this.dead = true; //if reached information          
              --totalScore;
              ++unrest;
            }
            if (this.y > canvas.height && this.speed > 0) {
              this.dead = true;
            }
          } else {
            if (this.deathTimer > 0) { //death timer decrease
              this.deathTimer--;
            }
          }

          //console.log(this.angle);
          this.x = -(Math.cos(this.angle) * this.y);
          this.Y = -(Math.sin(this.angle) * this.y);
          //console.log(this.x + ", " + this.Y);

        };
      }
        /*
            social enemy

      */
      var medias = new Array();

      function Media() {
        this.deathTimer = 10; //delay between dying and not being drawn
        this.dead = false; //used to see if it alive
        this.speed = -gameSpeed / 2;
        this.angle = Math.random() * 2 * Math.PI;
        this.y = 800; //make sure it is off screen
        this.x = 0;
        this.Y = 0;
        this.hitPaddle = false;
        this.waveCollided = false;
        this.stopTimer = 920;
        this.spawnTimer = 1100;
        this.stop = false;
        

        this.image = new Image();
        this.image.width = 30;
        this.image.height = 30;
        this.image.X = 0 - this.image.width/2;
        this.image.Y = this.y - this.image.height/2;
        this.image.src = 'art/news.png';

        this.draw = function() {
          if (this.deathTimer > 0) { //if alive
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2); //move to center
            context.rotate(-this.angle + Math.PI / 2);

            context.drawImage(this.image, this.image.X, this.image.Y, this.image.width, this.image.height);
            context.restore();
          }
        };

        this.update = function() {
          this.spawnTimer-=gameSpeed;
          if(this.spawnTimer < 0 && !this.dead && !this.hitPaddle){     //spawning
            this.spawnTimer = 1000;
            var temp = new Access(this.angle, this.y);
            accesses.push(temp);
          }
          if(this.stopTimer < 0){     //stop
            this.stop = true;
          } else this.stopTimer-=gameSpeed;
          var collided = exterior_circle_collision(this.y, 0, 15, 107);
          
          if(waveFired && this.y > wave.y) {
            this.waveCollided = exterior_circle_collision(this.y, wave.y, 15, wave.r);
          }
          
          if(this.waveCollided) {
            this.dead = true;
          }

          //gamespeed HACK
          if (!this.hitPaddle && collided && paddle_angle_collision(this.angle)) {
            this.speed = gameSpeed / 1.65;
            this.hitPaddle = true;
            ++totalScore;
            if(charged < 20) ++charged;
          } else if (collided) {
            this.speed = -(gameSpeed / 2);
            this.hitPaddle = true;
          } else if (!this.hitPaddle) {
            this.speed = -(gameSpeed / 2);
          } else if (this.hitPaddle) {
            this.speed = gameSpeed / 2;
          }

          if (!this.dead) { //if not hit
            if(!this.stop){
              this.y += this.speed; //move
              this.image.Y += this.speed; //move
            }
            if (this.y < 10) {
              this.dead = true; //if reached information          
              --totalScore;
              ++unrest;
            }
            if (this.y > canvas.height && this.speed > 0) {
              this.dead = true;
            }
          } else {
            if (this.deathTimer > 0) { //death timer decrease
              this.deathTimer--;
            }
          }

          //console.log(this.angle);
          this.x = -(Math.cos(this.angle) * this.y);
          this.Y = -(Math.sin(this.angle) * this.y);
          //console.log(this.x + ", " + this.Y);

        };
      }
      /*


      
      */
      function Wave() {
        this.x = 0;
        this.y = 0;
        this.r = 117;
        this.speed = gameSpeed;
        this.offScreen = false;

        this.update = function() {
          this.speed = gameSpeed;
          this.r += this.speed;
          if (this.r > canvas.width + 200) {
            this.offScreen = true;
          }
        };

        this.draw = function() {
          context.beginPath();
          context.restore();
          context.closePath();
          context.arc(canvas.width / 2, canvas.height / 2, this.r, 0, 2 * Math.PI, false);
          context.strokeStyle = 'red';
          context.stroke();
          context.closePath();

        };

      }

      /*
       * 
       *      helper functions
       * 
       */

      function add_radar() { //clean up 
        var finalAngle = paddleAngle - .2;
        var shots = 1;
        if (reload == reloadMax) { //5 shots
          for (var i = 0; i < 5; ++i) {
            radars.push(new Radar(finalAngle));
            finalAngle += .1;
          }
        } else if (reload > reloadMax / 2.6) { //3 shots
          for (var i = 0; i < 3; ++i) {
            radars.push(new Radar(finalAngle + .1));
            finalAngle += .1;
          }
        } else radars.push(new Radar(finalAngle + .2)); //1 shot         
        reload = 0;
      }

      function new_access() {
        if (accesses.length < 8) {
          if (Math.random() < accessSpawnRate) {
            accesses.push(new Access((2 * Math.PI) * Math.random(), 800));
          }
        }
      }

      function new_leaks() {
        if (leaks.length < 4) {
          if (Math.random() < leakSpawnRate) {
            leaks.push(new Leak());
          }
        }
      }
      
      function new_hacks() {
        if (hackers.length < 1) {
          if (Math.random() < hackSpawnRate) {
            var temp = new Hacker();
            hackers.push(temp);
          }
        }
      }

      function new_socials() {
        if (Math.random() < socialSpawnRate) {
          var temp = new Social(0, (2 * Math.PI) * Math.random(), 800);
          socials.push(temp);
        }
      }

      function new_medias() {
        if (Math.random() < mediaSpawnRate) {
          var temp = new Media();
          medias.push(temp);
        }
      }

      //should be member of paddle
      function paddle_angle_collision(angle) {
        var delta = Math.abs(angle - paddleAngle);
        if (delta > Math.PI) {
          delta = 2 * Math.PI - delta;
        }
        return delta < .7;
      }

      function interior_circle_collision(y1, y2, r1, r2) {
        var dy = y2 - y1;
        var radii = Math.abs(r1 - r2);
        return (dy < radii);
      }

      function exterior_circle_collision(y1, y2, r1, r2) {
        var dy = y2 - y1;
        var radii = r1 + r2;
        return (-dy < radii);
      }

      function cartesian_circle_collision(x1, y1, x2, y2, r1, r2) {
        //console.log(x1 + ", " + y1 + ", " + x2 + ", " + y2 + ", " + r1 + ", " + r2)
        var dx = x2 - x1;
        var dy = y2 - y1;
        var radii = r1 + r2;
        //console.log(dx + ", " + dy + ", " + radii)

        return ((dx * dx) + (dy * dy) < (radii * radii));
      }

      function getmousePosPolar(canvas, evt) {
        //var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - (canvas.width / 2),
          y: (evt.clientY - (canvas.height / 2)) * -1
        }
      }

      function getmousePosCart(canvas, evt) {
        //var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX,
          y: evt.clientY 
        }
      }

      /*
       * 
       *      Update
       * 
       */

      function update() {
        //update spawnrate
        hackSpawnRate = .002 * gameSpeed;
        accessSpawnRate = .002 * gameSpeed;
        leakSpawnRate = .001 * gameSpeed;
        socialSpawnRate = .0003 * gameSpeed;
        mediaSpawnRate = .0003 * gameSpeed;

        if (unrest >= 30 && !gameLeak) {
          unrest = 0;
          if (Math.random() > .66) blackbar.active = true;     
          else if(Math.random() > .5) googlesearch.active = true;
          else stamp.active = true;         
          gameLeak = true;
        }
        if (gameLeak) {
          gameSpeed = 1;
        } else {
          if (gameSpeed < 10) {
            ++gameSpeed;
          }
        }

        if (reload != reloadMax) reload++;

        if (totalScore < 0) {
          totalScore = 0;
        }

        if (totalScore < 10 && !stage1) {
          accessSpawnRate = .03;
          leakSpawnRate = .02;

          stage1 = true;
          stage2 = false;
          stage3 = false;
        } else if (totalScore >= 10 && totalScore < 20 && !stage2) {
          accessSpawnRate = .04;
          leakSpawnRate = .03;

          stage1 = false;
          stage2 = true;
          stage3 = false;
        } else if (totalScore >= 20 && !stage3) {
          accessSpawnRate = .05;
          leakSpawnRate = .04;

          stage1 = false;
          stage2 = false;
          stage3 = true;
        }

        for (var i = 0; i < radars.length;) {
          if (!radars[i].dead) {
            radars[i].update();
            ++i;
          } else {
            radars.splice(i, 1);
          }
        }

        for (var i = 0; i < accesses.length;) {
          if (!accesses[i].dead) {
            accesses[i].update();
            ++i;
          } else {
            accesses.splice(i, 1);
          }
        }

        for (var i = 0; i < leaks.length;) {
          if (!leaks[i].dead) {
            leaks[i].update();
            ++i;
          } else {
            leaks.splice(i, 1);
          }
        }
        
        for (var i = 0; i < hackers.length;) {
          if (!hackers[i].dead) {
            hackers[i].update();
            ++i;
          } else {
            hackers.splice(i, 1);
          }
        }

        for (var i = 0; i < socials.length;) {
          if (!socials[i].dead) {
            socials[i].update();
            ++i;
          } else {
            socials.splice(i, 1);
          }
        }

        for (var i = 0; i < medias.length;) {
          if (!medias[i].dead) {
            medias[i].update();
            ++i;
          } else {
            medias.splice(i, 1);
          }
        }

        if (waveFired) {
          if(!wave.offScreen) {
            wave.update();
          }
        }

        new_access();
        new_leaks();
        new_hacks();
        new_socials();
        new_medias();
        writeMessage(canvas, radars.length);
        if (blackbar.active) blackbar.update();
        if (stamp.active) stamp.update();
        if (googlesearch.active) googlesearch.update();
      }

      /*
       * 
       *      DRAW
       * 
       */

      function draw() {
        canvas.width = canvas.width;
        context.fillStyle = '#F0F0F0';
        context.fillRect(0, 0, canvas.width, canvas.height); //background

        paddle.draw();

        for (var iter = 0; iter < radars.length; iter++) {
          radars[iter].draw();
        }

        context.beginPath(); //arc path
        context.restore();
        context.closePath();
        context.arc(canvas.width / 2, canvas.height / 2, 105, 0, 2 * Math.PI, false);
        context.stroke();
        context.closePath();

        context.beginPath(); //information circle
        context.restore();
        context.closePath();
        context.arc(canvas.width / 2, canvas.height / 2, 30, 0, 2 * Math.PI, false);
        context.strokeStyle = 'red';
        context.stroke();
        context.closePath();

        for (var iter = 0; iter < accesses.length; iter++) {
          accesses[iter].draw();
        }
        for (var iter = 0; iter < leaks.length; iter++) {
          leaks[iter].draw();
        }
        for (var iter = 0; iter < hackers.length; iter++) {
          hackers[iter].draw();
        }
        for (var iter = 0; iter < socials.length; iter++) {
          socials[iter].draw();
        }
        for (var iter = 0; iter < medias.length; iter++) {
          medias[iter].draw();
        }

        if (waveFired) wave.draw();

        context.font = '18pt Calibri';
        context.fillStyle = 'black';

        var scoreOffset = -6; //offset for when digits are in the tens

        if (totalScore > 9) {
          scoreOffset -= 5 * Math.floor(Math.log10(totalScore));
        }
        if (totalScore < 0) {
          totalScore = 0;
        }
        context.fillText(totalScore, canvas.width / 2 + scoreOffset, canvas.height / 2 + 7);

        if (blackbar.active) blackbar.draw();
        if (stamp.active) stamp.draw();
        if (googlesearch.active) googlesearch.draw();
      }


      /*

        handle key events
        
      */

      canvas.addEventListener('mousemove', function(evt) {
        if (blackbar.active) blackbar.findxy('move', evt)
        mousePosPolar = getmousePosPolar(canvas, evt);
        mousePosCart = getmousePosCart(canvas, evt);

        if (!gameLeak) {
          var xPos = mousePosPolar.x > 0;
          var yPos = mousePosPolar.y > 0;
          paddleAngle = Math.atan(Math.abs((mousePosPolar.y) / (mousePosPolar.x)));
          if (xPos && !yPos) {
            paddleAngle = 2 * Math.PI - paddleAngle;
          } else if (!xPos && yPos) {
            paddleAngle = Math.PI - paddleAngle;
          } else if (!xPos && !yPos) {
            paddleAngle += Math.PI
          }
          paddleAngle += Math.PI;
          if (paddleAngle > 2 * Math.PI) {
            paddleAngle -= 2 * Math.PI;
          } // align with mouse hack
        }
      }, false);

      function clickEvent() {
        if (stamp.active) add_classify();
        if (!gameLeak) add_radar();
      }

      canvas.addEventListener("click", clickEvent);

      function writeMessage(canvas, message) {
        var context = canvas.getContext('2d');
        context.font = '18pt Calibri';
        context.fillStyle = 'black';
        context.fillText(("Unrest: " + unrest + "/30 | Charged: " + charged + "/20"), 10, 25);
      }

      function shootWave() {
        if (charged == 20) {
          wave = new Wave();
          waveFired = true;
        }
      }

      function keyFunc(evt) {
        if (evt.keyCode == "32") {
          //shootWave();
        }
      }

      document.addEventListener("keydown", keyFunc);

      function game_loop() {
        draw();
        update();
      }
      setInterval(game_loop, 30);
