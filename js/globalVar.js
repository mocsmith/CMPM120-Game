      //V12

      var canvas = document.getElementById('orbit');
      var context = canvas.getContext('2d');
      /* 
       * 
       *      images
       * 
       */

      var hackSpawnRate = .02;
      var accessSpawnRate = .02;
      var leakSpawnRate = .01;
      var socialSpawnRate = .003;
      var mediaSpawnRate = .003;

      var gameLeak = false;
      var unrest = 0;

      var charged = 0;
      var wave;
      var waveFired = false;

      var clickCount = 0;

      var totalScore = 0;

      var gameSpeed = 10;

      var paddleAngle = 0;

      var stage1 = true;
      var stage2 = false;
      var stage3 = false;

      var mousePosPolar = 0;      
      var mousePosCart = 0;