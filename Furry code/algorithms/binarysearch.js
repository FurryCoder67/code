function search(arr, target, left, right) {
    function searchIN() {
        if (left === undefined && right === undefined) {
            arr.sort((a, b) => a - b);
            left = 0;
            right = arr.length - 1;
        }
        if (left > right) return 'Enter a number that u actually know is in the array you dummy';
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        }
        if (arr[mid] > target) {
            return search(arr, target, left, mid - 1);
        }
        return search(arr, target, mid + 1, right);
    }
    return searchIN(arr, target, left, right) + 1;
}
const array = [7, 3, 1, 5];
console.log(search(array, 3));

function iterativeSearch(arr, target) {
    arr.sort((a, b) => a - b);
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid + 1;
        }
        if (arr[mid] > target) {
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    return 'Enter a number that u actually know is in the array you dummy';
}

console.log(iterativeSearch(array, 3));