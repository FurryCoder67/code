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
