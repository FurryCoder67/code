// Seed and pet data
const seedData = {
    sunflower: { emoji: "🌻", cost: 5, value: 10, growTime: 10000 },
    tomato: { emoji: "🍅", cost: 7, value: 15, growTime: 12000 },
    corn: { emoji: "🌽", cost: 10, value: 20, growTime: 15000 }
};

const petEggs = {
    common: {
        cost: 100,
        pets: [
            { name: "Hamster 🐹", boost: 0.20 },
            { name: "Bunny 🐰", boost: 0.20 }
        ]
    },
    rare: {
        cost: 200,
        pets: [
            { name: "Fox 🦊", boost: 0.40 },
            { name: "Cat 🐱", boost: 0.40 }
        ]
    },
    mythical: {
        cost: 2000,
        pets: [
            { name: "Dragon 🐉", boost: 2.00 },
            { name: "Unicorn 🦄", boost: 2.00 }
        ]
    }
};

// Game state
let seedInventory = {};
let shuckleCount = 5;
let pets = [];
let plots = [[], []];
let plantsReady = 0;

// UI update
function updateUI() {
    document.getElementById("seedCount").textContent = Object.values(seedInventory).reduce((a, b) => a + b, 0);
    document.getElementById("shuckleCount").textContent = shuckleCount;
    document.getElementById("plantsReady").textContent = plantsReady;

    const petList = document.getElementById("petList");
    petList.innerHTML = "";
    pets.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} (+${Math.round(p.boost * 100)}%)`;
        petList.appendChild(li);
    });

    plots.forEach((plot, i) => {
        const plotDiv = document.getElementsByClassName("plot")[i];
        plotDiv.innerHTML = "";
        plot.forEach(p => {
            const plant = document.createElement("div");
            plant.className = "plant";
            plant.textContent = p.grown ? seedData[p.type].emoji : "🌱";
            plotDiv.appendChild(plant);
        });
    });
}

// Panel toggle logic
function togglePanel(id) {
    const panels = ["seedShop", "petShop", "sellPanel"];
    panels.forEach(panelId => {
        const panel = document.getElementById(panelId);
        if (panelId === id) {
            panel.style.display = panel.style.display === "block" ? "none" : "block";
        } else {
            panel.style.display = "none";
        }
    });
}

// Buy seed
function buySeed() {
    const type = document.getElementById("seedType").value;
    const cost = seedData[type].cost;
    if (shuckleCount >= cost) {
        seedInventory[type] = (seedInventory[type] || 0) + 1;
        shuckleCount -= cost;
        updateUI();
    } else {
        alert("Not enough Shuckles!");
    }
}

// Buy egg and hatch pet
function buyEgg(type) {
    const egg = petEggs[type];
    if (shuckleCount < egg.cost) {
        alert("Not enough Shuckles!");
        return;
    }

    shuckleCount -= egg.cost;
    const pet = egg.pets[Math.floor(Math.random() * egg.pets.length)];
    pets.push(pet);
    updateUI();
}

// Calculate total pet boost
function getTotalBoost() {
    return pets.reduce((sum, pet) => sum + pet.boost, 0);
}

// Plant seed in plot
function plantSeed(index) {
    if (plots[index].length >= 40) return alert("Plot is full!");
    const availableType = Object.keys(seedInventory).find(type => seedInventory[type] > 0);
    if (!availableType) return alert("No seeds available!");

    seedInventory[availableType]--;
    const baseTime = seedData[availableType].growTime;
    const boost = getTotalBoost();
    const growTime = baseTime * (1 - boost);

    const plant = { type: availableType, grown: false };
    plots[index].push(plant);
    updateUI();

    setTimeout(() => {
        plant.grown = true;
        plantsReady++;
        updateUI();
    }, Math.max(1000, growTime));
}

// Sell all grown plants
function sellPlants() {
    plots.forEach((plot, i) => {
        plots[i] = plot.filter(p => {
            if (p.grown) {
                shuckleCount += seedData[p.type].value;
                plantsReady--;
                return false;
            }
            return true;
        });
    });
    updateUI();
}

// Initial UI setup
updateUI();