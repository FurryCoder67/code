function minCostClimbingStairs(cost) {
    let a = cost[0];
    let b = cost[1];
    for (let i = 2; i < cost.length; i++) {
        let c = cost[i] + Math.min(a, b);
        [a, b] = [b, c];
    }
    return Math.min(a, b);
}