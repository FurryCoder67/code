function ways(m, n) {
    let row = new Array(n).fill(1);
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            row[j] = row[j] + row[j - 1];
        }
    }
    return row[n - 1];
}
function uniquePathsWithBlockage(input) {
    const rows = input.length;
    const cols = input[0].length;
    if (input[0][0] === 1 || input[rows - 1][cols - 1] === 1) return 0;
    const dp = new Array(cols).fill(0);
    dp[0] = 1;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (input[i][j] === 1) {
                dp[j] = 0;
                continue;
            }
            if (j > 0) {
                dp[j] += dp[j - 1];
            }
        }
    }
    return dp[cols - 1];
}

console.log(uniquePathsWithBlockage([[0, 0, 0], [0, 0, 1], [0, 0, 0]]));