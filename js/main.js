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

        this.update = function() {
          this.speed = gameSpeed / 1.4;
          this.y += this.speed;

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
        };

        this.draw = function() {
          context.save();
          context.translate(canvas.width / 2, canvas.height / 2); //move to center
          context.rotate(-this.angle + Math.PI / 2);

          context.beginPath();
          context.fillStyle = 'green';
          context.arc(0, this.y, 10, 0, 2 * Math.PI, false); //purple circle
          context.fill();
          context.closePath();
          context.restore();
        };
      }
      var radars = new Array();
      var reloadMax = 20;
      var reload = reloadMax;

      /*
    
          access(attacking enemy)
    
      */
      function Access() {
        this.deathTimer = 10; //delay between dying and not being drawn
        this.dead = false; //used to see if it alive
        this.speed = -gameSpeed / 1.65;
        this.angle = (2 * Math.PI) * Math.random();
        this.y = 800; //make sure it is off screen
        this.x = 0;
        this.Y = 0;
        this.hitPaddle = false;
        this.waveCollided = false;
        
        this.draw = function() {
          if (this.deathTimer > 0) { //if alive
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2); //move to center
            context.rotate(-this.angle + Math.PI / 2);

            context.beginPath();
            context.fillStyle = 'purple';
            context.arc(0, this.y, 10, 0, 2 * Math.PI, false); //purple circle
            context.fill();
            context.closePath();
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

        this.draw = function() {
          if (this.deathTimer > 0) { //if alive
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2); //move to center
            context.rotate(-this.angle + Math.PI / 2); //rotate to mouse

            context.beginPath();
            context.fillStyle = 'red';
            context.arc(0, this.y, 10, 0, 2 * Math.PI, false); //purple circle
            context.fill();
            context.closePath();
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
      
      function Hacker() {
        this.deathTimer = 10; //delay between dying and not being drawn
        this.dead = false; //used to see if it alive
        this.speed = -gameSpeed;
        this.angle = (2 * Math.PI) * Math.random();
        this.y = 800; //make sure it is off screen
        this.x = 0;
        this.Y = 0;
        this.hitPaddle = false;
        this.waveCollided = false;
        
        this.draw = function() {
          if (this.deathTimer > 0) { //if alive
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2); //move to center
            context.rotate(-this.angle + Math.PI / 2);

            context.beginPath();
            context.fillStyle = 'black';
            context.arc(0, this.y, 10, 0, 2 * Math.PI, false); //purple circle
            context.fill();
            context.closePath();
            context.restore();
          }
        };

        this.update = function() {
          //console.log(this.y);

          var collided = exterior_circle_collision(this.y, 0, 10, 107);
          
          //gamespeed HACK
          if (!this.hitPaddle && collided && paddle_angle_collision(this.angle)) {
            this.speed = gameSpeed;
            this.hitPaddle = true;
            ++totalScore;
            if(charged < 20) ++charged;
          } else if (collided) {
            this.speed = -(gameSpeed);
            this.hitPaddle = true;
          } else if (!this.hitPaddle) {
            this.speed = -(gameSpeed);
          } else if (this.hitPaddle) {
            this.speed = gameSpeed;
          }

          if (!this.dead) { //if not hit
            this.y += this.speed; //move
            this.angle += .01;
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
        } else if (reload > reloadMax / 3) { //3 shots
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
            accesses.push(new Access());
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
            //hackers.push(temp);
            //hackers.push(temp);
          }
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

        if (unrest >= 10 && !gameLeak) {
          unrest = 0;
         // if (Math.random() > .5)
           blackbar.active = true;
          //else stamp.active = true;         
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

        if (waveFired) {
          if(!wave.offScreen) {
            wave.update();
          }
        }

        new_access();
        new_leaks();
        new_hacks();
        writeMessage(canvas, radars.length);
        if (blackbar.active) blackbar.update();
        if (stamp.active) stamp.update();
      }

      /*
       * 
       *      DRAW
       * 
       */

      function draw() {
        canvas.width = canvas.width;
        context.fillStyle = 'white';
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