const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 300;

const speed = 2; // world speed

// Player
const player = { x: 100, y: 0, w: 20, h: 20, dy: 0, grounded: false, spaceship: false, color: "#ff4d4d" };

// Controls
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);
document.addEventListener("keydown", e => { if (e.code === "KeyS") player.spaceship = !player.spaceship });

// Platforms
let platforms = [];
function genPlatforms() {
    platforms = [];
    let px = 0;
    platforms.push({ x: px, y: 250, w: 200, h: 10, dx: 0, range: 0, spike: true, alligator: false });
    px += 250;
    for (let i = 0; i < 30; i++) {
        const w = 80 + Math.random() * 120;
        const y = 120 + Math.random() * 140;
        const move = Math.random() < 0.5;
        platforms.push({
            x: px, y, w, h: 10,
            dx: move ? (Math.random() < 0.5 ? 1 : -1) * (0.5 + Math.random() * 1.2) : 0,
            range: move ? 30 + Math.floor(Math.random() * 80) : 0,
            spike: true,
            alligator: Math.random() < 0.28
        });
        px += w + 80 + Math.random() * 80;
    }
}
genPlatforms();

// Init player
player.y = platforms[0].y - player.h - 1;

// Respawn
function respawn() { player.y = platforms[0].y - player.h - 1; player.dy = 0; player.grounded = false; genPlatforms(); }

// Main loop
function update(time = 0) {
    // Gravity / jump
    if (!player.spaceship) { if (keys["Space"] && player.grounded) { player.dy = -10; player.grounded = false; } }
    else player.dy = keys["Space"] ? -3 : player.dy + 0.072;
    player.dy += player.spaceship ? 0.072 : 0.6;
    player.y += player.dy; player.grounded = false;

    // Move world & collisions
    for (let p of platforms) {
        p.x -= speed;
        if (p.range) { p.x += p.dx; if (p.x < p.x - p.range || p.x > p.x + p.range) p.dx *= -1; }
        // Alligator collision
        if (p.alligator) {
            if (!p.axOffset) p.axOffset = p.w / 2 - 10;
            if (!p.adx) p.adx = (Math.random() < 0.5 ? 1 : -1) * (0.6 + Math.random() * 1.2);
            p.axOffset += p.adx;
            if (p.axOffset < 0) { p.axOffset = 0; p.adx *= -1; }
            if (p.axOffset > p.w - 20) { p.axOffset = p.w - 20; p.adx *= -1; }
            if (player.x + player.w > p.x + p.axOffset && player.x < p.x + p.axOffset + 20 && player.y + player.h > p.y - 10 && player.y < p.y) respawn();
        }
        // Platform collision
        if (player.x + player.w > p.x && player.x < p.x + p.w && player.y + player.h > p.y && player.y + player.h < p.y + 12 && !player.spaceship) { player.y = p.y - player.h; player.dy = 0; player.grounded = true; }
        // Spike
        if (p.spike) { const sx = p.x + p.w / 2 - 5; if (player.x + player.w > sx && player.x < sx + 10 && player.y + player.h > p.y - 10 && player.y < p.y) respawn(); }
    }

    if (player.y > canvas.height + 100 || player.y < -200) respawn();
    draw(time);
    requestAnimationFrame(update);
}

// Draw
function draw(time) {
    const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff"];
    ctx.fillStyle = colors[Math.floor(time / 1000) % 6];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let p of platforms) {
        ctx.fillStyle = "#2ecc71";
        ctx.fillRect(p.x, p.y, p.w, p.h);
        // spike
        ctx.fillStyle = "#111";
        const sx = p.x + p.w / 2 - 5, sy = p.y;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 10, sy);
        ctx.lineTo(sx + 5, sy - 10);
        ctx.closePath(); ctx.fill();
        // alligator
        if (p.alligator) {
            const ax = p.x + p.axOffset || 0, ay = p.y - 10;
            ctx.fillStyle = "#1b7a1b"; ctx.fillRect(ax, ay, 20, 10);
            ctx.fillStyle = "red"; ctx.fillRect(ax + 4, ay + 2, 3, 3);
        }
    }

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = "black"; ctx.font = "12px sans-serif";
    ctx.fillText("Space=jump, S=spaceship", 8, 14);
}

update();
