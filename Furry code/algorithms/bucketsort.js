function bucketSort(arr) {
    const count = new Array(10).fill(0);
    for (const value of arr) {
        if (value >= 0 && value < 10) {
            count[value]++;
        }
    } for (let i = 0; i < count.length; i++) {
        while (count[i]-- > 0) {
            output.push(i);
        }
    }
    return output;
}