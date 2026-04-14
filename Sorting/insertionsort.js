function sort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        for (let j = i; j < n; j++) {
            if ((j - 1) < 0) {
                i++;
                j = i;
            }
            if (arr[j] < arr[j - 1]) {
                [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
                j -= 2;
            } else {
                i++;
                j = i - 1;
            }
        }
    }
    return arr;
}
function run() {
    const arr = [4, 5, 3, 2, 0, 1, 6, 9, 8, 7];
    console.log(sort(arr));
}
run();