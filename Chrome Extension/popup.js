const canvas = document.getElementById("gameCanvas"), ctx = canvas.getContext("2d");
canvas.width = 400; canvas.height = 300;

const speed = 2;
const player = { x: 100, y: 0, w: 20, h: 20, dy: 0, grounded: false, spaceship: false, color: "#ff4d4d" };
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);
document.addEventListener("keydown", e => { if (e.code === "KeyS") player.spaceship = !player.spaceship });

let objects = [];
function genObjects() {
    objects = [];
    let x = 0;
    // first safe platform
    objects.push({ x: 0, y: 250, w: 150, h: 10, type: "platform", spike: false });
    x += 200;
    while (x < 4000) {
        const gap = 50 + Math.random() * 50;
        const type = Math.random() < 0.6 ? "platform" : "hazard";
        if (type === "platform") {
            const w = 80 + Math.random() * 80, y = 180 + Math.random() * 50;
            objects.push({ x: x + gap, y, w, h: 10, type });
            x += gap + w;
        } else {
            const y = 230 + Math.random() * 20;
            objects.push({ x: x + gap, y, w: 20, h: 20, type });
            x += gap + 20;
        }
    }

    // add spaceship obstacles in sky
    for (let i = 500; i < 4000; i += 200 + Math.random() * 100) {
        const y = 50 + Math.random() * 150;
        objects.push({ x: i, y, w: 20, h: 20, type: "sky" });
    }
}
genObjects();
player.y = objects[0].y - player.h - 1;

function respawn() { player.y = objects[0].y - player.h - 1; player.dy = 0; player.grounded = false; genObjects(); }

function update(time = 0) {
    if (!player.spaceship) { if (keys["Space"] && player.grounded) { player.dy = -10; player.grounded = false; } }
    else player.dy = keys["Space"] ? -3 : player.dy + 0.072;
    player.dy += player.spaceship ? 0.072 : 0.6;
    player.y += player.dy; player.grounded = false;

    for (let o of objects) {
        o.x -= speed;

        if (o.type === "platform" && (player.x + player.w > o.x && player.x < o.x + o.w && player.y + player.h > o.y && player.y + player.h < o.y + o.h + Math.abs(player.dy) + 2 && !player.spaceship)) {
            player.y = o.y - player.h; player.dy = 0; player.grounded = true;
        }

        // ground hazards
        if (o.type === "hazard" && (player.x + player.w > o.x && player.x < o.x + o.w && player.y + player.h > o.y && player.y < o.y + o.h)) {
            respawn();
        }

        // sky hazards (spaceship mode)
        if (o.type === "sky" && player.spaceship && (player.x + player.w > o.x && player.x < o.x + o.w && player.y + player.h > o.y && player.y < o.y + o.h)) {
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

    for (let o of objects) {
        if (o.type === "platform") {
            ctx.fillStyle = "#2ecc71"; ctx.fillRect(o.x, o.y, o.w, o.h);
            if (o.spike) { ctx.fillStyle = "#111"; ctx.beginPath(); ctx.moveTo(o.x + o.w / 2 - 5, o.y); ctx.lineTo(o.x + o.w / 2 + 5, o.y); ctx.lineTo(o.x + o.w / 2, o.y - 10); ctx.closePath(); ctx.fill(); }
        }
        else if (o.type === "hazard") { ctx.fillStyle = "#e74c3c"; ctx.fillRect(o.x, o.y, o.w, o.h); }
        else if (o.type === "sky") { ctx.fillStyle = "#3498db"; ctx.fillRect(o.x, o.y, o.w, o.h); } // blue for sky obstacles
    }

    ctx.fillStyle = player.color; ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = "black"; ctx.font = "12px sans-serif"; ctx.fillText("Space=jump, S=spaceship", 8, 14);
}

update();
