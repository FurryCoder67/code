const copyArrayAndDouble = (array) => {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(array[i] * 2);
    }
    return newArray;
};

const testArray = Object.freeze([1, 2, 3]);

const copyArrayAndDoubleResult = copyArrayAndDouble(testArray);
console.log('copyArrayAndDoubleResult: ', copyArrayAndDoubleResult);

const doubleNumber = (number) => {
    return number * 2;
};