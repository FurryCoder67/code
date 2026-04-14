function radixSort(arr) {
    let max = Math.max(...arr);
    let place = 1;
    while (Math.floor(max / place) > 0) {
        let buckets = Array.from({ length: 10 }, () => []);
        for (let i = 0; i < arr.length; i++) {
            let num = arr[i];
            let digit = Math.floor(num / place) % 10;
            buckets[digit].push(num);
        }
        arr = [];
        for (let i = 0; i < buckets.length; i++) {
            for (let j = 0; j < buckets[i].length; j++) {
                arr.push(buckets[i][j]);
            }
        }
        place = place * 10;
    }

    return arr;
}
const nums = [170, 45, 75, 90, 802, 24, 2, 66];
console.log(radixSort(nums));