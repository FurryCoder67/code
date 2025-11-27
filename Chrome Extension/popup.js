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
    dx: 2, // constant forward speed
    dy: 0,
    gravity: 0.5,
    jumpForce: -10,
    grounded: false,
    flying: false,
    spaceship: false // toggle spaceship mode
};

// Camera
let cameraX = 0;

// Controls
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);
document.addEventListener("keydown", e => { if (e.code === "KeyS") player.spaceship = !player.spaceship; }); // press S to toggle spaceship

// Platforms (randomly generated)
const platforms = [];
let platformX = 0;
for (let i = 0; i < 30; i++) {
    const width = 80 + Math.random() * 100;
    const y = 100 + Math.random() * 180;
    platforms.push({
        x: platformX,
        y: y,
        width: width,
        spikes: [width / 2 - 5], // 1 spike in the middle
        alligator: Math.random() < 0.3 ? { dx: 1.5, width: 20, height: 10, xOffset: width / 2 } : null
    });
    platformX += width + 50 + Math.random() * 50;
}

// Game loop
function update(time = 0) {
    // Constant forward movement
    player.x += player.dx;

    // Player controls
    if (!player.spaceship) {
        if (keys["Space"] && player.grounded) {
            player.dy = player.jumpForce;
            player.grounded = false;
        }
    } else {
        // Spaceship mode
        if (keys["Space"]) player.dy = -3;
        else player.dy += player.gravity * 0.2; // slower gravity in spaceship mode
    }

    // Gravity
    if (!player.grounded || player.spaceship) player.dy += player.gravity;
    player.y += player.dy;
    player.grounded = false;

    // Platforms
    platforms.forEach(p => {
        // Collision
        if (player.x + player.width > p.x && player.x < p.x + p.width &&
            player.y + player.height > p.y && player.y + player.height < p.y + 10 + player.dy) {
            if (!player.spaceship) {
                player.y = p.y - player.height;
                player.dy = 0;
                player.grounded = true;
            }
        }

        // Spikes collision
        p.spikes.forEach(s => {
            const spikeX = p.x + s;
            if (player.x + player.width > spikeX && player.x < spikeX + 10 &&
                player.y + player.height > p.y - 10 && player.y < p.y) {
                respawn();
            }
        });

        // Alligator collision
        if (p.alligator) {
            p.alligator.xOffset += p.alligator.dx;
            if (p.alligator.xOffset < 0 || p.alligator.xOffset > p.width - 20) p.alligator.dx *= -1;
            const ax = p.x + p.alligator.xOffset;
            const ay = p.y - p.alligator.height;
            if (player.x + player.width > ax && player.x < ax + 20 &&
                player.y + player.height > ay && player.y < ay + 10) {
                respawn();
            }
        }
    });

    // Falling off screen
    if (player.y > canvas.height || player.y < -player.height) respawn();

    // Camera
    cameraX = player.x - canvas.width / 2;

    draw(time);
    requestAnimationFrame(update);
}

// Respawn
function respawn() {
    player.x = 50;
    player.y = 250;
    player.dy = 0;
    player.grounded = false;
}

// Draw
function draw(time) {
    // Background changing every second
    const seconds = Math.floor(time / 1000) % 6;
    const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff"];
    ctx.fillStyle = colors[seconds];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Platforms and spikes
    ctx.fillStyle = "#33cc33";
    platforms.forEach(p => {
        ctx.fillRect(p.x - cameraX, p.y, p.width, 10);

        // spike
        ctx.fillStyle = "black";
        p.spikes.forEach(s => {
            ctx.beginPath();
            ctx.moveTo(p.x + s - cameraX, p.y);
            ctx.lineTo(p.x + s + 10 - cameraX, p.y);
            ctx.lineTo(p.x + s + 5 - cameraX, p.y - 10);
            ctx.closePath();
            ctx.fill();
        });

        // alligator
        if (p.alligator) {
            ctx.fillStyle = "#228B22";
            const ax = p.x + p.alligator.xOffset - cameraX;
            const ay = p.y - p.alligator.height;
            ctx.fillRect(ax, ay, 20, 10);
        }
    });

    // Player
    ctx.fillStyle = player.color;
    ctx.fillRect(canvas.width / 2 - player.width / 2, player.y, player.width, player.height);
}

// Start
update();
