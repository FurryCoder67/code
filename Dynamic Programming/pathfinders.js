function ways(m, n) {
    let row = new Array(n).fill(1);
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            row[j] = row[j] + row[j - 1];
        }
    }
    return row[n - 1];
}
console.log(ways(3, 3));