enchant(); // initialize
var game = new Core(1000, 730); // game stage
game.scale = 1;
game.fps = 60;
game.started = false;
game.distance = 0; // initial value, don't change

// settings
game.gravity = 0.1;
game.flap_strength = 3.0;
game.fly_speed = 2;
game.obstacle_frequency = 300;


var obstacles = new Group();

var scoreBoard = new Label();
scoreBoard.text = 0;
scoreBoard.color = '#FFF';
scoreBoard.font = 'Arial';
scoreBoard.scaleX = 5;
scoreBoard.scaleY = 5;
scoreBoard.textAlign = 'center';
scoreBoard.x = game.width/2 - scoreBoard.width/2;
scoreBoard.y = 40;


// preload assets
game.preload('assets/avatar.png');
game.preload('assets/avatar2.png');
game.preload('assets/avatar3.png');
game.preload('assets/background.png');
game.preload('assets/gameover.png');
game.preload('assets/getready.png');
game.preload('assets/ground.png');
game.preload('assets/instructions.png');
game.preload('assets/obstacle_top.png');
game.preload('assets/obstacle_bottom.png');

// initialize game
game.onload = function(){

  // add the background
  game.bg = new Sprite(1000,730);
  game.bg.image = game.assets['assets/background.png'];
  
  // #1 add game.bg to rootScene
  game.rootScene.addChild(game.bg);


  // #9 add obstacles to rootScene
  game.rootScene.addChild(obstacles);


  // #16 add scoreBoard to rootScene
  game.rootScene.addChild(scoreBoard);


  // add the start game screen
  game.getready = new Sprite(592,177);
  game.getready.image = game.assets['assets/getready.png'];
  game.getready.x = (game.width / 2) - (game.getready.width / 2);
  game.getready.y = (game.height / 2) - (game.getready.height / 2);

  // #2 add game.getready to rootScene
  game.rootScene.addChild(game.getready);

  // add the floor
  game.ground = new Sprite(1000,86);
  game.ground.image = game.assets['assets/ground.png'];
  game.ground.x = 0;
  game.ground.y = game.height - 48;
  
  // #3 add game.ground to rootScene
  game.rootScene.addChild(game.ground);

  // add the main character
  game.avatar = new Sprite(87,55);
  game.avatar.image = game.assets['assets/avatar2.png'];
  game.avatar.x = 100;
  game.avatar.y = 100;
  game.avatar.ySpeed = 0;

  // #4 add game.avatar to rootScene

  game.rootScene.addChild(game.avatar);

  // add the instructions
  game.instructions = new Sprite(420,22);
  game.instructions.image = game.assets['assets/instructions.png'];
  game.instructions.x = (game.width/2) - (game.instructions.width/2);
  game.instructions.y = 460;

  // #5 add game.instructions to rootScene
  game.rootScene.addChild(game.instructions);

  game.rootScene.addEventListener(enchant.Event.TOUCH_END, game_touched);
}; // end game.onload #initialize game

// listen for tap/click
function game_touched(){
  if(game.started){
    
    // #7 flap
    game.avatar.ySpeed = -game.flap_strength;

  }else{
    
    // #6 start game
    game.started = true;

    // #6 remove getready and instructions
    game.rootScene.removeChild(game.getready);
    game.rootScene.removeChild(game.instructions);

  }
}

// game loop
game.onenterframe = function(){
  if(game.started){
    game.avatar.ySpeed += game.gravity;
    game.avatar.y += game.avatar.ySpeed;

    // check if bird touches floor, or ceiling
    if(
       game.avatar.y+game.avatar.height > game.ground.y ||
       game.avatar.y < 0
    ){

      // #13 end the game if avatar touches floor or ceiling
      gameover();

    }

    // #10 move obstacles to the left
    obstacles.x -= game.fly_speed;


    // track flying progress
    game.distance += game.fly_speed;

    // check if we need to spawn obstacle
    if(game.distance % game.obstacle_frequency === 0){
      
      // #11 spawn obstacle
      spawnObstacle();
      
      // clean up old obstacles
      for (var i = 0; i < obstacles.childNodes.length; i++) {
        if(obstacles.childNodes[i].x + obstacles.x + 100 < -85){
          obstacles.removeChild(obstacles.childNodes[i]);
        }
      }
    } // end if spawn obstacle

    // collision detection
    for (var i = 0; i < obstacles.childNodes.length; i++) {
      if(game.avatar.intersect(obstacles.childNodes[i])){

        // #12 end the game if player hits obstacle
        gameover();

      }else if( // check for score
        !obstacles.childNodes[i].scored &&
        obstacles.childNodes[i].y < 0 &&
        obstacles.childNodes[i].x +
        obstacles.childNodes[i].width -
        game.distance < game.avatar.x
      ){
        obstacles.childNodes[i].scored = true;

        // #17 increment score by 1
        scoreBoard.text++;
      }
    }
    
  }
}; // end game.onenterframe #game loop

function spawnObstacle(){

  var pos = (Math.random()*400) + 240;
  var gap = 200;

  var top = new Sprite(85, 545);
  top.image = game.assets['assets/obstacle_top.png'];
  top.x = -obstacles.x + game.width;
  top.y = -550 + pos - gap;

  // #8 add top obstacle to obstacles group
  obstacles.addChild(top);

  var bottom = new Sprite(85, 545);
  bottom.image = game.assets['assets/obstacle_bottom.png'];
  bottom.x = -obstacles.x + game.width;
  bottom.y = pos;
  
  // #8 add bottom obstacle to obstacles group
  obstacles.addChild(bottom);

} // end spawnObstacle

function gameover(){
  // add the instructions
  game.gameover = new Sprite(602,163);
  game.gameover.image = game.assets['assets/gameover.png'];
  game.gameover.x = (game.width/2) - (game.gameover.width/2);
  game.gameover.y = 120;

  // #14 show gameover graphic
  game.rootScene.addChild(game.gameover);

  game.rootScene.addEventListener(enchant.Event.TOUCH_END,function(){
    window.location.reload();
  });

  // #15 stop the game loop
  game.onenterframe = null;

}

game.start();