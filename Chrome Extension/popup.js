const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 300;

// Player
const player = {
    x: 50,
    y: 250,
    width: 20,
    height: 20,
    color: "#ff4d4d",
    dx: 0,
    dy: 0,
    speed: 3,
    gravity: 0.5,
    jumpForce: -10,
    grounded: false,
};

// Camera
let cameraX = 0;

// Platforms
const platforms = [
    { x: 0, y: 280, width: 400, dx: 0, minX: 0, maxX: 0, spikes: [50, 150, 300] },
    { x: 450, y: 230, width: 100, dx: 1, minX: 450, maxX: 600, spikes: [20, 60] },
    { x: 650, y: 200, width: 120, dx: 1.2, minX: 650, maxX: 800, spikes: [40, 80] },
    { x: 850, y: 170, width: 150, dx: 0.8, minX: 850, maxX: 1000, spikes: [50, 100] },
    { x: 1100, y: 140, width: 120, dx: 0.5, minX: 1100, maxX: 1250, spikes: [30, 70] },
];

// Controls
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Initialize player above first safe platform
function initPlayer() {
    const firstPlatform = platforms[0];
    player.x = firstPlatform.x + 20;
    player.y = firstPlatform.y - player.height - 1; // slightly above platform
    player.dy = 0;
}

// Game loop
function update(time = 0) {
    // Movement
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

    // Platforms
    platforms.forEach(p => {
        // Move platform
        if (p.dx) {
            p.x += p.dx;
            if (p.x < p.minX || p.x + p.width > p.maxX) p.dx *= -1;
        }

        // Collision
        if (player.x < p.x + p.width &&
            player.x + player.width > p.x &&
            player.y + player.height > p.y &&
            player.y + player.height < p.y + 10 + player.dy) {

            player.y = p.y - player.height;
            player.dy = 0;
            player.grounded = true;

            // Move player with platform
            player.x += p.dx;

            // Spike collision
            if (p.spikes) {
                p.spikes.forEach(s => {
                    const spikeX = p.x + s;
                    if (player.x + player.width > spikeX && player.x < spikeX + 10) respawn();
                });
            }
        }
    });

    // Falling off level
    if (player.y > canvas.height) respawn();

    // Camera
    cameraX = player.x - canvas.width / 2;

    draw(time);
    requestAnimationFrame(update);
}

// Respawn
function respawn() {
    const firstPlatform = platforms[0];
    player.x = firstPlatform.x + 20;
    player.y = firstPlatform.y - player.height - 1;
    player.dy = 0;
}

// Draw
function draw(time) {
    // Background changes color every second
    const seconds = Math.floor(time / 1000) % 6; // cycles through 6 colors
    const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff"];
    ctx.fillStyle = colors[seconds];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Platforms
    ctx.fillStyle = "#33cc33";
    platforms.forEach(p => {
        ctx.fillRect(p.x - cameraX, p.y, p.width, 10);

        // Spikes as flat triangles
        ctx.fillStyle = "black";
        p.spikes.forEach(s => {
            ctx.beginPath();
            ctx.moveTo(p.x + s - cameraX, p.y);
            ctx.lineTo(p.x + s + 10 - cameraX, p.y);
            ctx.lineTo(p.x + s + 5 - cameraX, p.y - 10);
            ctx.closePath();
            ctx.fill();
        });
    });

    // Player
    ctx.fillStyle = player.color;
    ctx.fillRect(canvas.width / 2 - player.width / 2, player.y, player.width, player.height);
}

// Start game
initPlayer();
update();
