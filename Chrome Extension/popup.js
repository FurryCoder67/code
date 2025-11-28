const canvas = document.getElementById("gameCanvas"), ctx = canvas.getContext("2d");
canvas.width = 400; canvas.height = 300;

const speed = 2;
const player = { x: 100, y: 150, w: 20, h: 20, dy: 0, spaceship: true, color: "#ff4d4d" };
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

let objects = [];
function genObjects() {
    objects = [];
    let x = 0;
    while (x < 4000) {
        const gap = 60 + Math.random() * 60;
        if (Math.random() < 0.5) {
            const y = 50 + Math.random() * 200;
            objects.push({ x: x + gap, y, w: 20, h: 20, type: "sky" });
            x += gap + 20;
        } else {
            const y = 50 + Math.random() * 200;
            objects.push({ x: x + gap, y, w: 60, h: 10, type: "platform" });
            x += gap + 60;
        }
    }
}
genObjects();

function respawn() { player.y = 150; player.dy = 0; genObjects(); }

function update(time = 0) {
    player.dy += keys["Space"] ? -0.3 : 0.3; // spaceship gravity
    player.y += player.dy;

    // top/bottom spikes
    if (player.y < 10 || player.y + player.h > canvas.height - 10) respawn();

    for (let o of objects) {
        o.x -= speed;

        // collision with sky obstacles
        if (o.type === "sky" && player.x + player.w > o.x && player.x < o.x + o.w && player.y + player.h > o.y && player.y < o.y + o.h) {
            respawn();
        }

        // collision with platforms (optional to block player)
        if (o.type === "platform" && player.x + player.w > o.x && player.x < o.x + o.w && player.y + player.h > o.y && player.y < o.y + o.h) {
            respawn();
        }
    }

    if (player.y > canvas.height + 100 || player.y < -200) respawn();
    draw(time);
    requestAnimationFrame(update);
}

function draw(time) {
    const colors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff"];
    ctx.fillStyle = colors[Math.floor(time / 1000) % 6]; ctx.fillRect(0, 0, canvas.width, canvas.height);

    // top/bottom spikes
    ctx.fillStyle = "#111";
    for (let i = 0; i < canvas.width; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i + 5, 10); ctx.lineTo(i + 10, 0); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(i, canvas.height); ctx.lineTo(i + 5, canvas.height - 10); ctx.lineTo(i + 10, canvas.height); ctx.closePath(); ctx.fill();
    }

    // draw objects
    for (let o of objects) {
        if (o.type === "sky") { ctx.fillStyle = "#3498db"; ctx.fillRect(o.x, o.y, o.w, o.h); }
        if (o.type === "platform") { ctx.fillStyle = "#2ecc71"; ctx.fillRect(o.x, o.y, o.w, o.h); }
    }

    // draw player
    ctx.fillStyle = player.color; ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = "black"; ctx.font = "12px sans-serif";
    ctx.fillText("Space = move up", 8, 14);
}

update();
