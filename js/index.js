window.onload = () => {
  const CAR_RATIO = 4;
  const CAR_SPEED = 10;
  const CAR_MAX_DELTA = 40;
  const OBSTACLE_SPEED = 3;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Main Classes / Functions

  class Car {
    constructor () {
      this.initialX = 0;
      this.initialY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
      this.img = null;
    }

    loadImg() {
      //console.log('Loading car image');
      let img = new Image();
      img.src = "../images/car.png";
      img.onload = ((e) => {
        this.img = img;
        this.img.height = car.img.naturalHeight / CAR_RATIO;
        this.img.width = car.img.naturalWidth / CAR_RATIO;
      });
    }

    draw() {
      //console.log("Draw car image");
      if (this.img) {
        this.initialX = canvas.width/2 - this.img.width/2 + this.deltaX;
        this.initialY = canvas.height/2 - this.img.height/2 + this.deltaY;
        ctx.drawImage(this.img, this.initialX + this.deltaX, this.initialY + this.deltaY, this.img.width, this.img.height);
      }
    }

    moveCarLeft() {
      this.deltaX = Math.max(-CAR_MAX_DELTA, this.deltaX - CAR_SPEED);
    }

    moveCarRight() {
      this.deltaX = Math.min(CAR_MAX_DELTA, this.deltaX + CAR_SPEED);
    }
  }

  class Obstacle {
    constructor () {
      this.x = Math.floor(40 + Math.random() * 180 );
      this.y = 0;
      this.height = 20;
      this.width = Math.floor(50 + Math.random() * (195 - this.x - 35) );
      this.speed = OBSTACLE_SPEED;
      this.color = 'darkRed';
    }

    draw() {
      //console.log('Draw obstacle')
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      this.y += this.speed;
    }
  }

  const adjCanvas = () => {
    //console.log("Adjusting Canvas");
    canvas.width = 282; // image.naturalWidth
    canvas.height = 441; // image.naturalHeight
  };

  const drawRoad = () => {
    // console.log("Drawing road");
    ctx.drawImage(roadImg, 0, 0);
  };

  const drawScore = () => {
    // console.log("Drawing score");
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${score}`, 45, canvas.height - 10);
  };

  const checkForCollisions = (car, obstacles) => {
    let result = false;
    obstacles.forEach((obstacle) => {
    if (car.initialX + car.deltaX < obstacle.x + obstacle.width &&
      car.initialX + car.deltaX + car.img.width > obstacle.x &&
      car.initialY + car.deltaY < obstacle.y + obstacle.height &&
      car.initialY + car.deltaY + car.img.height > obstacle.y) {
        result = true;
    }
    });
    return result;
  };

  const drawGameOverScreen = () => {
      // Clear screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Game Over!`, canvas.width / 2, canvas.height / 2 - 40);

      ctx.fillStyle = "white";
      ctx.font = "26px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
  }

  // Functions that group prior actions
  const loadGame = () => {
    adjCanvas();
    car.loadImg();
    setTimeout(() => {
      car.draw();  
    }, 50);
    roadImg.src = "../images/road.png";
    roadImg.onload = ((e) => {
      drawRoad();
      drawScore();
    });
  };

  const animate = () => {
    //console.log("Animate");

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Iterate
    drawRoad();
    car.draw();
    obstacles.forEach((obstacle) => obstacle.draw());

    // Update score
    score = obstacles.filter((obstacle => obstacle.y > (car.initialY + car.deltaY + car.img.height))).length;
    drawScore();
  
    // Check if game over
    gameOver = checkForCollisions(car, obstacles);

    //Animate
    if(!gameOver) {
      animateId = window.requestAnimationFrame(animate);
    } else {
      drawGameOverScreen();
    }
  };

  // Code to be run
  let car = new Car();
  let obstacles = [];
  let score = 0;
  let gameOver = false;
  let roadImg = new Image();
  loadGame();

  document.getElementById('start-button').onclick = () => {
    setInterval(() => {
      obstacles.push(new Obstacle());
    }, 3000);
    animate();
  };
  
  document.onkeydown = (e) => {
    switch (true) {
      case (e.keyCode === 37):
        car.moveCarLeft();
        break;
      case (e.keyCode === 39):
        car.moveCarRight();
        break; 
      default:
        break;
    }
  };
};
