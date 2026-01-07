const factorial = (num) => {
    if (num === 1 || num === 0) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
};

//console.log(factorial(4));

/----------------------/

const countUp = (n) => {
    if (n === 0) return;
    countUp(n - 1);
    console.log(n);
};
//countUp(5);

/----------------------/

function count(arr) {
    if (arr.length === 0) {
        return 0;
    }
    return count(arr.slice(1)) + 1;
}
let arr = [1, 2, 3, 4, 5, 4];
//console.log(count(arr));

/----------------------/

function findMax(arr) {
    if (arr.length === 1) return arr[0];
    let nextCall = findMax(arr.slice(1));
    if (arr[0] > nextCall) {
        return arr[0];
    } else {
        return nextCall;
    }
}
const nums = [1, 3, 5, 7, 8, 6, 4, 9, 3];
//console.log(findMax(nums));

function reverseString(str) {
    if (str.length === 0) return "";
    nextStr = str[0];
}

function reverseStr(str) {
    let newstr = "";
    for (let i = str.length; i > 0; i--) {
        newstr += str[i];
    }
    return newstr;
}
reverseStr("hello person");