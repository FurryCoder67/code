const maxCostRobbingHouses2 = (houses) => {
    if (houses.length === 0) return 0;
    if (houses.length === 1) return houses[0];
    let prev2 = houses[0];
    let prev1 = Math.max(houses[0], houses[1]);
    for (let i = 2; i < houses.length; i++) {
        let current = Math.max(prev1, prev2 + houses[i]);
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
};

const memo = new Map();

const maxCostRobbingHouses = (houses, index) => {
    if (index >= houses.length) return 0;
    if (memo.has(index)) return memo.get(index);
    memo.set(index, Math.max(houses[index] + maxCostRobbingHouses(houses, index + 2), maxCostRobbingHouses(houses, index + 1)));
    return memo.get(index);
};

console.log(maxCostRobbingHouses2([2, 7, 9, 3, 1]));

/* Given a list of integers representing the amout of money of each house, 
determine the maximum amout of money you can rob
 tonight without alerting the police */