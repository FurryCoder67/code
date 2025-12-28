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
countUp(5);

/----------------------/