      //V12

      var canvas = document.getElementById('orbit');
      var context = canvas.getContext('2d');
      /* 
       * 
       *      images
       * 
       */

      var gameSpeed = 10; //10 is full speed

      var hackSpawnRate = .002 * gameSpeed;
      var accessSpawnRate = .002 * gameSpeed;
      var leakSpawnRate = .001 * gameSpeed;
      var socialSpawnRate = .0003 * gameSpeed;
      var mediaSpawnRate = .0003 * gameSpeed;

      var gameLeak = false;
      var unrest = 0;

      var charged = 0;
      var wave;
      var waveFired = false;

      var clickCount = 0;

      var totalScore = 0;


      var paddleAngle = 0;

      var stage1 = true;
      var stage2 = false;
      var stage3 = false;

      var mousePosPolar = 0;      
      var mousePosCart = 0;