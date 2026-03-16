function partitionMaxSum(arr, k) {
    let currMax = 0;
    const n = arr.length;
    let dp = new Array(n + 1).fill(0);
    for (let i = 0; i <= n; i++) {
        currMax = 0;
        for (let j = 0; j <= Math.min(i, k); j++) {
            currMax = Math.max(currMax, arr[i - j]);
            dp[i] = Math.max(dp[i], dp[i - j] + currMax * j);
        }
    }
    return dp[n];
}
let array = [15, 14, 2, 9, 4, 1];
console.log(partitionMaxSum(array));
// ----------------- Tuff Code ------------------
/* let the Array be 1 15 7 9 2 5, then {
    do some stuff
}
function thing do Stuff { take: params, array: ?? k : value } then for function things. ?? ([
    do stuff in here for assignment split thingy max summation 
])
then once done, node : filter answer and give(summation: arr ?? run node for project ?:)
finally.kill: ?? === terminal : kill
terminal node addEventListener(destroy kill terminal)({
    [|
        brutify ?? kill : terminal
        |]
        log.summation ?? brutify ? Tests : passed else u wanna {
            brutify.kill(funmation test no pass) : ?? summation : log
        }
}) */