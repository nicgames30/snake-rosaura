
const divGame = document.getElementById('divGame');
const nDentes = document.getElementById('nDentes');
const pointsDentes = document.getElementById('pointsDentes');
const canvas = document.getElementById('gameCanvas');

const ctx = canvas.getContext('2d');
const scale = 40;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
const speed = 0.5;

let gameInterval = null;

const totalDentes = 30;

let snake;

const start = () => {
  divGame.style.display = "flex";
  divStart.style.display = "none";
  divSuccess.style.display = "none";

  setup();
}

const stop = () => {
  clearInterval(gameInterval);
  divSuccess.style.display = "flex";
  divGame.style.display = "none";
}

function setup() {
  snake = new Snake();
  fruit = new Fruit();
  fruit.pickLocation();

  gameInterval = window.setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fruit.draw();
    snake.update();
    snake.draw();

    if (snake.eat(fruit)) {
      fruit.pickLocation();

      if (snake.total == totalDentes) {
        stop();
      }
    }

    snake.checkCollision();
    // document.querySelector('.score').innerText = snake.total;
  }, 250);
}

window.addEventListener('keydown', (e) => {
  const direction = e.key.replace('Arrow', '');
  snake.changeDirection(direction);
});

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xSpeed = scale * speed;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];

  this.draw = function () {
    ctx.fillStyle = '#FFFFFF';

    const corpo = new Image();
    corpo.src = './part-1.png';

    pointsDentes.innerHTML = '';
    nDentes.innerHTML = this.tail.length;

    for (let i = 0; i < this.tail.length; i++) {
      ctx.drawImage(corpo, this.tail[i].x, this.tail[i].y, scale, scale);

      const dente = new Image();
      dente.src = './dente.png';
      pointsDentes.appendChild(dente)
    }

    const cabeca = new Image();
    cabeca.src = './image-1.png';
    ctx.drawImage(cabeca, this.x, this.y, scale, scale); 
    ctx.fill();
  };

  this.update = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    this.tail[this.total - 1] = { x: this.x, y: this.y };

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x >= canvas.width) {
      this.x = 0;
    }

    if (this.y >= canvas.height) {
      this.y = 0;
    }

    if (this.x < 0) {
      this.x = canvas.width - scale;
    }

    if (this.y < 0) {
      this.y = canvas.height - scale;
    }
  };

  this.changeDirection = function (direction) {
    switch (direction) {
      case 'Up':
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = -scale * speed;
        }
        break;
      case 'Down':
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = scale * speed;
        }
        break;
      case 'Left':
        if (this.xSpeed === 0) {
          this.xSpeed = -scale * speed;
          this.ySpeed = 0;
        }
        break;
      case 'Right':
        if (this.xSpeed === 0) {
          this.xSpeed = scale * speed;
          this.ySpeed = 0;
        }
        break;
    }
  };

  this.eat = function (fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.total++;
      return true;
    }

    return false;
  };

  this.checkCollision = function () {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        this.total = 0;
        this.tail = [];
      }
    }
  };
}

function Fruit() {
  this.x;
  this.y;

  this.pickLocation = function () {
    this.x = (Math.floor(Math.random() * columns - 1) + 1) * scale;
    this.y = (Math.floor(Math.random() * rows - 1) + 1) * scale;
  };

  this.draw = function () {
    // ctx.fillStyle = '#000';
    // ctx.fillRect(this.x, this.y, scale, scale);
    var pic = new Image();
    pic.src = "./dente.png";
    ctx.drawImage(pic, this.x, this.y, scale, scale); 
  };
}
