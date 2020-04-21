document.addEventListener('DOMContentLoaded', function () {
  /**
   * Create value for direction calcul
   */
  const RIGHT = 1;
  const LEFT = -1;

  const DOWN = 1;
  const IDLE = 0;
  const UP = -1;

  /**
   * Game selection
   */
  var $ball = document.querySelector(".ball");
  var $scene = document.querySelector(".playground");

  /**
   * Scene and Ball size
   */
  var sceneWidth = $scene.offsetWidth;
  var sceneHeight = $scene.offsetHeight;

  var ballWidth = $ball.offsetWidth;
  var ballHeight = $ball.offsetHeight;

  /**
   * Screen limits for rackets and ball
   */
  var limitTop = 0;
  var limitBottom = sceneHeight - ballHeight;
  var limitLeft = 0;
  var limitRight = sceneWidth - ballWidth;

  /**
   * Init positions and speed
   */
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

  /**
   * Generate and init rackets
   */
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

  /**
   * Add event key for rackets
   */
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

  // ---------------|
  // Game functions |
  // ---------------|

  /**
   * This function give the ability to move the rackets
   * @param {Racket} $racket The object of the racket element
   * @param {number} direction The value +1/-1 of the direction
   */
  function updateRacket($racket, direction) {
    var racketHeight = $racket.offsetHeight;
    var racket = $racket.offsetTop + direction * SPEED_MOVE;
    if (racket <= limitTop && direction === UP) racket = limitTop;
    if (racket + racketHeight >= limitBottom && direction === DOWN) racket = sceneHeight - racketHeight;
    $racket.style.top = `${racket}px`;
  }

  /**
   * Generate the ball movement and change direction when collision
   */
  function updateBall() {
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

  /**
   * Check if the left racket collide the ball
   */
  function collisionLeft() {
    var borderRight = $racketLeft.offsetWidth + $racketLeft.offsetLeft;
    var limitTop = $racketLeft.offsetTop - ballHeight <= $ball.offsetTop;
    var limitBottom = $racketLeft.offsetTop + $racketLeft.offsetHeight + ballHeight >= $ball.offsetTop + ballHeight;
    if (borderRight >= $ball.offsetLeft) {
      if (limitTop) {
        if (limitBottom) {
          direction.x = RIGHT;
        }
      }
    }
  }

  /**
   * Check if the right racket collide the ball
   */
  function collisionRight() {
    var limitTop = $racketRight.offsetTop - ballHeight <= $ball.offsetTop;
    var limitBottom = $racketRight.offsetTop + $racketRight.offsetHeight + ballHeight >= $ball.offsetTop + ballHeight;
    if ($racketRight.offsetLeft <= $ball.offsetLeft + ballWidth) {
      if (limitTop) {
        if (limitBottom) {
          direction.x = LEFT;
        }
      }
    }
  }

  /**
   * Init the point table
   */
  $countLeft = document.querySelector('.count-left');
  $countRight = document.querySelector('.count-right');

  /**
   * Update the point table
   */
  function pointsCount() {
    $countLeft.innerText = playerLeft.points;
    $countRight.innerText = playerRight.points;
  }

  /**
   * Update the screen render
   */
  function render() {
    updateRacket($racketLeft, playerLeft.direction);
    updateRacket($racketRight, playerRight.direction);
    updateBall();
    pointsCount();
  }

  /**
   * GAME SECTION
   */

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

  startGame();
});