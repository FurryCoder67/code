const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 80, ballSize = 10;
const paddleSpeed = 5, ballSpeed = 3;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballDX = ballSpeed, ballDY = ballSpeed;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

let leftUp = false, leftDown = false, rightUp = false, rightDown = false;

document.addEventListener("keydown", (event) => {
    if (event.key === "w") leftUp = true;
    if (event.key === "s") leftDown = true;
    if (event.key === "ArrowUp") rightUp = true;
    if (event.key === "ArrowDown") rightDown = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "w") leftUp = false;
    if (event.key === "s") leftDown = false;
    if (event.key === "ArrowUp") rightUp = false;
    if (event.key === "ArrowDown") rightDown = false;
});

function update() {
    if (leftUp && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    if (leftDown && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;
    if (rightUp && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
    if (rightDown && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;

    ballX += ballDX;
    ballY += ballDY;

    // Ball Collision with Walls
    if (ballY <= 0 || ballY >= canvas.height - ballSize) ballDY = -ballDY;

    // Ball Collision with Paddles
    if (
        (ballX <= paddleWidth && ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) ||
        (ballX >= canvas.width - paddleWidth - ballSize && ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight)
    ) {
        ballDX = -ballDX;
    }

    // Reset Ball when scoring
    if (ballX <= 0 || ballX >= canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballDX = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        ballDY = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();