function quickSort(arr) {
    const n = arr.length;
    if (n <= 1) {
        return arr;
    }
    let pivot = arr[n - 1];
    let left = [];
    let right = [];
    for (let i = 0; i < n - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
}

function run() {
    const arr = [4, 5, 3, 2, 0, 1, 6, 9, 8, 7];
    console.log(quickSort(arr));
}
run();