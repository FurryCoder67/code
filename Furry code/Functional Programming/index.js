const copyArrayAndDouble = (array) => {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(array[i] * 2);
    }
    return newArray;
};

const testArray = Object.freeze([1, 2, 3]);

const copyArrayAndDoubleResult = copyArrayAndDouble(testArray);
//console.log('copyArrayAndDoubleResult: ', copyArrayAndDoubleResult);

const doubleNumber = (number) => {
    return number * 2;
};

const copyArrayAndManipulate = (array, manipulation) => {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(manipulation(array[i]));
    }
    return newArray;
};

const copyArrayAndManupulateResult = copyArrayAndManipulate(testArray, doubleNumber);
//console.log('copyArrayAndManipulateResult: ', copyArrayAndManupulateResult);

// Private Variable

const createSecret = (secret) => {
    return { getSecret() { return secret } };
};
const s = createSecret("js is cool");
console.log(s.getSecret());
console.log(s.secret);

// Function Factory

