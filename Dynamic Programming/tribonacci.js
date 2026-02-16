const tribonacci = n => n === 0 ? 0 : n < 3 ? 1 : tribonacci(n - 1) + tribonacci(n - 2) + tribonacci(n - 3);
//console.log(tribonacci(6));

function tribonacci2(n) {
    let arr = [0, 1, 1];
    if (n === 1) return 0;
    if (n === 2) return 1;
    if (n === 3) return 1;
    for (let i = 4; i < n; i++) {
        arr.push(arr[i - 1] + arr[i - 2] + arr[i - 3]);
    }
    return arr[n + 1];
}
console.log(tribonacci2(6));

const tribonacci2 = (n) => {
    if (n === 0) return 0;
    if (n === 1 || n === 2) return 1;

    let [a, b, c] = [0, 1, 1];

    for (let i = 3; i <= n; i++) {
        [a, b, c] = [b, c, a + b + c];
    }

    return c;
};
