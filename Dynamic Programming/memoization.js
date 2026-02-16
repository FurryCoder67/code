const map = new Map();

function climbStairs(n) {
    if (n === 1) return 1;
    if (n === 2) return 2;
    if (map.has(n)) {
        return map.get(n);
    } else {
        map.set(n, climbStairs(n - 1) + climbStairs(n - 2));
    }
    return map.get(n);
}
console.log(climbStairs(45));
function run() {
    console.assert(climbStairs(40) === 165580141, 'Test 1 failed');
    console.assert(climbStairs(50) === 20365011074, 'Test 2 failed');
    console.assert(climbStairs(20) === 10946, 'Test 3 failed');
    console.assert(climbStairs(60) === 2504730781961, 'Test 4 failed');
    console.assert(climbStairs(70) === 308061521170129, 'Test 5 failed');
}
run();