const RIGHT = 1;
const LEFT = -1;

const DOWN = 1;
const IDLE = 0;
const UP = -1;

var $ball = document.querySelector(".ball");
var $scene = document.querySelector(".playground");

// On mesure les éléments en JS, pour ne pas avoir de "nombres magiques"
var sceneWidth = $scene.offsetWidth;
var sceneHeight = $scene.offsetHeight;

var ballWidth = $ball.offsetWidth;
var ballHeight = $ball.offsetHeight;

/**
 * Position limite de la balle a droite de la scene
 */
var limitTop = 0;
var limitBottom = sceneHeight - ballHeight;
var limitLeft = 0;
var limitRight = sceneWidth - ballWidth;

const position = {
  x: sceneWidth / 2,
  y: sceneHeight / 2,
};

const direction = {
  x: LEFT,
  y: DOWN,
};

const speed = {
  x: 8,
  y: 3,
};

var racketInterval = 20;
var $racketLeft = document.querySelector('#racket1');
var $racketRight = document.querySelector('#racket2');

const SPEED_MOVE = 10;

const playerLeft = {
  direction: IDLE,
  points: 0
};
const playerRight = {
  direction: IDLE,
  points: 0
};

window.addEventListener('keydown', function (event) {
  if (event.code === 'KeyW') {
    playerLeft.direction = UP;
  } else if (event.code === 'KeyS') {
    playerLeft.direction = DOWN;
  }
  if (event.code === 'ArrowUp') {
    playerRight.direction = UP;
  } else if (event.code === 'ArrowDown') {
    playerRight.direction = DOWN;
  }
});

function moveRacket($racket, direction) {
  var racket = $racket.offsetTop + direction * SPEED_MOVE;
  if (racket <= limitTop && direction === UP) racket = limitTop;
  if (racket + $racket.offsetHeight >= limitBottom && direction === DOWN) racket = sceneHeight - $racket.offsetHeight;
  $racket.style.top = `${racket}px`;
}

function moveBall() {
  // Calc the x ball position
  var horizontalDisplacement = direction.x * speed.x;
  position.x = position.x + horizontalDisplacement;

  /**
   * Change the position og the ball is whe have off screen risk
   */
  if (position.x >= limitRight) {
    position.x = limitRight;
    direction.x = LEFT;
    playerLeft.points++;
  } else if (position.x <= limitLeft) {
    position.x = limitLeft;
    direction.x = RIGHT;
    playerRight.points++;
  }

  // Calc the y ball position
  var verticalDisplacement = direction.y * speed.y;
  position.y = position.y + verticalDisplacement;

  /**
   * Change the position og the ball is whe have off screen risk
   */
  if (position.y >= limitBottom) {
    position.y = limitBottom;
    direction.y = UP;
  } else if (position.y <= limitTop) {
    position.y = limitTop;
    direction.y = DOWN;
  }

  collisionLeft();
  collisionRight();

  // View
  $ball.style.left = `${position.x}px`;
  $ball.style.top = `${position.y}px`;
}

function collisionLeft() {
  var borderRight = $racketLeft.offsetWidth + $racketLeft.offsetLeft;
  var limitTop = $racketLeft.offsetTop - $ball.offsetHeight <= $ball.offsetTop;
  var limitBottom = $racketLeft.offsetTop + $racketLeft.offsetHeight + $ball.offsetHeight >= $ball.offsetTop + $ball.offsetHeight;
  if (borderRight >= $ball.offsetLeft) {
    if (limitTop) {
      if (limitBottom) {
        direction.x = RIGHT;
      }
    }
  }
}

function collisionRight() {
  var limitTop = $racketRight.offsetTop - $ball.offsetHeight <= $ball.offsetTop;
  var limitBottom = $racketRight.offsetTop + $racketRight.offsetHeight + $ball.offsetHeight >= $ball.offsetTop + $ball.offsetHeight;
  if ($racketRight.offsetLeft <= $ball.offsetLeft + $ball.offsetWidth) {
    if (limitTop) {
      if (limitBottom) {
        direction.x = LEFT;
      }
    }
  }
}

$countLeft = document.querySelector('.count-left');
$countRight = document.querySelector('.count-right');

function pointsCount() {
  $countLeft.innerText = playerLeft.points;
  $countRight.innerText = playerRight.points;
}

/**
 * GAME SECTION
 */

function render() {
  moveRacket($racketLeft, playerLeft.direction);
  moveRacket($racketRight, playerRight.direction);
  moveBall();
  pointsCount();
}

var interval;

function isRunning() {
  return interval !== null && interval !== undefined;
}

function startGame() {
  interval = setInterval(render, 10);
}

function idleGame() {
  clearInterval(interval);
  interval = null;
}

window.addEventListener("keyup", function (event) {
  if (event.code === "Space") {
    if (isRunning()) {
      idleGame();
    } else {
      startGame();
    }
  }
  if (event.code === 'KeyW' || event.code === 'KeyS') {
    playerLeft.direction = IDLE;
  }
  if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
    playerRight.direction = IDLE;
  }
});

startGame();