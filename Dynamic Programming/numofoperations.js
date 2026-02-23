function editDistance(s1, s2) {
    const n = s1.length;
    const m = s2.length;
    const dp = Array.from({ length: n + 1 }, () =>
        Array.from({ length: m + 1 }, () => 0)
    );
    for (let i = 0; i <= s1.length; i++) {
        dp[0][i] = i;
    }
    for (let i = 0; i <= s2.length; i++) {
        dp[i][0] = i;
    }
    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j - 1],
                    dp[i - 1][j],
                    dp[i][j - 1]
                );
            }
        }
    }
    return dp[n][m];
}
console.log(editDistance('horse', 'ros'));