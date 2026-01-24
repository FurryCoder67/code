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

/----------------------/

function reverseString(str) {
    if (str.length === 0) return "";
    return str[str.length - 1] + reverseString(str.slice(0, str.length - 1));
}

//console.log(reverseString("hello world!"));

/----------------------/

const isArray = (arg) => {
    return arg.length > 1;
};

function countNested(nestedArr) {
    if (nestedArr.length === 0) {
        return 0;
    }
    if (Array.isArray(nestedArr[0])) {
        return countNested(nestedArr[0]) + countNested(nestedArr.slice(1));
    }
    return countNested(nestedArr.slice(1)) + 1;
}
const nestedArr = [[3, 2, 1], 3, [8, 4], 2, 9, [3, 4]];
//console.log(countNested(nestedArr));

/----------------------/

const countDown = (n) => {
    if (n === 0) {
        return 0;
    }
    console.log(n);
    countDown(n - 1);
};

//countDown(5);

/----------------------/

const power = (n, e) => {
    if (e === 1) {
        return n;
    }
    return n * power(n, e - 1);
};
//console.log(power(3, 3));

/----------------------/

const isPalindrome = (s) => {
    if (s.length === 2) {
        return s[0] === s[1];
    } else if (s.length === 1) {
        return true;
    } else if (s[0] === s[s.length - 1]) {
        return isPalindrome(s.slice(1, -1));;
    } else {
        return false;
    }
};

console.log(isPalindrome("abccba"));