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
    { name: "Divine Cappuccino Assassino", cost: 999999999, cps: 999999999, img: "/pics/300px-Fire_katanas.webp" }
];

// Load game from storage
chrome.storage.local.get(['clicks', 'cps', 'shopItems'], (data) => {
    if (data.clicks !== undefined) clicks = data.clicks;
    if (data.cps !== undefined) cps = data.cps;
    if (data.shopItems !== undefined) {
        data.shopItems.forEach((item, i) => shopItems[i].cost = item.cost);
    }
});

// Auto-CPS loop (runs forever in the background)
setInterval(() => {
    clicks += cps;
    saveGame();
}, 1000);

// Save game to storage
function saveGame() {
    chrome.storage.local.set({ clicks, cps, shopItems });
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'getState') {
        sendResponse({ clicks, cps, shopItems });
    } else if (msg.type === 'click') {
        clicks++;
        saveGame();
        sendResponse({ clicks, cps });
    } else if (msg.type === 'buy') {
        const index = msg.index;
        const item = shopItems[index];
        if (clicks >= item.cost) {
            clicks -= item.cost;
            cps += item.cps;
            item.cost = Math.floor(item.cost * 1.5);
            saveGame();
            sendResponse({ success: true, clicks, cps, shopItems });
        } else {
            sendResponse({ success: false });
        }
    }
});
