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
    color: "red",
    dx: 0,
    dy: 0,
    speed: 3,
    gravity: 0.5,
    jumpForce: -10,
    grounded: false,
    alive: true
};

// Camera
let cameraX = 0;

// Score
let score = 0;

// Checkpoints
const checkpoints = [
    { x: 50, y: 250 }, { x: 300, y: 220 }, { x: 700, y: 180 },
    { x: 1200, y: 140 }, { x: 1600, y: 100 }, { x: 2100, y: 60 },
    { x: 2700, y: 40 }
];
let lastCheckpoint = { x: 50, y: 250 };

// Platforms
const platforms = [
    { x: 0, y: 280, width: 400, height: 20, color: "green", dx: 0, minX: 0, maxX: 0, spikes: [] },
    { x: 150, y: 230, width: 100, height: 10, color: "green", dx: 1, minX: 150, maxX: 300, spikes: [20, 60] },
    { x: 300, y: 200, width: 120, height: 10, color: "green", dx: 1.2, minX: 300, maxX: 450, spikes: [30, 80] },
    { x: 500, y: 170, width: 100, height: 10, color: "green", dx: 0.8, minX: 500, maxX: 650, spikes: [20, 60] },
    { x: 700, y: 140, width: 150, height: 10, color: "green", dx: 1, minX: 700, maxX: 850, spikes: [50, 100] },
    { x: 1000, y: 110, width: 120, height: 10, color: "green", dx: 1, minX: 1000, maxX: 1150, spikes: [40, 80] }
];

// Volcanoes
const volcanoes = [
    { x: 600, y: 270, width: 30, height: 30, lava: [], lastErupt: 0 },
    { x: 1300, y: 270, width: 30, height: 30, lava: [], lastErupt: 0 }
];

// Coins
const coins = [
    { x: 200, y: 190, width: 10, height: 10, collected: false },
    { x: 350, y: 160, width: 10, height: 10, collected: false },
    { x: 750, y: 120, width: 10, height: 10, collected: false },
    { x: 1200, y: 90, width: 10, height: 10, collected: false }
];

// Goal
const goal = { x: 1500, y: 20, width: 20, height: 20, color: "gold" };

// Controls
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Game loop
function update(time = 0) {
    if (!player.alive) return;

    let onPlatform = false;

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
            player.y + player.height < p.y + p.height + player.dy) {
            player.y = p.y - player.height;
            player.dy = 0;
            player.grounded = true;
            onPlatform = true;

            // Move player with platform
            player.x += p.dx;

            // Spikes collision
            if (p.spikes) {
                p.spikes.forEach(s => {
                    const spikeX = p.x + s;
                    if (player.x + player.width > spikeX && player.x < spikeX + 10) respawnCheckpoint();
                });
            }
        }
    });

    // Volcanoes eruption every 2s
    volcanoes.forEach(v => {
        if (time - v.lastErupt > 2000) {
            v.lava.push({ x: v.x + v.width / 2, y: v.y, dx: (Math.random() - 0.5) * 2, dy: -5 });
            v.lastErupt = time;
        }
        v.lava.forEach(l => {
            l.dy += 0.2; // gravity
            l.y += l.dy;
            l.x += l.dx;
            if (player.x < l.x + 5 && player.x + player.width > l.x &&
                player.y < l.y + 5 && player.y + player.height > l.y) respawnCheckpoint();
        });
        v.lava = v.lava.filter(l => l.y < canvas.height + 10);
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

    // Checkpoints
    checkpoints.forEach(cp => {
        if (player.x > cp.x) lastCheckpoint = { x: cp.x, y: cp.y };
    });

    // Falling
    if (player.y + player.height > canvas.height) respawnCheckpoint();

    // Goal
    if (player.x < goal.x + goal.width &&
        player.x + player.width > goal.x &&
        player.y < goal.y + goal.height &&
        player.y + player.height > goal.y) {
        alert(`You reached the goal! Score: ${score}`);
        resetGame();
    }

    // Camera
    cameraX = player.x - canvas.width / 2;

    draw(time);
    requestAnimationFrame(update);
}

// Respawn
function respawnCheckpoint() {
    player.x = lastCheckpoint.x;
    player.y = lastCheckpoint.y;
    player.dx = 0;
    player.dy = 0;
    player.grounded = false;
}

// Reset
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
function draw(time) {
    // Background color shifts slowly based on player x
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    const colorShift = Math.min(player.x / goal.x, 1);
    grad.addColorStop(0, `rgb(${50 + 100 * colorShift}, ${150 - 50 * colorShift}, 255)`);
    grad.addColorStop(1, `rgb(${100 + 50 * colorShift}, ${200 - 100 * colorShift}, 255)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Score
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);

    // Platforms
    platforms.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - cameraX, p.y, p.width, p.height);
        // Draw spikes as flat triangles
        ctx.fillStyle = "black";
        if (p.spikes) p.spikes.forEach(s => {
            ctx.beginPath();
            ctx.moveTo(p.x + s - cameraX, p.y);
            ctx.lineTo(p.x + s + 10 - cameraX, p.y);
            ctx.lineTo(p.x + s + 5 - cameraX, p.y - 10);
            ctx.closePath();
            ctx.fill();
        });
    });

    // Volcanoes and lava
    volcanoes.forEach(v => {
        // Volcano shape
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.moveTo(v.x - cameraX, v.y + v.height);
        ctx.lineTo(v.x + v.width / 2 - cameraX, v.y);
        ctx.lineTo(v.x + v.width - cameraX, v.y + v.height);
        ctx.closePath();
        ctx.fill();

        // Lava
        ctx.fillStyle = "orange";
        v.lava.forEach(l => {
            ctx.beginPath();
            ctx.arc(l.x - cameraX, l.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    });

    // Coins
    coins.forEach(c => {
        if (!c.collected) {
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(c.x - cameraX + c.width / 2, c.y + c.height / 2, c.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Goal
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x - cameraX, goal.y, goal.width, goal.height);

    // Player
    ctx.fillStyle = player.color;
    ctx.fillRect(canvas.width / 2 - player.width / 2, player.y, player.width, player.height);
}

// Start
update();
