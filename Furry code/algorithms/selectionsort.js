function doStuffOrElse(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let min = i;
        for (let j = 0; j < n - 1; j++) {
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
        if (min !== i) {
            [arr[i], arr[min]] = [arr[min], arr[i]]
        }
    }
    return arr;
}
console.log(doStuffOrElse([6, 7, 4, 1]));