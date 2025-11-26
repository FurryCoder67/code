const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player
const player = {
    x: 50,
    y: 250,
    width: 20,
    height: 20,
    color: "red",
    dx: 0,
    dy: 0,
    speed: 3,
    gravity: 0.5,
    jumpForce: -10,
    grounded: false
};

// Platforms
const platforms = [
    { x: 0, y: 280, width: 400, height: 20, color: "green" },
    { x: 100, y: 220, width: 100, height: 10, color: "green" },
    { x: 250, y: 180, width: 80, height: 10, color: "green" },
];

// Goal
const goal = {
    x: 320,
    y: 150,
    width: 20,
    height: 20,
    color: "gold"
};

// Controls
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function update() {
    // Horizontal movement
    if (keys["ArrowLeft"]) player.dx = -player.speed;
    else if (keys["ArrowRight"]) player.dx = player.speed;
    else player.dx = 0;

    // Jump
    if (keys["Space"] && player.grounded) {
        player.dy = player.jumpForce;
        player.grounded = false;
    }

    // Apply gravity
    player.dy += player.gravity;
    player.x += player.dx;
    player.y += player.dy;

    player.grounded = false;

    // Collision with platforms
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height + player.dy) {
            player.y = platform.y - player.height;
            player.dy = 0;
            player.grounded = true;
        }
    });

    // Prevent leaving canvas
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    // Check goal
    if (player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y) {
        alert("You win!");
        resetGame();
        return;
    }

    draw();
    requestAnimationFrame(update);
}

function resetGame() {
    player.x = 50;
    player.y = 250;
    player.dx = 0;
    player.dy = 0;
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    platforms.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    // Draw goal
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Start game
update();
