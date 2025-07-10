
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const replayBtn = document.getElementById("replayBtn");

const colors = ["green", "blue", "pink", "purple", "orange"];
let eggs = [];
let paddle = { x: 150, y: 550, width: 100, height: 10 };
let score = 0;
let gameRunning = false;
let lives = 3;

function createEggs() {
  eggs = [];
  for (let i = 0; i < 5; i++) {
    eggs.push({
      x: Math.random() * 350 + 25,
      y: Math.random() * 200 + 50,
      vy: 2 + Math.random() * 2,
      radius: 15,
      color: colors[i]
    });
  }
}

function drawEgg(egg) {
  ctx.beginPath();
  ctx.fillStyle = egg.color;
  ctx.ellipse(egg.x, egg.y, egg.radius, egg.radius * 1.3, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPaddle() {
  ctx.fillStyle = "#ff1493";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  eggs.forEach(drawEgg);
  drawPaddle();
}

function update() {
  for (let egg of eggs) {
    egg.y += egg.vy;

    if (
      egg.y + egg.radius * 1.3 >= paddle.y &&
      egg.x >= paddle.x &&
      egg.x <= paddle.x + paddle.width
    ) {
      egg.vy *= -1.05;
      egg.y = paddle.y - egg.radius * 1.3;
      score++;
      playBounceSound();
    }

    if (egg.y - egg.radius * 1.3 <= 0) {
      egg.vy *= -1;
    }

    if (egg.y > canvas.height) {
      playCrackSound();
      egg.y = Math.random() * 200 + 50;
      egg.vy = 2 + Math.random() * 2;
      lives--;
      if (lives <= 0) {
        endGame();
        return;
      }
    }
  }

  draw();
  scoreEl.textContent = "Score: " + score + " | Lives: " + lives;
}

function loop() {
  if (!gameRunning) return;
  update();
  requestAnimationFrame(loop);
}

function startGame() {
  score = 0;
  lives = 3;
  createEggs();
  gameRunning = true;
  startBtn.classList.add("hidden");
  replayBtn.classList.add("hidden");
  timerEl.classList.add("hidden");
  loop();
}

function endGame() {
  gameRunning = false;
  replayBtn.classList.remove("hidden");
}

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  paddle.x = e.clientX - rect.left - paddle.width / 2;
});

startBtn.onclick = startGame;
replayBtn.onclick = startGame;
