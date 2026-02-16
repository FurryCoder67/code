const climbStairs = (n) => {
    let prev1 = 2, prev2 = 1, total = 0;
    if (n === 1) return 1;
    if (n === 2) return 2;
    if (n === 3) return 3;
    for (let i = 3; i < n; i++) {
        total = prev1 + prev2;
        [prev2, prev1] = [prev1, total];
    }
    return total;
};
console.log(climbStairs(45));