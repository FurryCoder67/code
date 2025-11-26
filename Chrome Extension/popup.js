const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Canvas size
canvas.width = 400;
canvas.height = 300;

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
    jumpForce: -12,
    grounded: false,
    alive: true
};

// Camera
let cameraX = 0;

// Score
let score = 0;

// Checkpoints
let checkpoints = [
    { x: 50, y: 250 },
    { x: 300, y: 220 },
    { x: 600, y: 180 },
    { x: 900, y: 140 },
    { x: 1200, y: 100 },
    { x: 1600, y: 70 },
    { x: 2000, y: 50 },
    { x: 2500, y: 60 },
    { x: 3000, y: 40 }
];
let lastCheckpoint = { x: 50, y: 250 };

// Platforms (some moving, some far for hard jumps)
const platforms = [
    { x: 0, y: 280, width: 400, height: 20, color: "green", dx: 0 },
    { x: 100, y: 230, width: 80, height: 10, color: "green", dx: 1, minX: 100, maxX: 200, spikes: [20, 40, 60] },
    { x: 250, y: 200, width: 120, height: 10, color: "green", dx: 0, spikes: [30, 90] },
    { x: 400, y: 170, width: 80, height: 10, color: "green", dx: 0, spikes: [40] },
    { x: 550, y: 140, width: 100, height: 10, color: "green", dx: 1, minX: 550, maxX: 620, spikes: [50, 70] },
    { x: 700, y: 100, width: 150, height: 10, color: "green", dx: 0, spikes: [20, 80, 120] },
    { x: 900, y: 80, width: 100, height: 10, color: "green", dx: -1, minX: 900, maxX: 1050, spikes: [30, 60] },
    { x: 1100, y: 60, width: 120, height: 10, color: "green", dx: 0, spikes: [40, 80] },
    { x: 1300, y: 40, width: 200, height: 10, color: "green", dx: 0, spikes: [50, 100, 150] },
    { x: 1600, y: 70, width: 120, height: 10, color: "green", dx: 1, minX: 1600, maxX: 1720, spikes: [30, 60] },
    { x: 1900, y: 50, width: 150, height: 10, color: "green", dx: -1, minX: 1900, maxX: 2050, spikes: [40, 100] },
    { x: 2200, y: 80, width: 200, height: 10, color: "green", dx: 0, spikes: [60, 120] },
    { x: 2500, y: 40, width: 180, height: 10, color: "green", dx: 0, spikes: [50, 100] },
    { x: 2800, y: 20, width: 200, height: 10, color: "green", dx: 0, spikes: [50, 150] }
];

// Hazards (ground spikes, moving spikes)
const hazards = [
    { x: 180, y: 280, width: 20, height: 20, color: "black", dx: 0 },
    { x: 350, y: 280, width: 20, height: 20, color: "black", dx: 0 },
    { x: 500, y: 280, width: 20, height: 20, color: "black", dx: 0.5, minX: 500, maxX: 550 },
    { x: 600, y: 280, width: 20, height: 20, color: "black", dx: -0.5, minX: 580, maxX: 620 },
    { x: 1000, y: 280, width: 20, height: 20, color: "black", dx: 1, minX: 1000, maxX: 1050 },
    { x: 1200, y: 280, width: 20, height: 20, color: "black", dx: -1, minX: 1180, maxX: 1250 },
    { x: 1800, y: 280, width: 20, height: 20, color: "black", dx: 0 }
];

// Coins
const coins = [
    { x: 120, y: 200, width: 10, height: 10, collected: false },
    { x: 260, y: 170, width: 10, height: 10, collected: false },
    { x: 450, y: 140, width: 10, height: 10, collected: false },
    { x: 720, y: 110, width: 10, height: 10, collected: false },
    { x: 950, y: 60, width: 10, height: 10, collected: false },
    { x: 1150, y: 30, width: 10, height: 10, collected: false },
    { x: 1550, y: 50, width: 10, height: 10, collected: false },
    { x: 2100, y: 60, width: 10, height: 10, collected: false },
    { x: 2600, y: 30, width: 10, height: 10, collected: false }
];

// Goal
const goal = { x: 3300, y: 20, width: 20, height: 20, color: "gold" };

// Controls
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Game loop
function update() {
    if (!player.alive) return;

    // Horizontal movement
    player.dx = 0;
    if (keys["ArrowLeft"]) player.dx = -player.speed;
    if (keys["ArrowRight"]) player.dx = player.speed;

    // Jump
    if (keys["Space"] && player.grounded) {
        player.dy = player.jumpForce;
        player.grounded = false;
    }

    // Gravity
    player.dy += player.gravity;
    player.x += player.dx;
    player.y += player.dy;
    player.grounded = false;

    // Platform collision & moving platforms
    platforms.forEach(p => {
        if (p.dx) {
            p.x += p.dx;
            if (p.x < p.minX || p.x + p.width > p.maxX) p.dx *= -1;
        }
        if (player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y + player.height > p.y &&
            player.y + player.height < p.y + p.height + player.dy) {
            player.y = p.y - player.height;
            player.dy = 0;
            player.grounded = true;
            score += 1;

            // Check spikes on platform
            if (p.spikes) {
                p.spikes.forEach(s => {
                    let spikeX = p.x + s;
                    if (player.x + player.width > spikeX && player.x < spikeX + 10) {
                        respawnCheckpoint();
                    }
                });
            }
        }
    });

    // Hazards
    hazards.forEach(h => {
        if (h.dx) {
            h.x += h.dx;
            if (h.x < h.minX || h.x + h.width > h.maxX) h.dx *= -1;
        }
        if (player.x < h.x + h.width &&
            player.x + player.width > h.x &&
            player.y < h.y + h.height &&
            player.y + player.height > h.y) {
            respawnCheckpoint();
        }
    });

    // Coins
    coins.forEach(c => {
        if (!c.collected &&
            player.x < c.x + c.width &&
            player.x + player.width > c.x &&
            player.y < c.y + c.height &&
            player.y + player.height > c.y) {
            c.collected = true;
            score += 50;
        }
    });

    // Update checkpoint
    checkpoints.forEach(cp => {
        if (player.x > cp.x) lastCheckpoint = { x: cp.x, y: cp.y };
    });

    // Falling off screen
    if (player.y + player.height > canvas.height) respawnCheckpoint();

    // Check goal
    if (player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y) {
        alert(`You reached the goal! Final Score: ${score}`);
        resetGame();
    }

    // Camera follow
    cameraX = player.x - canvas.width / 2;

    draw();
    requestAnimationFrame(update);
}

// Respawn at checkpoint
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
    cameraX = 0;
    coins.forEach(c => c.collected = false);
}

// Draw
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Score
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);

    // Platforms
    platforms.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);

        // Draw spikes
        if (p.spikes) {
            ctx.fillStyle = "black";
            p.spikes.forEach(s => {
                ctx.fillRect(p.x + s - cameraX, p.y - 10, 10, 10);
            });
        }
    });

    // Hazards
    hazards.forEach(h => {
        ctx.fillStyle = h.color;
        ctx.fillRect(h.x - cameraX, h.y, h.width, h.height);
    });

    // Coins
    coins.forEach(c => {
        if (!c.collected) {
            ctx.fillStyle = "yellow";
            ctx.fillRect(c.x - cameraX, c.y, c.width, c.height);
        }
    });

    // Goal
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x - cameraX, goal.y, goal.width, goal.height);

    // Player (centered)
    ctx.fillStyle = player.color;
    ctx.fillRect(canvas.width / 2 - player.width / 2, player.y, player.width, player.height);
}

// Start game
update();
