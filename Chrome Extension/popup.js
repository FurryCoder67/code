const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player setup
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
    grounded: false,
    alive: true
};

// Score
let score = 0;

// Checkpoints
let checkpoints = [
    { x: 50, y: 250 },
    { x: 180, y: 220 },
    { x: 350, y: 180 },
    { x: 500, y: 150 }
];
let lastCheckpoint = { x: 50, y: 250 };

// Platforms (some moving)
const platforms = [
    { x: 0, y: 280, width: 400, height: 20, color: "green", dx: 0 },
    { x: 100, y: 230, width: 80, height: 10, color: "green", dx: 1, minX: 100, maxX: 200 },
    { x: 220, y: 200, width: 100, height: 10, color: "green", dx: 1.5, minX: 220, maxX: 300 },
    { x: 350, y: 170, width: 120, height: 10, color: "green", dx: -1, minX: 300, maxX: 400 },
    { x: 450, y: 140, width: 100, height: 10, color: "green", dx: 0 },
    { x: 550, y: 110, width: 80, height: 10, color: "green", dx: 1, minX: 550, maxX: 620 },
    { x: 650, y: 80, width: 100, height: 10, color: "green", dx: -1, minX: 650, maxX: 720 }
];

// Hazards (spikes/pits)
const hazards = [
    { x: 180, y: 280, width: 20, height: 20, color: "black" },
    { x: 350, y: 280, width: 20, height: 20, color: "black" },
    { x: 500, y: 280, width: 20, height: 20, color: "black" },
    { x: 600, y: 280, width: 20, height: 20, color: "black" }
];

// Goal
const goal = { x: 700, y: 50, width: 20, height: 20, color: "gold" };

// Controls
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Game loop
function update() {
    if (!player.alive) return;

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

    // Platform collision and moving platforms
    platforms.forEach(platform => {
        // Move platform
        if (platform.dx) {
            platform.x += platform.dx;
            if (platform.x < platform.minX || platform.x + platform.width > platform.maxX) {
                platform.dx *= -1;
            }
        }

        // Collision detection
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height + player.dy) {
            player.y = platform.y - player.height;
            player.dy = 0;
            player.grounded = true;
            score += 1; // gain score while on platforms
        }
    });

    // Hazard collision
    hazards.forEach(h => {
        if (player.x < h.x + h.width &&
            player.x + player.width > h.x &&
            player.y < h.y + h.height &&
            player.y + player.height > h.y) {
            respawnCheckpoint();
        }
    });

    // Update checkpoint if passed
    checkpoints.forEach(cp => {
        if (player.x > cp.x) {
            lastCheckpoint = { x: cp.x, y: cp.y };
        }
    });

    // Prevent leaving canvas
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) {
        respawnCheckpoint();
    }

    // Check goal
    if (player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y) {
        alert(`You reached the goal! Final Score: ${score}`);
        resetGame();
    }

    draw();
    requestAnimationFrame(update);
}

// Respawn at last checkpoint
function respawnCheckpoint() {
    player.x = lastCheckpoint.x;
    player.y = lastCheckpoint.y;
    player.dx = 0;
    player.dy = 0;
    player.grounded = false;
}

// Reset game
function resetGame() {
    player.x = 50;
    player.y = 250;
    player.dx = 0;
    player.dy = 0;
    player.grounded = false;
    player.alive = true;
    score = 0;
    lastCheckpoint = { x: 50, y: 250 };
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);

    // Draw platforms
    platforms.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    // Draw hazards
    hazards.forEach(h => {
        ctx.fillStyle = h.color;
        ctx.fillRect(h.x, h.y, h.width, h.height);
    });

    // Draw goal
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Start the game
update();
