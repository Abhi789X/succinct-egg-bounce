
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const replayBtn = document.getElementById("replayBtn");

let egg = { x: 200, y: 100, vy: 3, radius: 15 };
let paddle = { x: 150, y: 550, width: 100, height: 10 };
let score = 0;
let timeLeft = 30;
let gameRunning = false;
let timer;

function drawEgg() {
  ctx.beginPath();
  ctx.fillStyle = "pink";
  ctx.ellipse(egg.x, egg.y, egg.radius, egg.radius * 1.3, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPaddle() {
  ctx.fillStyle = "#ff1493";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawEgg();
  drawPaddle();
}

function update() {
  egg.y += egg.vy;

  if (
    egg.y + egg.radius * 1.3 >= paddle.y &&
    egg.x >= paddle.x &&
    egg.x <= paddle.x + paddle.width
  ) {
    egg.vy *= -1;
    egg.y = paddle.y - egg.radius * 1.3;
    score++;
    playBounceSound();
  }

  if (egg.y - egg.radius * 1.3 <= 0) {
    egg.vy *= -1;
  }

  if (egg.y > canvas.height) {
    playCrackSound();
    endGame();
  }

  draw();
  scoreEl.textContent = "Score: " + score;
}

function loop() {
  if (!gameRunning) return;
  update();
  requestAnimationFrame(loop);
}

function startGame() {
  score = 0;
  egg = { x: 200, y: 100, vy: 3, radius: 15 };
  gameRunning = true;
  startBtn.classList.add("hidden");
  replayBtn.classList.add("hidden");
  timeLeft = 30;
  timerEl.textContent = "Time: 30s";
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = "Time: " + timeLeft + "s";
    if (timeLeft <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
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
