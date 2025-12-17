let clicks = 0;
let cps = 0;

const shopItems = [
    { name: "Trippi Troppi", cost: 10, cps: 1, img: "/pics/trippitroppi.webp" },
    { name: "Tung Tung Tung Sahur", cost: 50, cps: 5, img: "/pics/Tung-Tung-Tung-Sahur.webp" },
    { name: "Tralalero Tralala", cost: 100, cps: 10, img: "/pics/Tralalero_Tralalala.webp" },
    { name: "Bombardino Crocodilo", cost: 500, cps: 30, img: "/pics/bombardino-crocodilo.webp" },
    { name: "Brr Brr Patabim", cost: 1000, cps: 100, img: "/pics/brr-brr-patapim.webp" },
    { name: "Frulli Frulla", cost: 2000, cps: 200, img: "/pics/Frulli-Frulla-PNG-Pic.png" },
    { name: "Chimpanzini Bananini", cost: 10000, cps: 500, img: "/pics/300px-Chimpanzini_Bananino.webp" },
    { name: "Odin din din dun", cost: 20000, cps: 1000, img: "/pics/odindindoon.webp" },
    { name: "Liri Liri Larila", cost: 100000, cps: 5000, img: "/pics/Lirili_Larila.jpeg.jpeg" },
    { name: "Lavaka Saturno Saturnita", cost: 500000, cps: 10000, img: "/pics/lavakasuturnosaturnita.jpg" },
    { name: "Frigo Camelo", cost: 10000000, cps: 1000000, img: "/pics/frigo-camelo.webp" },
    { name: "Bombombini Gusini", cost: 10000000000, cps: 10000000, img: "/pics/bombinigusuini.webp" },
    { name: "Divine Cappuccino Assassino", cost: 99999999999999999999999, cps: 9999999999999999, img: "/pics/300px-Fire_katanas.webp" }
];

const shopDiv = document.getElementById('shop');
const scoreDiv = document.getElementById('score');
const clickBtn = document.getElementById('clicker');

// Render the shop
const renderShop = () => {
    shopDiv.innerHTML = '';
    shopItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="item-name">${item.name}</div>
            <div class="item-cost">Cost: ${item.cost}</div>
        `;
        itemDiv.onclick = () => buyItem(index);
        shopDiv.appendChild(itemDiv);
    });
};

// Update clicks and CPS display
const updateScore = () => {
    scoreDiv.innerText = `Clicks: ${clicks} | CPS: ${cps}`;
};

// Buy item
const buyItem = (index) => {
    const item = shopItems[index];
    if (clicks >= item.cost) {
        clicks -= item.cost;
        cps += item.cps;
        item.cost = Math.floor(item.cost * 1.5); // increase cost
        updateScore();
        renderShop();
        saveGame();
    } else {
        alert("Not enough clicks!");
    }
};

// Click button
clickBtn.onclick = () => {
    clicks++;
    updateScore();
    saveGame();
};

// Auto CPS every second
setInterval(() => {
    clicks += cps;
    updateScore();
    saveGame();
}, 1000);

// Save/load game with cookies
function saveGame() {
    document.cookie = "clicks=" + clicks + "; path=/; max-age=" + 60 * 60 * 24 * 30;
    document.cookie = "cps=" + cps + "; path=/; max-age=" + 60 * 60 * 24 * 30;
}

function loadGame() {
    const allCookies = document.cookie.split(';');
    for (let i = 0; i < allCookies.length; i++) {
        const cookie = allCookies[i].trim();
        if (cookie.indexOf("clicks=") === 0) {
            clicks = parseInt(cookie.substring("clicks=".length));
        }
        if (cookie.indexOf("cps=") === 0) {
            cps = parseInt(cookie.substring("cps=".length));
        }
    }
}

// Initialize
loadGame();
updateScore();
renderShop();
