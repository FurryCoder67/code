let clicks = 0;

const shopItems = [
    { name: "Trippi Troppi", cost: 10, cps: 1, img: "trippitroppi.webp" },
    { name: "Tung Tung Tung Sahur", cost: 50, cps: 5, img: "Tung-Tung-Tung-Sahur.webp" },
    { name: "Tralalero Tralala", cost: 100, cps: 10, img: "Tralalero_Tralalala.webp" },
    { name: "Bombardino Crocodilo", cost: 500, cps: 30, img: "bombardino-crocodilo.webp" },
    { name: "Brr Brr Patabim", cost: 1000, cps: 100, img: "brr-brr-patapim.webp" },
    { name: "Divine Cappuccino Assassino", cost: 999999999, cps: 999999999, img: "300px-Fire_katanas.webp" }
];
let cps = 0;

function renderShop() {
    const shopDiv = document.getElementById('shop');
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
}

document.getElementById('clicker').onclick = () => {
    clicks++;
    updateScore();
};

function updateScore() {
    document.getElementById('score').innerText = `Clicks: ${clicks}`;
}
function buyItem(index) {
    const item = shopItems[index];
    if (clicks >= item.cost) {
        clicks -= item.cost;
        cps += item.cps;
        item.cost = Math.floor(item.cost * 1.5); // increase cost for next purchase
        updateScore();
        renderShop();
    } else {
        alert("Not enough clicks!");
    }
}

setInterval(() => {
    clicks += cps;
    updateScore();
}, 1000);

renderShop();
