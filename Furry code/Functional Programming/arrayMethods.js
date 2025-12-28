const numbers = [2, 4, 8, 10];
const halfValues = numbers.map(x => x / 2);

//console.log('halfValues: ', halfValues);

/*-----------------------------*/

const moreNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenNumbers = moreNumbers.filter(number => number % 2 === 0);

//console.log('evenNumbers: ', evenNumbers);

/*-----------------------------*/

const evenMoreNumbers = [2, 3, 4];
const reducedValueOfAllPlus1 = evenMoreNumbers.reduce((sum, value) => sum + value, 1);

//console.log('reducedValueOfAllPlus1', reducedValueOfAllPlus1);

// Bonus function compisition

const add1 = num => num + 1;
const add2 = num => num + 2;
const runFunctionOnInput = (input, fn) => {
    return fn(input);
};
const reducedValue = [add1, add2].reduce(runFunctionOnInput, 0);

//console.log('reducedValue', reducedValue);

// Multiplication example

const arrToMultiply = [6, 7, 5, 1, 10];
const multiplyNums = (num1, num2) => {
    return num1 * num2;
};
const multipledNums = arrToMultiply.reduce(multiplyNums);
//console.log(`Multiplied Nums: ${multipledNums}`);

// Counting Example

const arr = ["a", "b", "a", "c", "b", "a"];

const countOccurences = (acc, curr) => {
    if (acc[curr] !== undefined) {
        acc[curr] += 1;
    } else {
        acc[curr] = 1;
    }
    return acc;
};

// Flatten Array

const nestedArr = [["a", "b"], ["a", "c"], ["b", "a"], 'd'];
const flattenArray = (acc, curr) => {
    for (let i = 0; i < curr.length; i++) {
        acc.push(curr[i]);
    }
    return acc;
};
const flattened = nestedArr.reduce(flattenArray, []);
//console.log(`Flattened array is: [${flattened}]`);

// Group By Age

const groupByAge = (acc, curr) => {
    if (acc[curr.age] === undefined) {
        acc[curr.age] = [];
    }
    //console.log(curr.name);
    acc[curr.age].push(curr.name);
    return acc;
};
const group = [
    { name: "Alice", age: 24 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 24 }
];

/*
{
24, [Alice, Charlie],
25, [Bob]
}

*/
const grouped = group.reduce(groupByAge, {});
//console.log(grouped);

// Double Number

const array = [1, 2, 3, 4];
const doubleNumber = (acc, curr) => {
    acc.push(Number(curr * 2));
    return acc;
};
const doubledArray = array.reduce(doubleNumber, []);
//console.log(doubledArray);

// Pipeline Fn
const fns = [x => x + 1, x => x * 2, x => x - 3];
const pipeline = fns.reduce((acc, curr) => { return curr(acc); }, 5);
console.log(pipeline);