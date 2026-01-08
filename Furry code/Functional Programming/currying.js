const addCustomer = fn => (...args) => {
    console.log('Saving customer info...');
    return fn(args);
};

const processOrder = fn => (...args) => {
    console.log(`processing order #${args[0]}`);
    return fn(args);
};

let completeOrder = (...args) => {
    console.log(`Order #${[...args].toString()} completed`);
};

/* completeOrder = (processOrder(completeOrder));
console.log(completeOrder);
completeOrder = (addCustomer(completeOrder));
completeOrder("1000"); */

const multiply = a => b => c => a * b * c;
const multiplym = a => {
    return (b) => {
        return (c) => {
            return a * b * c;
        };
    };
};
/* console.log(multiply(6)(7)(10)); */

const greet = greeting => firstName => lastName => `${greeting}, ${firstName} ${lastName}`;
/* console.log(greet("Hello")("John")("Doe")); */
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 25 }
];
const filterBy = propertyName => {
    return (propertyValue) => {
        return (array) => {
            return array.filter(curr => curr.age == propertyValue);
        };
    };
};

const filterByAge25 = filterBy("age")(25);
/* console.log(filterByAge25(users)); */

const sum = (x) => {
    let total = x;
    return function next(y) {
        if (y === undefined) {
            return total;
        }
        total += y;
        return next;
    }
};

const aSum = sum(1)(2)(3)(4)(5)(6)(7)(8)(9)(10);
/* console.log(aSum); */


// Has Property Checker

function hasProperty(obj, property) {
    return obj[property] != undefined;
}
console.log(hasProperty({ name: "Bug", age: 67 }, "name"));