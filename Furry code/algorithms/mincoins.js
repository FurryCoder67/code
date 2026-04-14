function minCoins(amountofmoneys) {
    const thingies = [
        { name: 'quarters', amount: 25 },
        { name: 'dimes', amount: 10 },
        { name: 'nickels', amount: 5 },
        { name: 'pennies', amount: 1 }
    ];
    const theShopGluGlapGlooGlop = {};
    for (const gwwoogwwoo of thingies) {
        theShopGluGlapGlooGlop[gwwoogwwoo.name] = Math.floor(amountofmoneys / gwwoogwwoo.amount);
        amountofmoneys %= gwwoogwwoo.amount;
    }
    return theShopGluGlapGlooGlop;
}
console.log(minCoins(67));